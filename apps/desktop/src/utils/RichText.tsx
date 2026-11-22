import React from 'react';

const INLINE_TOKEN_RE = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*\s](?:[^*]*[^*\s])?\*)/g;

/**
 * Safely renders inline Markdown (`code`, **bold**, *italic*) as clean React nodes.
 * Zero dangerouslySetInnerHTML, zero external dependencies.
 */
export const InlineMarkdown: React.FC<{
  text: string;
  className?: string;
  inverted?: boolean;
}> = ({ text, className, inverted = false }) => {
  if (!text) return null;

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  const regex = new RegExp(INLINE_TOKEN_RE.source, 'g');

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    const token = match[0];
    const key = `tok-${match.index}`;

    if (token.startsWith('`') && token.endsWith('`') && token.length >= 2) {
      parts.push(
        <code
          key={key}
          className={
            inverted
              ? 'mx-0.5 rounded-md border border-white/25 bg-white/15 px-1.5 py-0.5 font-mono text-[0.86em] font-medium text-white'
              : 'mx-0.5 rounded-md border border-slate-200/90 bg-slate-100/90 px-1.5 py-0.5 font-mono text-[0.86em] font-medium text-emerald-800 dark:border-slate-700 dark:bg-slate-800 dark:text-emerald-300'
          }
        >
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith('**') && token.endsWith('**') && token.length >= 4) {
      parts.push(
        <strong
          key={key}
          className={inverted ? 'font-bold text-white' : 'font-bold text-slate-900 dark:text-white'}
        >
          <InlineMarkdown text={token.slice(2, -2)} inverted={inverted} />
        </strong>
      );
    } else if (token.startsWith('*') && token.endsWith('*') && token.length >= 2) {
      parts.push(
        <em key={key} className="italic">
          <InlineMarkdown text={token.slice(1, -1)} inverted={inverted} />
        </em>
      );
    } else {
      parts.push(token);
    }

    lastIndex = match.index + token.length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return className ? <span className={className}>{parts}</span> : <>{parts}</>;
};

/**
 * Renders multi-paragraph Varsity editorial prose with fenced code blocks,
 * bullet lists, numbered lists, and inline Markdown styling.
 */
export const RichMarkdownBody: React.FC<{
  text: string;
  className?: string;
}> = ({ text, className = 'space-y-3' }) => {
  if (!text) return null;

  // Split around fenced code blocks first so internal blank lines stay intact
  const segments = text.split(/(```[\s\S]*?```)/g).filter((s) => s.length > 0);
  const blocks: React.ReactNode[] = [];

  segments.forEach((segment, segIdx) => {
    if (segment.startsWith('```') && segment.endsWith('```')) {
      const inner = segment.slice(3, -3).replace(/^[a-zA-Z0-9_-]*\n/, '').replace(/\n$/, '');
      blocks.push(
        <pre
          key={`code-${segIdx}`}
          className="overflow-x-auto rounded-2xl border border-slate-200 bg-slate-900 p-4 font-mono text-xs leading-relaxed text-emerald-300 dark:border-slate-700 dark:bg-slate-950"
        >
          <code>{inner}</code>
        </pre>
      );
      return;
    }

    const paragraphs = segment
      .trim()
      .split(/\n{2,}/)
      .map((p) => p.trim())
      .filter(Boolean);

    paragraphs.forEach((para, pIdx) => {
      const lines = para.split('\n').map((l) => l.trim()).filter(Boolean);
      const allBullets = lines.length > 0 && lines.every((l) => /^[-•*]\s+/.test(l));
      const allNumbered = lines.length > 0 && lines.every((l) => /^\d+\.\s+/.test(l));

      if (allBullets) {
        blocks.push(
          <ul key={`ul-${segIdx}-${pIdx}`} className="space-y-1.5 pl-1">
            {lines.map((line, lIdx) => (
              <li key={lIdx} className="flex items-start gap-2.5">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                <span>
                  <InlineMarkdown text={line.replace(/^[-•*]\s+/, '')} />
                </span>
              </li>
            ))}
          </ul>
        );
      } else if (allNumbered) {
        blocks.push(
          <ol key={`ol-${segIdx}-${pIdx}`} className="space-y-1.5 pl-1">
            {lines.map((line, lIdx) => {
              const numMatch = line.match(/^(\d+)\.\s+(.*)$/);
              return (
                <li key={lIdx} className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-emerald-100 text-[11px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    {numMatch ? numMatch[1] : lIdx + 1}
                  </span>
                  <span>
                    <InlineMarkdown text={numMatch ? numMatch[2] : line} />
                  </span>
                </li>
              );
            })}
          </ol>
        );
      } else {
        // Mixed lines (e.g. a lead-in line followed by bullets/numbered items)
        const hasEmbeddedList =
          lines.length > 1 && lines.some((l) => /^([-•*]\s+|\d+\.\s+)/.test(l));

        if (hasEmbeddedList) {
          blocks.push(
            <div key={`mix-${segIdx}-${pIdx}`} className="space-y-1.5">
              {lines.map((line, lIdx) => {
                if (/^[-•*]\s+/.test(line)) {
                  return (
                    <div key={lIdx} className="flex items-start gap-2.5 pl-1">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                      <span>
                        <InlineMarkdown text={line.replace(/^[-•*]\s+/, '')} />
                      </span>
                    </div>
                  );
                }
                const numMatch = line.match(/^(\d+)\.\s+(.*)$/);
                if (numMatch) {
                  return (
                    <div key={lIdx} className="flex items-start gap-2.5 pl-1">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-emerald-100 text-[11px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        {numMatch[1]}
                      </span>
                      <span>
                        <InlineMarkdown text={numMatch[2]} />
                      </span>
                    </div>
                  );
                }
                return (
                  <p key={lIdx}>
                    <InlineMarkdown text={line} />
                  </p>
                );
              })}
            </div>
          );
        } else {
          blocks.push(
            <p key={`p-${segIdx}-${pIdx}`}>
              <InlineMarkdown text={lines.join(' ')} />
            </p>
          );
        }
      }
    });
  });

  return <div className={className}>{blocks}</div>;
};
