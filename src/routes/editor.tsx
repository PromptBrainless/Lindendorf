import { createFileRoute } from "@tanstack/react-router";
import { EditorApp } from "@/components/editor/EditorApp";

export const Route = createFileRoute("/editor")({ component: EditorPage });

function EditorPage() {
  return <EditorApp />;
}
