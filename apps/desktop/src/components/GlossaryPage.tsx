import React, { useEffect, useMemo, useState } from 'react';
import { BookMarked, ChevronDown, ChevronUp, Lightbulb, Search, Sparkles, X } from 'lucide-react';
import type { GlossaryCategory, GlossaryTerm } from '../types/curriculum';
import { InlineMarkdown } from '../utils/RichText';

interface GlossaryPageProps {
  terms: GlossaryTerm[];
  initialSearch?: string;
}

const CATEGORIES: Array<{ id: GlossaryCategory | 'all'; label: string }> = [
  { id: 'all', label: 'All Terms' },
  { id: 'foundations', label: 'Foundations' },
  { id: 'tokens', label: 'Tokens & Prompts' },
  { id: 'money', label: 'Credits & Keys' },
  { id: 'agents', label: 'Harnesses & Agents' },
  { id: 'cli', label: 'Terminal & CLI' },
  { id: 'building', label: 'Building Sites & Apps' },
];

export const GlossaryPage: React.FC<GlossaryPageProps> = ({ terms, initialSearch = '' }) => {
  const [query, setQuery] = useState(initialSearch);
  const [category, setCategory] = useState<GlossaryCategory | 'all'>('all');
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});
  const [expandAll, setExpandAll] = useState(false);

  useEffect(() => {
    if (initialSearch) {
      setQuery(initialSearch);
      setCategory('all');
    }
  }, [initialSearch]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return terms.filter((item) => {
      if (category !== 'all' && item.category !== category) return false;
      if (!q) return true;
      return (
        item.term.toLowerCase().includes(q) ||
        item.shortDef.toLowerCase().includes(q) ||
        item.analogy.toLowerCase().includes(q) ||
        item.example.toLowerCase().includes(q)
      );
    });
  }, [terms, query, category]);

  const toggleCard = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !(prev[id] ?? expandAll) }));
  };

  const handleToggleAll = () => {
    const next = !expandAll;
    setExpandAll(next);
    setExpandedIds({});
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-6 py-7">
      {/* Header & Search */}
      <section className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              <BookMarked className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              Plain-English AI Glossary
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Every scary-sounding AI buzzword translated into everyday language and real-life analogies.
            </p>
          </div>
          <button
            type="button"
            onClick={handleToggleAll}
            className="rounded-xl border border-slate-200 bg-[#FAFAF7] px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            {expandAll ? 'Collapse Analogies' : 'Expand All Analogies'}
          </button>
        </div>

        {/* Search bar */}
        <div className="relative mt-5">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search terms like token, API key, harness, MCP, hallucination..."
            className="w-full rounded-2xl border border-slate-200 bg-[#FAFAF7] py-3 pl-10 pr-10 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/15 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-emerald-500"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 hover:bg-slate-200/70 hover:text-slate-700 dark:hover:bg-slate-800"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {CATEGORIES.map((cat) => {
            const active = category === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                  active
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
          <span className="ml-auto text-xs font-semibold text-slate-400">
            Showing {filtered.length} of {terms.length}
          </span>
        </div>
      </section>

      {/* Glossary Cards Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
          <p className="text-base font-bold text-slate-800 dark:text-white">
            No glossary terms match &ldquo;{query}&rdquo;
          </p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Try a simpler word or clear the category filter.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setCategory('all');
            }}
            className="mt-4 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((item) => {
            const isExpanded = expandedIds[item.id] ?? expandAll;
            return (
              <div
                key={item.id}
                className="flex flex-col rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm transition hover:border-emerald-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-800"
              >
                <button
                  type="button"
                  onClick={() => toggleCard(item.id)}
                  className="flex w-full items-start justify-between gap-3 text-left"
                >
                  <div>
                    <span className="inline-block rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      {item.category}
                    </span>
                    <h3 className="mt-2 text-base font-extrabold text-slate-900 dark:text-white">
                      {item.term}
                    </h3>
                  </div>
                  <span className="mt-1 rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </span>
                </button>

                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  <InlineMarkdown text={item.shortDef} />
                </p>

                {isExpanded ? (
                  <div className="mt-4 space-y-2.5 border-t border-slate-100 pt-3.5 dark:border-slate-800">
                    <div className="rounded-xl border border-amber-200/80 bg-amber-50/70 p-3 text-xs leading-relaxed dark:border-amber-900/60 dark:bg-amber-950/35">
                      <p className="flex items-center gap-1 font-bold uppercase tracking-wide text-amber-700 dark:text-amber-400">
                        <Lightbulb className="h-3.5 w-3.5" />
                        Everyday Analogy
                      </p>
                      <p className="mt-1 text-slate-800 dark:text-slate-200">
                        <InlineMarkdown text={item.analogy} />
                      </p>
                    </div>

                    <div className="rounded-xl border border-blue-200/80 bg-blue-50/70 p-3 text-xs leading-relaxed dark:border-blue-900/60 dark:bg-blue-950/35">
                      <p className="flex items-center gap-1 font-bold uppercase tracking-wide text-blue-700 dark:text-blue-400">
                        <Sparkles className="h-3.5 w-3.5" />
                        In Practice
                      </p>
                      <p className="mt-1 text-slate-800 dark:text-slate-200">
                        <InlineMarkdown text={item.example} />
                      </p>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => toggleCard(item.id)}
                    className="mt-3 self-start text-xs font-semibold text-emerald-700 hover:text-emerald-800 dark:text-emerald-400"
                  >
                    See everyday analogy &amp; example &rarr;
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
