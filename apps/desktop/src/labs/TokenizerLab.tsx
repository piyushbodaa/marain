import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  BookOpen,
  Cpu,
  Eye,
  FileText,
  Info,
  Layers,
  Loader2,
  Send,
  Sparkles,
} from 'lucide-react';
import type { LabProps } from './types';
import { buildProviderCallRequest, isByokReady, testProviderCall } from './bridge';
import { LabHeader, MissionChecklist } from './LabShared';

interface TokenPiece {
  id: number;
  text: string;
  bytes: number;
  chars: number;
  kind: 'word' | 'subword' | 'number' | 'punct' | 'whitespace' | 'multibyte';
  reason: string;
}

interface PresetItem {
  id: string;
  label: string;
  caption: string;
  text: string;
}

const PRESETS: PresetItem[] = [
  {
    id: 'strawberry',
    label: 'Strawberry R count',
    caption: 'Classic puzzle showing why AI miscounts letters!',
    text: 'How many letter "r"s are in strawberry? Humans spell s-t-r-a-w-b-e-r-r-y, while AI reads chunks like straw + ber + ry!',
  },
  {
    id: 'emoji',
    label: 'Emoji & multilingual text',
    caption: 'See how emojis & non-English words cost more tokens.',
    text: 'Hello 🌍! Bonjour café ☕, नमस्ते दुनिया 🚀, こんにちは AI 🤖! One emoji can take 2–3 tokens.',
  },
  {
    id: 'python',
    label: 'Simple Python snippet',
    caption: 'Spaces, underscores, and symbols split into code tokens.',
    text: 'def greet_learner(name):\n    xp = 75\n    return f"Welcome to Zero2AI, {name}! (+{xp} XP)"',
  },
  {
    id: 'email',
    label: 'Long email',
    caption: 'Everyday English averages ~4 characters per token.',
    text: 'Hi Maya,\n\nThanks for trying our new sourdough bakery website! Our weekend croissant bundle is $18.50 and launches Saturday at 9:00 AM.\n\nReply if you want us to save two boxes for your team.\n\nWarmly,\nSam @ Sunrise Bakehouse',
  },
];

// Known common subword IDs to feel authentically like BPE vocabulary tables
const KNOWN_VOCAB_IDS: Record<string, number> = {
  the: 279,
  ' the': 279,
  ' in': 304,
  ' is': 374,
  ' to': 311,
  ' AI': 15592,
  AI: 15836,
  straw: 45128,
  ' straw': 45128,
  ber: 924,
  ry: 584,
  berry: 25410,
  def: 755,
  return: 471,
  ' return': 471,
  Hello: 9906,
  '\n': 198,
  '\n\n': 271,
};

