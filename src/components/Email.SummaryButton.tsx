import { useState } from "react";
import type { Task } from "../types/task";
import { sendTaskSummary } from "../services/email";

interface EmailSummaryButtonProps {
  todos: Task[];
  userEmail: string | null;
}

export function EmailSummaryButton({ todos, userEmail }: EmailSummaryButtonProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const hasTasks = todos.length > 0;

  async function handleSend() {
    if (!hasTasks || !userEmail) return;

    setStatus("loading");
    setErrorMsg("");

    try {
      await sendTaskSummary({ to: userEmail, summary: buildTodoSummary(todos) });
      setStatus("success");
    } catch (error) {
      setStatus("error");
      setErrorMsg(error instanceof Error ? error.message : "No se pudo conectar con el servidor.");
    }
  }

  return (
    <div className="email-summary-wrapper">
      <button
        className={`btn-email-summary ${status === "success" ? "btn-success" : ""}`}
        onClick={handleSend}
        disabled={status === "loading" || !hasTasks || !userEmail}
        title={!hasTasks ? "Agrega al menos una tarea para enviar un resumen" : undefined}
      >
        {status === "loading" ? (
          <>
            <span className="spinner-inline"></span> Enviando...
          </>
        ) : (
          "📧 Enviar mi resumen"
        )}
      </button>

      {status === "success" && (
        <div className="email-toast email-toast-success">
          ¡Email enviado!
          <button className="email-toast-close" onClick={() => setStatus("idle")}>✕</button>
        </div>
      )}

      {status === "error" && (
        <div className="email-toast email-toast-error">
          {errorMsg}
          <button className="email-toast-close" onClick={() => setStatus("idle")}>✕</button>
        </div>
      )}
    </div>
  );
}

// Construye el resumen de tareas
function buildTodoSummary(todos: Task[]): string {
  const pendientes = todos.filter(t => !t.completed).length;
  const completadas = todos.filter(t => t.completed).length;
  return `Pendientes: ${pendientes}\nCompletadas: ${completadas}`;
}

export default EmailSummaryButton;