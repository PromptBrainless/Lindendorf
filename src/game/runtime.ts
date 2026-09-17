import { cloneHeld, type ArtKey, type Held, type PortraitKey, type SceneView } from "./types";

type PresentInput = {
  title?: string;
  art?: ArtKey;
  portrait?: PortraitKey | null;
  lines: string[];
  held?: Held;
  probe?: SceneView["probe"];
  log?: string[];
  ending?: string;
  choices?: string[];
};

export class Runtime {
  private generation = 0;
  private waiter: ((n: number) => void) | null = null;
  lastArt: ArtKey = "title";
  lastTitle = "Lindendorf";
  lastPortrait: PortraitKey | undefined;

  constructor(
    private readonly setView: (view: SceneView) => void,
    private readonly setHeld: (held: Held) => void,
  ) {}

  cancel() {
    this.generation += 1;
    this.waiter = null;
  }

  choose(index: number) {
    const wait = this.waiter;
    this.waiter = null;
    wait?.(index);
  }

  async present(input: PresentInput): Promise<number> {
    const gen = this.generation;
    if (input.art) this.lastArt = input.art;
    if (input.title) this.lastTitle = input.title;
    if (input.portrait === null) this.lastPortrait = undefined;
    else if (input.portrait) this.lastPortrait = input.portrait;

    if (input.held) this.setHeld(cloneHeld(input.held));

    const view: SceneView = {
      title: input.title ?? this.lastTitle,
      art: input.art ?? this.lastArt,
      portrait: input.portrait === null ? undefined : (input.portrait ?? this.lastPortrait),
      lines: input.lines,
      held: input.held ? cloneHeld(input.held) : undefined,
      probe: input.probe,
      log: input.log,
      ending: input.ending,
      choices: input.choices ?? ["Weiter"],
    };
    this.setView(view);

    return new Promise((resolve) => {
      this.waiter = (index) => {
        if (gen !== this.generation) return;
        resolve(index);
      };
    });
  }
}