function stableTokenId(piece: string): number {
  if (KNOWN_VOCAB_IDS[piece] !== undefined) return KNOWN_VOCAB_IDS[piece];
  let hash = 2166136261;
  for (let i = 0; i < piece.length; i += 1) {
    hash ^= piece.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return 1000 + (Math.abs(hash) % 98999);
}

function utf8ByteLength(str: string): number {
  if (typeof TextEncoder !== 'undefined') {
    return new TextEncoder().encode(str).length;
  }
  return unescape(encodeURIComponent(str)).length;
}

const KNOWN_SPLITS: Record<string, string[]> = {
  strawberry: ['straw', 'ber', 'ry'],
  Strawberry: ['Straw', 'ber', 'ry'],
  sourdough: ['sour', 'dough'],
  croissant: ['cro', 'iss', 'ant'],
  Zero2AI: ['Zero', '2', 'AI'],
  Bakehouse: ['Bake', 'house'],
  multilingual: ['multi', 'ling', 'ual'],
  miscounts: ['mis', 'counts'],
  greet_learner: ['greet', '_', 'learn', 'er'],
};

const COMMON_SUFFIXES = ['tion', 'ment', 'ness', 'able', 'ible', 'ing', 'ous', 'ful', 'less', 'ized', 'ies', 'ly', 'ed'];

function splitLongWord(word: string): string[] {
  if (KNOWN_SPLITS[word]) return KNOWN_SPLITS[word];
  if (word.length <= 6) return [word];

  for (const suffix of COMMON_SUFFIXES) {
    if (word.endsWith(suffix) && word.length - suffix.length >= 3) {
      return [word.slice(0, word.length - suffix.length), suffix];
    }
  }

  if (word.length > 9) {
    const mid = Math.ceil(word.length / 2);
    return [word.slice(0, mid), word.slice(mid)];
  }
  return [word];
}

function tokenizeText(input: string): TokenPiece[] {
  if (!input) return [];

  const tokens: TokenPiece[] = [];
  const rawRegex =
    /(\n\n|\n|[ ]{4}| ?[A-Za-z]+(?:'[A-Za-z]+)?|[0-9]{1,3}| ?[^\sA-Za-z0-9\x00-\x7F]+| ?[^\sA-Za-z0-9]|[ ]+)/gu;

  const matches = input.match(rawRegex) || [];

  for (const chunk of matches) {
    if (chunk === '\n' || chunk === '\n\n') {
      tokens.push({
        id: stableTokenId(chunk),
        text: chunk,
        bytes: utf8ByteLength(chunk),
        chars: chunk.length,
        kind: 'whitespace',
        reason: 'Line breaks are their own special token so AI knows where paragraphs start.',
      });
      continue;
    }

    if (/^[ ]+$/.test(chunk)) {
      tokens.push({
        id: stableTokenId(chunk),
        text: chunk,
        bytes: chunk.length,
        chars: chunk.length,
        kind: 'whitespace',
        reason: 'Indentation spaces (common in code) get grouped into whitespace tokens.',
      });
      continue;
    }

    // Non-ASCII (emoji, Hindi, Japanese, accented chars)
    if (/[^\x00-\x7F]/.test(chunk)) {
      const chars = Array.from(chunk);
      let leadingSpace = '';
      let idx = 0;
      if (chars[0] === ' ') {
        leadingSpace = ' ';
        idx = 1;
      }
      // Split non-ASCII clusters realistically (emojis and scripts often become 1–2 tokens per char/pair)
      for (let i = idx; i < chars.length; i += 2) {
        const slice = (i === idx ? leadingSpace : '') + chars.slice(i, i + 2).join('');
        const bytes = utf8ByteLength(slice);
        tokens.push({
          id: stableTokenId(slice),
          text: slice,
          bytes,
          chars: Array.from(slice).length,
          kind: 'multibyte',
          reason:
            bytes >= 4
              ? `Takes ${bytes} UTF-8 bytes! Emojis and non-English scripts often need extra tokens compared to plain English.`
              : `Accented or non-Latin characters use ${bytes} UTF-8 bytes.`,
        });
      }
      continue;
    }

    // Contraction e.g. " don't" -> " don" + "'t"
    const contraction = chunk.match(/^( ?)([A-Za-z]+)('[A-Za-z]+)$/);
    if (contraction) {
      const [, sp, base, tail] = contraction;
      const first = sp + base;
      tokens.push({
        id: stableTokenId(first),
        text: first,
        bytes: utf8ByteLength(first),
        chars: first.length,
        kind: 'word',
        reason: sp
          ? 'Notice the leading space is glued onto the front of this word!'
          : 'Common English word stored as a single token.',
      });
      tokens.push({
        id: stableTokenId(tail),
        text: tail,
        bytes: utf8ByteLength(tail),
        chars: tail.length,
        kind: 'subword',
        reason: 'Contraction endings like "\'t" or "\'s" are split into their own subword token.',
      });
      continue;
    }

    // Alphabetic words (optionally with leading space)
    const alpha = chunk.match(/^( ?)([A-Za-z]+)$/);
    if (alpha) {
      const [, sp, word] = alpha;
      const parts = splitLongWord(word);
      parts.forEach((part, partIdx) => {
        const piece = partIdx === 0 ? sp + part : part;
        const isSplit = parts.length > 1;
        tokens.push({
          id: stableTokenId(piece),
          text: piece,
          bytes: utf8ByteLength(piece),
          chars: piece.length,
          kind: isSplit ? 'subword' : 'word',
          reason: isSplit
            ? `Subword chunk (${partIdx + 1}/${parts.length}) of "${word}" — AI sees whole chunks like "${part}", not individual letters!`
            : sp
              ? 'Common word with its leading space attached — super efficient (1 token).'
              : 'Common word recognized as a single vocabulary token.',
        });
      });
      continue;
    }

    // Numbers
    if (/^[0-9]+$/.test(chunk)) {
      tokens.push({
        id: stableTokenId(chunk),
        text: chunk,
        bytes: chunk.length,
        chars: chunk.length,
        kind: 'number',
        reason: 'Modern tokenizers group digits into 1–3 digit chunks (e.g., 2026 -> 202 + 6 or 1 chunk).',
      });
      continue;
    }

    // Punctuation
    tokens.push({
      id: stableTokenId(chunk),
      text: chunk,
      bytes: utf8ByteLength(chunk),
      chars: chunk.length,
      kind: 'punct',
      reason: 'Punctuation and symbols are usually separate tokens.',
    });
  }

  return tokens;
}

const TOKEN_PILL_COLORS = [
  'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-200 dark:border-emerald-800',
  'bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-950/80 dark:text-blue-200 dark:border-blue-800',
  'bg-violet-100 text-violet-900 border-violet-300 dark:bg-violet-950/80 dark:text-violet-200 dark:border-violet-800',
  'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/80 dark:text-amber-200 dark:border-amber-800',
  'bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-950/80 dark:text-rose-200 dark:border-rose-800',
  'bg-cyan-100 text-cyan-900 border-cyan-300 dark:bg-cyan-950/80 dark:text-cyan-200 dark:border-cyan-800',
];

interface ContextModelOption {
  id: string;
  label: string;
  windowTokens: number;
  approxPages: string;
  tagline: string;
}

const CONTEXT_MODELS: ContextModelOption[] = [
  { id: '8k', label: '8K (Small Local)', windowTokens: 8000, approxPages: '~12 pages', tagline: 'Tiny desk — fills up fast' },
  { id: '32k', label: '32K (Classic)', windowTokens: 32000, approxPages: '~50 pages', tagline: 'Good for short chats' },
  { id: '128k', label: '128K (GPT-4o)', windowTokens: 128000, approxPages: '~200 pages', tagline: 'Fits a short novel' },
  { id: '200k', label: '200K (Claude)', windowTokens: 200000, approxPages: '~320 pages', tagline: 'Fits a big project' },
  { id: '1m', label: '1M (Gemini 2.5)', windowTokens: 1000000, approxPages: '~1,500 pages', tagline: 'Giant conference table' },
];

function formatVisibleToken(text: string): string {
  return text.replace(/\n/g, '↵').replace(/ /g, '·');
}

export const TokenizerLab: React.FC<LabProps> = ({
  onCompleteLab,
  completedLabs,
  apiConfig,
  onOpenSettings,
}) => {
  const [text, setText] = useState<string>(PRESETS[0].text);
  const [activePreset, setActivePreset] = useState<string>(PRESETS[0].id);
  const [selectedTokenIndex, setSelectedTokenIndex] = useState<number | null>(null);
  const [hoveredTokenIndex, setHoveredTokenIndex] = useState<number | null>(null);

  // Context window desk state
  const [modelId, setModelId] = useState<string>('32k');
  const [conversationTokens, setConversationTokens] = useState<number>(18000);
  const [attachedDocsTokens, setAttachedDocsTokens] = useState<number>(4000);

  // Mission tracking
  const [triedEditor, setTriedEditor] = useState<boolean>(false);
  const [inspectedToken, setInspectedToken] = useState<boolean>(false);
  const [testedDesk, setTestedDesk] = useState<boolean>(false);

  // Optional live BYOK test
  const [liveAnswer, setLiveAnswer] = useState<string | null>(null);
  const [liveLoading, setLiveLoading] = useState<boolean>(false);
  const [liveError, setLiveError] = useState<string | null>(null);

  const tokens = useMemo(() => tokenizeText(text), [text]);
  const totalChars = text.length;
  const totalBytes = useMemo(() => utf8ByteLength(text), [text]);
  const charsPerToken = tokens.length > 0 ? (totalChars / tokens.length).toFixed(2) : '0.00';

  const activeTokenIdx = hoveredTokenIndex ?? selectedTokenIndex;
  const inspectedPiece = activeTokenIdx !== null ? tokens[activeTokenIdx] : null;

  const selectedModel =
    CONTEXT_MODELS.find((m) => m.id === modelId) || CONTEXT_MODELS[1];
  const systemPromptTokens = 1500;
  const currentReplyTokens = 1200;
  const totalUsedTokens =
    systemPromptTokens + attachedDocsTokens + conversationTokens + currentReplyTokens;
  const overflowTokens = Math.max(0, totalUsedTokens - selectedModel.windowTokens);
  const usedPct = Math.min(
    100,
    Math.round((totalUsedTokens / selectedModel.windowTokens) * 100)
  );
  const droppedMessages = overflowTokens > 0 ? Math.max(1, Math.ceil(overflowTokens / 650)) : 0;

  const sliderMax = selectedModel.windowTokens === 1000000 ? 1200000 : Math.min(260000, Math.round(selectedModel.windowTokens * 1.6));

  const handleSelectPreset = (preset: PresetItem) => {
    setText(preset.text);
    setActivePreset(preset.id);
    setSelectedTokenIndex(null);
    setTriedEditor(true);
  };

  const handleTextChange = (val: string) => {
    setText(val);
    setActivePreset('custom');
    setTriedEditor(true);
  };

  const handleAskLiveAi = async () => {
    if (!isByokReady(apiConfig)) {
      onOpenSettings();
      return;
    }
    setLiveLoading(true);
    setLiveError(null);
    setLiveAnswer(null);
    const req = buildProviderCallRequest(
      apiConfig,
      `Explain in 2 short beginner-friendly sentences why tokenizing this text matters:\n"${text.slice(0, 220)}"`,
      'You are a warm, plain-English AI teacher for complete beginners.'
    );
    const res = await testProviderCall(req);
    setLiveLoading(false);
    if (res.ok && res.text) {
      setLiveAnswer(
        `${res.text.trim()}${
          res.inputTokens ? `\n\n(Real API usage: ${res.inputTokens} input tokens, ${res.outputTokens ?? '?'} output tokens)` : ''
        }`
      );
    } else {
      setLiveError(res.error || 'Live request did not succeed.');
    }
  };

  const missionSteps = [
    {
      id: 'preset-or-edit',
      label: 'Try a different text preset or type your own sentence',
      done: triedEditor,
    },
    {
      id: 'inspect-pill',
      label: 'Click any colored token pill to inspect its Token ID & bytes',
      done: inspectedToken,
    },
    {
      id: 'desk-slider',
      label: 'Adjust the Context Window Desk slider or switch AI model size',
      done: testedDesk,
    },
  ];

  const isCompleted = completedLabs.includes('tokenizer');

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-8">
      <LabHeader
        badge="Lab 1 • Foundations"
        title="Tokenizer & Context Window Playground"
        subtitle="See how AI actually slices your words into numbered chunks (tokens) and what happens when its working desk overflows."
        xpReward={75}
        isCompleted={isCompleted}
        apiConfig={apiConfig}
        onOpenSettings={onOpenSettings}
        accent="emerald"
        icon={<Cpu className="h-6 w-6" />}
      />

      <MissionChecklist
        labId="tokenizer"
        xpReward={75}
        steps={missionSteps}
        completedLabs={completedLabs}
        onCompleteLab={onCompleteLab}
      />

      {/* PART 1: TOKENIZER PLAYGROUND */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              1. Live Subword Tokenizer
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              AI doesn&apos;t read letters one by one — it splits text into reusable Lego-like chunks called{' '}
              <strong className="text-slate-900 dark:text-white">tokens</strong>.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAskLiveAi}
            disabled={liveLoading}
            className="inline-flex items-center gap-1.5 self-start rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800 transition-colors hover:bg-emerald-100 disabled:opacity-60 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200 dark:hover:bg-emerald-900/60"
          >
            {liveLoading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Send className="h-3.5 w-3.5" />
            )}
            {isByokReady(apiConfig)
              ? 'Test Token Count on Live AI'
              : 'Connect Live AI (Optional)'}
          </button>
        </div>

        {/* Preset Chips */}
        <div className="mt-4 flex flex-wrap gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleSelectPreset(preset)}
              className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
                activePreset === preset.id
                  ? 'border-emerald-500 bg-emerald-500 text-white shadow-sm'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-emerald-300 hover:bg-emerald-50/50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-emerald-700'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Editor + Visualizer Grid */}
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div className="flex flex-col">
            <label
              htmlFor="tokenizer-input"
              className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
            >
              Type or paste any text
            </label>
            <textarea
              id="tokenizer-input"
              value={text}
              onChange={(e) => handleTextChange(e.target.value)}
              rows={6}
              placeholder="Try typing your name, an emoji, or a tricky word like strawberry..."
              className="w-full flex-1 resize-y rounded-xl border border-slate-200 bg-slate-50 p-3.5 font-mono text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            />
            <div className="mt-3 grid grid-cols-4 gap-2">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-center dark:border-slate-800 dark:bg-slate-800/50">
                <div className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
                  {tokens.length}
                </div>
                <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  Tokens
                </div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-center dark:border-slate-800 dark:bg-slate-800/50">
                <div className="text-lg font-extrabold text-slate-900 dark:text-white">
                  {totalChars}
                </div>
                <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  Characters
                </div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-center dark:border-slate-800 dark:bg-slate-800/50">
                <div className="text-lg font-extrabold text-slate-900 dark:text-white">
                  {totalBytes}
                </div>
                <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  UTF-8 Bytes
                </div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-center dark:border-slate-800 dark:bg-slate-800/50">
                <div className="text-lg font-extrabold text-blue-600 dark:text-blue-400">
                  {charsPerToken}
                </div>
                <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  Chars / Token
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                How AI sees your text ({tokens.length} colored chunks)
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                · = space • ↵ = newline
              </span>
            </div>

            <div className="min-h-[156px] flex-1 rounded-xl border border-slate-200 bg-slate-50/80 p-3.5 dark:border-slate-700 dark:bg-slate-950/70">
              {tokens.length === 0 ? (
                <p className="text-sm italic text-slate-400">
                  Start typing on the left to watch tokens appear live...
                </p>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {tokens.map((tok, idx) => {
                    const colorClass = TOKEN_PILL_COLORS[idx % TOKEN_PILL_COLORS.length];
                    const isActive = activeTokenIdx === idx;
                    return (
                      <button
                        key={`${tok.id}-${idx}`}
                        type="button"
                        onMouseEnter={() => setHoveredTokenIndex(idx)}
                        onMouseLeave={() => setHoveredTokenIndex(null)}
                        onClick={() => {
                          setSelectedTokenIndex(idx);
                          setInspectedToken(true);
                        }}
                        title={`Token ID #${tok.id} • ${tok.bytes} byte${tok.bytes === 1 ? '' : 's'}`}
                        className={`inline-flex items-baseline gap-1 rounded-lg border px-2 py-1 font-mono text-xs font-medium transition-all ${colorClass} ${
                          isActive ? 'scale-105 ring-2 ring-slate-900 dark:ring-white' : ''
                        }`}
                      >
                        <span>{formatVisibleToken(tok.text)}</span>
                        <span className="text-[10px] opacity-65">#{tok.id}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Live Token Inspector Bar */}
            <div className="mt-3 rounded-xl border border-blue-200 bg-blue-50/70 p-3 text-xs dark:border-blue-900/60 dark:bg-blue-950/40">
              {inspectedPiece ? (
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2 font-semibold text-blue-950 dark:text-blue-100">
                    <Eye className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                    <span>
                      Chunk:{' '}
                      <code className="rounded bg-white/80 px-1.5 py-0.5 font-mono dark:bg-slate-900">
                        {formatVisibleToken(inspectedPiece.text)}
                      </code>
                    </span>
                    <span className="rounded-md bg-blue-200/70 px-1.5 py-0.5 font-mono text-[11px] dark:bg-blue-900">
                      ID #{inspectedPiece.id}
                    </span>
                    <span className="rounded-md bg-white/70 px-1.5 py-0.5 text-[11px] dark:bg-slate-900">
                      {inspectedPiece.bytes} byte{inspectedPiece.bytes === 1 ? '' : 's'}
                    </span>
                  </div>
                  <p className="text-blue-900/90 dark:text-blue-200/90">{inspectedPiece.reason}</p>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-blue-900 dark:text-blue-200">
                  <Info className="h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />
                  <span>
                    Hover or click any colored token pill above to inspect its exact{' '}
                    <strong>Token ID</strong>, byte size, and why it split that way.
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Live AI Output if triggered */}
        {(liveAnswer || liveError) && (
          <div
            className={`mt-4 rounded-xl border p-3.5 text-xs ${
              liveError
                ? 'border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-200'
                : 'border-emerald-300 bg-emerald-50 text-emerald-950 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-100'
            }`}
          >
            <div className="font-semibold">
              {liveError ? 'Live AI Note' : `Live Response from ${apiConfig.provider.toUpperCase()}`}
            </div>
            <p className="mt-1 whitespace-pre-wrap">{liveError || liveAnswer}</p>
          </div>
        )}

        {/* Why AI Reads Chunks Explainer */}
        <div className="mt-4 rounded-xl border border-amber-200/80 bg-amber-50/70 p-4 dark:border-amber-900/50 dark:bg-amber-950/30">
          <div className="flex items-start gap-3">
            <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
            <div className="space-y-1 text-sm text-amber-950 dark:text-amber-100">
              <div className="font-bold">Why AI reads chunks, not letters (The &quot;Strawberry&quot; Secret)</div>
              <p className="text-xs leading-relaxed text-amber-900/90 dark:text-amber-200/90">
                When you ask &quot;How many R&apos;s are in strawberry?&quot;, an AI model never sees individual letters first — it receives token numbers like{' '}
                <code className="rounded bg-amber-200/60 px-1 font-mono dark:bg-amber-900/70">
                  [45128, 924, 584]
                </code>{' '}
                representing <code className="font-mono">straw</code> + <code className="font-mono">ber</code> +{' '}
                <code className="font-mono">ry</code>. That makes AI super fast at reading ideas, but slightly clumsy at spelling games unless it slows down to spell words out!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PART 2: CONTEXT WINDOW WORKING DESK VISUALIZER */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              2. Context Window &quot;Working Desk&quot; Visualizer
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Think of an AI&apos;s <strong className="text-slate-900 dark:text-white">Context Window</strong> as the size of its desk. Everything it needs to remember right now must fit on the desk!
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
            <Layers className="h-4 w-4 text-blue-500" />
            Desk Capacity: {selectedModel.windowTokens.toLocaleString()} tokens ({selectedModel.approxPages})
          </div>
        </div>

        {/* Model Window Picker */}
        <div className="mt-4 grid gap-2 sm:grid-cols-5">
          {CONTEXT_MODELS.map((m) => {
            const active = m.id === modelId;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  setModelId(m.id);
                  setTestedDesk(true);
                  if (m.windowTokens === 8000 && conversationTokens > 14000) {
                    setConversationTokens(10000);
                  }
                }}
                className={`rounded-xl border p-3 text-left transition-all ${
                  active
                    ? 'border-blue-500 bg-blue-50 shadow-sm ring-1 ring-blue-500 dark:border-blue-400 dark:bg-blue-950/60'
                    : 'border-slate-200 bg-slate-50/70 hover:border-blue-300 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-blue-700'
                }`}
              >
                <div className="text-xs font-bold text-slate-900 dark:text-white">{m.label}</div>
                <div className="mt-0.5 text-[11px] font-medium text-blue-600 dark:text-blue-400">
                  {m.approxPages}
                </div>
                <div className="mt-1 text-[10px] text-slate-500 dark:text-slate-400">
                  {m.tagline}
                </div>
              </button>
            );
          })}
        </div>

        {/* Controls */}
        <div className="mt-5 grid gap-5 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-5">
            <div>
              <div className="flex items-center justify-between text-xs font-semibold">
                <label htmlFor="desk-slider" className="text-slate-700 dark:text-slate-200">
                  Your Chat History Length
                </label>
                <span className="font-mono text-blue-600 dark:text-blue-400">
                  {conversationTokens.toLocaleString()} tokens (~{Math.max(1, Math.round(conversationTokens / 650))} turns)
                </span>
              </div>
              <input
                id="desk-slider"
                type="range"
                min={500}
                max={sliderMax}
                step={500}
                value={Math.min(conversationTokens, sliderMax)}
                onChange={(e) => {
                  setConversationTokens(Number(e.target.value));
                  setTestedDesk(true);
                }}
                className="mt-2 h-2 w-full cursor-pointer accent-blue-600"
              />
              <div className="mt-2 flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setConversationTokens(2000);
                    setAttachedDocsTokens(0);
                    setTestedDesk(true);
                  }}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  Quick Chat
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setConversationTokens(Math.round(selectedModel.windowTokens * 0.65));
                    setAttachedDocsTokens(Math.round(selectedModel.windowTokens * 0.15));
                    setTestedDesk(true);
                  }}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  Busy Coding Session
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setConversationTokens(Math.round(selectedModel.windowTokens * 1.25));
                    setAttachedDocsTokens(Math.round(selectedModel.windowTokens * 0.1));
                    setTestedDesk(true);
                  }}
                  className="rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1 text-[11px] font-semibold text-rose-700 hover:bg-rose-100 dark:border-rose-800 dark:bg-rose-950/60 dark:text-rose-300"
                >
                  Overflow the Desk!
                </button>
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                Attached Files on the Desk
              </div>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {[
                  { label: 'No files', tokens: 0 },
                  { label: '10-page PDF', tokens: 6000 },
                  { label: 'Big Codebase', tokens: 45000 },
                ].map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => {
                      setAttachedDocsTokens(opt.tokens);
                      setTestedDesk(true);
                    }}
                    className={`rounded-xl border px-2.5 py-2 text-xs font-semibold transition ${
                      attachedDocsTokens === opt.tokens
                        ? 'border-violet-500 bg-violet-50 text-violet-800 dark:border-violet-400 dark:bg-violet-950/60 dark:text-violet-200'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-violet-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    <div>{opt.label}</div>
                    <div className="text-[10px] font-normal opacity-75">
                      +{opt.tokens.toLocaleString()} tok
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div
              className={`rounded-xl border p-3.5 text-xs ${
                overflowTokens > 0
                  ? 'border-rose-300 bg-rose-50 text-rose-900 dark:border-rose-800 dark:bg-rose-950/50 dark:text-rose-200'
                  : usedPct > 75
                    ? 'border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-200'
                    : 'border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200'
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold">
                {overflowTokens > 0 ? (
                  <>
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    Desk Overflow! (~{droppedMessages} early messages fell off!)
                  </>
                ) : usedPct > 75 ? (
                  <>
                    <Info className="h-4 w-4 shrink-0" />
                    Desk is getting crowded ({usedPct}% full)
                  </>
                ) : (
                  <>
                    <BookOpen className="h-4 w-4 shrink-0" />
                    Plenty of room on the desk ({usedPct}% full)
                  </>
                )}
              </div>
              <p className="mt-1 leading-relaxed">
                {overflowTokens > 0
                  ? `You're trying to fit ${totalUsedTokens.toLocaleString()} tokens onto a ${selectedModel.windowTokens.toLocaleString()}-token desk. The oldest ${overflowTokens.toLocaleString()} tokens slide off the edge — that's why AI suddenly "forgets" your first instructions! Fix it by starting a fresh chat or running /compact.`
                  : usedPct > 75
                    ? 'AI can still see everything, but long cluttered desks can make models less focused. Summarizing or starting a clean topic helps.'
                    : 'AI can clearly see your system rules, attached files, and full conversation history at the same time.'}
              </p>
            </div>
          </div>

          {/* Visual Desk Representation */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-100/80 p-4 dark:border-slate-700 dark:bg-slate-950/60">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-300">
                <span>AI&apos;S WORKING DESK ({selectedModel.label})</span>
                <span className="font-mono">
                  {totalUsedTokens.toLocaleString()} / {selectedModel.windowTokens.toLocaleString()} tokens
                </span>
              </div>

              {/* Stacked Desk Bar */}
              <div className="mt-3 flex h-12 w-full overflow-hidden rounded-xl border border-slate-300 bg-white shadow-inner dark:border-slate-700 dark:bg-slate-900">
                {/* System rules */}
                <div
                  style={{
                    width: `${Math.max(4, Math.min(100, (systemPromptTokens / Math.max(selectedModel.windowTokens, totalUsedTokens)) * 100))}%`,
                  }}
                  title={`System Instructions: ${systemPromptTokens.toLocaleString()} tokens`}
                  className="flex items-center justify-center bg-amber-400/90 px-1 text-[10px] font-bold text-amber-950 transition-all"
                >
                  Rules
                </div>
                {/* Attached Docs */}
                {attachedDocsTokens > 0 && (
                  <div
                    style={{
                      width: `${Math.max(5, Math.min(100, (attachedDocsTokens / Math.max(selectedModel.windowTokens, totalUsedTokens)) * 100))}%`,
                    }}
                    title={`Attached Docs: ${attachedDocsTokens.toLocaleString()} tokens`}
                    className="flex items-center justify-center bg-violet-500 px-1 text-[10px] font-bold text-white transition-all"
                  >
                    Docs
                  </div>
                )}
                {/* Chat history that fits */}
                <div
                  style={{
                    width: `${Math.max(
                      6,
                      Math.min(
                        100,
                        (Math.max(0, conversationTokens - overflowTokens) /
                          Math.max(selectedModel.windowTokens, totalUsedTokens)) *
                          100
                      )
                    )}%`,
                  }}
                  title="Chat history visible on desk"
                  className="flex items-center justify-center bg-blue-500 px-1 text-[10px] font-bold text-white transition-all"
                >
                  Chat History
                </div>
                {/* Current prompt + reply */}
                <div
                  style={{
                    width: `${Math.max(4, Math.min(100, (currentReplyTokens / Math.max(selectedModel.windowTokens, totalUsedTokens)) * 100))}%`,
                  }}
                  title="Current message & AI reply"
                  className="flex items-center justify-center bg-emerald-500 px-1 text-[10px] font-bold text-white transition-all"
                >
                  Now
                </div>
                {/* Overflow region */}
                {overflowTokens > 0 && (
                  <div
                    style={{
                      width: `${Math.max(
                        10,
                        (overflowTokens / totalUsedTokens) * 100
                      )}%`,
                    }}
                    title={`Overflow: ${overflowTokens.toLocaleString()} tokens fell off!`}
                    className="flex items-center justify-center bg-rose-500 px-1 text-[10px] font-bold text-white transition-all"
                  >
                    FELL OFF!
                  </div>
                )}
              </div>

              {/* Desk Item Cards */}
              <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                    <FileText className="h-4 w-4 text-emerald-500" />
                    On the Desk (AI remembers)
                  </div>
                  <ul className="mt-2 space-y-1 text-xs text-slate-600 dark:text-slate-300">
                    <li className="flex items-center justify-between">
                      <span>📌 System Rules</span>
                      <span className="font-mono text-[11px]">{systemPromptTokens.toLocaleString()}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span>📎 Attached Files</span>
                      <span className="font-mono text-[11px]">{attachedDocsTokens.toLocaleString()}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span>💬 Recent Messages</span>
                      <span className="font-mono text-[11px]">
                        {Math.max(0, conversationTokens - overflowTokens).toLocaleString()}
                      </span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span>✨ Current Question + Reply</span>
                      <span className="font-mono text-[11px]">{currentReplyTokens.toLocaleString()}</span>
                    </li>
                  </ul>
                </div>

                <div
                  className={`rounded-xl border p-3 transition-all ${
                    overflowTokens > 0
                      ? 'border-rose-300 bg-rose-50 dark:border-rose-800 dark:bg-rose-950/40'
                      : 'border-slate-200 bg-white/60 dark:border-slate-800 dark:bg-slate-900/50'
                  }`}
                >
                  <div
                    className={`flex items-center gap-2 text-xs font-bold ${
                      overflowTokens > 0
                        ? 'text-rose-700 dark:text-rose-300'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    <AlertTriangle className="h-4 w-4" />
                    Fallen Off the Desk (Forgotten)
                  </div>
                  {overflowTokens > 0 ? (
                    <div className="mt-2 space-y-1.5 text-xs text-rose-800 dark:text-rose-200">
                      <p className="font-mono font-semibold">
                        {overflowTokens.toLocaleString()} tokens pushed off!
                      </p>
                      <div className="space-y-1">
                        <div className="rounded-md bg-rose-200/70 px-2 py-1 text-[11px] line-through dark:bg-rose-900/60">
                          Turn 1: &quot;Remember my brand tone is warm...&quot;
                        </div>
                        {droppedMessages > 1 && (
                          <div className="rounded-md bg-rose-200/70 px-2 py-1 text-[11px] line-through dark:bg-rose-900/60">
                            Turns 2–{droppedMessages}: Earlier project decisions...
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                      Nothing has fallen off! Slide &quot;Your Chat History Length&quot; past{' '}
                      {selectedModel.windowTokens.toLocaleString()} tokens (or click{' '}
                      <strong>Overflow the Desk!</strong>) to watch early messages drop off.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
