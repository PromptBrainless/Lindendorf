import { useCallback, useEffect, useRef, useState } from "react";
import { Runtime } from "@/game/runtime";
import { spielen } from "@/game/script";
import { ART, PORTRAITS } from "@/game/art";
import { cloneHeld, type Held, type SceneView } from "@/game/types";
import { hasSavedGame, loadGame, saveGame } from "@/game/save";
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

  useEffect(() => () => stopPlay(), [stopPlay]);

  const startAdventure = useCallback(
    (hero: Held, resume = false) => {
      stopPlay();
      const live = cloneHeld(hero);
      setHeld(live);
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
    if (current && saveGame(current)) setCanLoad(true);
  }, [held, view]);

  if (mode === "title") {
    return (
      <TitleScreen
        onStart={() => setMode("create")}
        onRules={() => setMode("rules")}
        onLoad={loadAdventure}
        canLoad={canLoad}
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

  return (
    <SceneStage
      view={view.held ? view : held ? { ...view, held } : view}
      onChoose={(index) => runtimeRef.current?.choose(index)}
      onSave={saveCurrentGame}
    />
  );
}
