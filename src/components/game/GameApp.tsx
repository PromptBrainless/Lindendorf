import { useCallback, useEffect, useRef, useState } from "react";
import { Runtime } from "@/game/runtime";
import { spielen } from "@/game/script";
import { ART, PORTRAITS } from "@/game/art";
import { cloneHeld, type EffektId, type Held, type SceneView } from "@/game/types";
import { hasSavedGame, loadGame, saveGame } from "@/game/save";
import { hatEffekt, setzeEffekt } from "@/game/effekte";
import { wendeHerkunftAn } from "@/game/herkunft";
import {
  ladeKarten,
  loescheKarte,
  patchFuerSicht,
  setzeSpielleiterAktiv,
  speichereKarte,
  spielleiterAktiv,
  wendePatchAn,
  type KartePatch,
} from "@/game/spielleiter";
import { loadFilePack, readAuthorMode, upsertPatch, writeAuthorMode } from "@/game/text-pack";
import { CreateHero } from "./CreateHero";
import { RulesScreen } from "./RulesScreen";
import { SceneStage } from "./SceneStage";
import { TitleScreen } from "./TitleScreen";

type Mode = "title" | "rules" | "create" | "play";

export function GameApp() {
  const [mode, setMode] = useState<Mode>("title");
  const [view, setView] = useState<SceneView | null>(null);
  const [held, setHeld] = useState<Held | null>(null);
  const [canLoad, setCanLoad] = useState(() => hasSavedGame());
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [knowledgeOpen, setKnowledgeOpen] = useState(false);
  const [debug] = useState(() => typeof window !== "undefined" && new URLSearchParams(window.location.search).has("debug"));
  const [leiterOpen, setLeiterOpen] = useState(false);
  const [patch, setPatch] = useState<KartePatch>({});
  const [schluessel, setSchluessel] = useState("");
  const [authorMode, setAuthorMode] = useState(() => readAuthorMode());
  const [lageIndex, setLageIndex] = useState<number | null>(null);
  const runtimeRef = useRef<Runtime | null>(null);
  const liveRef = useRef<Held | null>(null);
  const kartenFortRef = useRef<EffektId[]>([]);

  const stopPlay = useCallback(() => {
    runtimeRef.current?.cancel();
    runtimeRef.current = null;
    liveRef.current = null;
    setView(null);
  }, []);

  useEffect(() => {
    for (const src of [...Object.values(ART), ...Object.values(PORTRAITS)]) {
      const image = new Image();
      image.src = src;
    }
  }, []);

  useEffect(() => {
    void loadFilePack();
  }, []);

  useEffect(() => () => stopPlay(), [stopPlay]);

  useEffect(() => {
    if (!view) return;
    const gefunden = patchFuerSicht(view);
    setSchluessel(gefunden.schluessel);
    setPatch(gefunden.patch);
  }, [view]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (!(event.altKey && event.key.toLowerCase() === "s")) return;
      event.preventDefault();
      setLeiterOpen((open) => {
        const next = !open;
        if (next) setzeSpielleiterAktiv(true);
        return next;
      });
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const startAdventure = useCallback(
    (hero: Held, resume = false) => {
      stopPlay();
      const live = cloneHeld(hero);
      liveRef.current = live;
      setHeld(live);
      setSaveMessage(null);
      setKnowledgeOpen(false);
      setLageIndex(null);
      setLeiterOpen(spielleiterAktiv() || readAuthorMode());
      setMode("play");
      const runtime = new Runtime(setView, setHeld);
      runtimeRef.current = runtime;
      void spielen(runtime, live, resume)
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          if (runtimeRef.current === runtime) {
            runtimeRef.current = null;
            liveRef.current = null;
            setHeld(null);
            setMode("title");
            setView(null);
            setCanLoad(hasSavedGame());
          }
        });
    },
    [stopPlay],
  );

  const loadAdventure = useCallback(() => {
    const saved = loadGame();
    if (saved) startAdventure(saved, true);
    else setCanLoad(false);
  }, [startAdventure]);

  const saveCurrentGame = useCallback(() => {
    const current = view?.held ?? held;
    if (current && saveGame(current)) {
      setCanLoad(true);
      setSaveMessage("Gespeichert. Laden setzt am Dorfplatz fort.");
    } else {
      setSaveMessage("Speichern war in diesem Browser nicht möglich.");
    }
  }, [held, view]);

  const onPatch = useCallback(
    (next: KartePatch) => {
      setPatch(next);
      if (schluessel) speichereKarte(schluessel, next);
      const karte = view?.original;
      if (karte) {
        upsertPatch(karte, {
          title: next.title,
          lines: next.lines,
          choices: next.choices,
        });
      }
    },
    [schluessel, view],
  );

  const onResetKarte = useCallback(() => {
    setPatch({});
    if (schluessel) loescheKarte(schluessel);
  }, [schluessel]);

  const onEffekt = useCallback((id: EffektId, an: boolean) => {
    const live = liveRef.current;
    if (!live) return;
    setzeEffekt(live, id, an);
    const next = cloneHeld(live);
    setHeld(next);
    setView((current) => (current ? { ...current, held: next } : current));
  }, []);

  const onHerkunft = useCallback((frageIndex: number, antwortIndex: number) => {
    const live = liveRef.current;
    if (!live) return;
    const getroffen = wendeHerkunftAn(live, frageIndex, antwortIndex);
    if (!getroffen) return;
    const next = cloneHeld(live);
    setHeld(next);
    setView((current) => (current ? { ...current, held: next } : current));
    setLageIndex(null);
  }, []);

  const onLageVorlegen = useCallback((frageIndex: number) => {
    setLageIndex(frageIndex);
    setLeiterOpen(false);
  }, []);

  useEffect(() => {
    const live = liveRef.current;
    if (!live) return;
    let changed = false;
    for (const id of kartenFortRef.current) {
      if (hatEffekt(live, id)) {
        setzeEffekt(live, id, false);
        changed = true;
      }
    }
    for (const id of patch.effekte ?? []) {
      if (!hatEffekt(live, id)) {
        setzeEffekt(live, id, true);
        changed = true;
      }
    }
    kartenFortRef.current = patch.effekteFort ?? [];
    if (!changed) return;
    const next = cloneHeld(live);
    setHeld(next);
    setView((current) => (current ? { ...current, held: next } : current));
  }, [patch.effekte, patch.effekteFort, view?.textKey]);

  if (mode === "title") {
    return (
      <TitleScreen
        onStart={() => setMode("create")}
        onRules={() => setMode("rules")}
        onLoad={loadAdventure}
        canLoad={canLoad}
        authorMode={authorMode}
        onToggleAuthor={() => {
          const next = !authorMode;
          writeAuthorMode(next);
          setAuthorMode(next);
          if (next) setzeSpielleiterAktiv(true);
        }}
      />
    );
  }
  if (mode === "rules") {
    return <RulesScreen onBack={() => setMode("title")} />;
  }
  if (mode === "create") {
    return <CreateHero onReady={startAdventure} onBack={() => setMode("title")} />;
  }

  if (!view) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-bg text-muted-fg">
        Der Wald hält den Atem an…
      </div>
    );
  }

  const raw = view.held ? view : held ? { ...view, held } : view;
  const shown = wendePatchAn(raw, patch);

  return (
    <SceneStage
      view={shown}
      original={raw}
      onChoose={(index) => runtimeRef.current?.choose(index)}
      onSave={saveCurrentGame}
      saveMessage={saveMessage}
      onKnowledge={() => setKnowledgeOpen((open) => !open)}
      knowledgeOpen={knowledgeOpen}
      debug={debug}
      leiterOpen={leiterOpen}
      patch={patch}
      schluessel={schluessel}
      onLeiter={() => {
        setLeiterOpen((open) => {
          const next = !open;
          if (next) setzeSpielleiterAktiv(true);
          return next;
        });
      }}
      onPatch={onPatch}
      onResetKarte={onResetKarte}
      authorMode={authorMode}
      onEffekt={onEffekt}
      onHerkunft={onHerkunft}
      onLageVorlegen={onLageVorlegen}
      lageIndex={lageIndex}
      onLageAntwort={(antwortIndex) => {
        if (lageIndex === null) return;
        onHerkunft(lageIndex, antwortIndex);
      }}
      onLageSchliessen={() => setLageIndex(null)}
    />
  );
}
