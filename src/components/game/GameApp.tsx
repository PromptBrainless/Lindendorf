import { useCallback, useEffect, useRef, useState } from "react";
import { Runtime } from "@/game/runtime";
import { spielen } from "@/game/script";
import { ART, PORTRAITS } from "@/game/art";
import { cloneHeld, type Held, type SceneView } from "@/game/types";
import { hasSavedGame, loadGame, saveGame } from "@/game/save";
import {
  karteSchluessel,
  ladeKarten,
  loescheKarte,
  setzeSpielleiterAktiv,
  speichereKarte,
  spielleiterAktiv,
  wendePatchAn,
  type KartePatch,
} from "@/game/spielleiter";
import { readAuthorMode, writeAuthorMode, loadFilePack } from "@/game/text-pack";
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
  const runtimeRef = useRef<Runtime | null>(null);

  const stopPlay = useCallback(() => {
    runtimeRef.current?.cancel();
    runtimeRef.current = null;
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
    const key = karteSchluessel(view);
    setSchluessel(key);
    setPatch(ladeKarten()[key] ?? {});
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
      setHeld(live);
      setSaveMessage(null);
      setKnowledgeOpen(false);
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
    },
    [schluessel],
  );

  const onResetKarte = useCallback(() => {
    setPatch({});
    if (schluessel) loescheKarte(schluessel);
  }, [schluessel]);

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
    />
  );
}
