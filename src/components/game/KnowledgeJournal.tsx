import { BookOpen, Bug, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deriveKnowledge, knowledgeLabels } from "@/game/knowledge";
import type { Held } from "@/game/types";

export function KnowledgeJournal({ held, debug = false, onClose }: { held: Held; debug?: boolean; onClose: () => void }) {
  const labels = knowledgeLabels(held);
  const knowledge = [...deriveKnowledge(held)];
  return (
    <div className="pointer-events-auto fixed inset-x-3 top-20 z-30 mx-auto max-w-lg rounded-xl border border-border bg-ink/95 p-4 text-sm shadow-2xl backdrop-blur-md sm:inset-x-auto sm:right-4 sm:top-24 sm:w-[26rem]" role="dialog" aria-modal="false" aria-labelledby="knowledge-journal-title">
      <div className="flex items-center justify-between gap-3">
        <h2 id="knowledge-journal-title" className="font-display text-lg font-semibold">Was du weißt</h2>
        <Button variant="ghost" size="default" className="h-9 w-9 px-0" onClick={onClose} aria-label="Wissenstagebuch schließen">
          <X className="size-4" aria-hidden />
        </Button>
      </div>
      {held.mal ? <p className="mt-3 text-sm leading-relaxed text-fg/90">{held.mal}</p> : null}
      <div className="mt-3 grid gap-4 sm:grid-cols-2">
        <section>
          <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-ok">Sicher</h3>
          {labels.sicher.length ? labels.sicher.map((line) => <p key={line} className="mb-1 text-fg">{line}</p>) : <p className="text-muted-fg">Noch keine sicheren Fakten.</p>}
        </section>
        <section>
          <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-accent">Offen</h3>
          {labels.offen.map((line) => <p key={line} className="mb-1 text-fg">{line}</p>)}
        </section>
      </div>
      {debug ? (
        <section className="mt-4 border-t border-border pt-3">
          <h3 className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-muted-fg"><Bug className="size-3" aria-hidden /> Debug-Zustände</h3>
          <p className="mt-1 break-words font-mono text-[11px] text-subtle-fg">{knowledge.join(" · ")}</p>
        </section>
      ) : null}
    </div>
  );
}

export const KnowledgeIcon = BookOpen;
