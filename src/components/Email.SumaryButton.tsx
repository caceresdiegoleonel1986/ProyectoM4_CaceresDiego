import React, { useState } from "react";
import type { Task } from "../types/task";

interface EmailSummaryButtonProps {
  todos: Task[];
  userEmail: string | null | undefined;
}

export function EmailSummaryButton({ todos, userEmail }: EmailSummaryButtonProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  async function handleSend() {
    setStatus("loading");
    setErrorMsg("");

    const summary = buildTodoSummary(todos);

    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: userEmail, summary }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setErrorMsg(data?.message || "Ocurrió un error al enviar el email.");
        return;
      }

      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg("No se pudo conectar con el servidor.");
    }
  }

  return (
    <div>
      <button onClick={handleSend} disabled={status === "loading"}>
        {status === "loading" ? "Enviando..." : "Enviar mi resumen"}
      </button>
      {status === "success" && <span style={{ color: "green" }}>¡Email enviado!</span>}
      {status === "error" && <span style={{ color: "red" }}>{errorMsg}</span>}
    </div>
  );
}

// Construye el resumen de tareas
function buildTodoSummary(todos: Task[]): string {
  const pendientes = todos.filter((t: Task) => !t.completed).length;
  const completadas = todos.filter((t: Task) => t.completed).length;
  return `Pendientes: ${pendientes}\nCompletadas: ${completadas}`;
}

export default EmailSummaryButton;