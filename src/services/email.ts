export interface SendTaskSummaryPayload {
    to: string;
    summary: string;
}

export interface SendTaskSummaryResult {
    ok: boolean;
    message: string;
}

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

// Valida el payload en el cliente antes de golpear el endpoint serverless
export function validateTaskSummaryPayload(payload: SendTaskSummaryPayload): string | null {
    if (!payload.to || !isValidEmail(payload.to)) {
        return "El correo del destinatario no es válido.";
    }
    if (!payload.summary || payload.summary.trim().length === 0) {
        return "No hay un resumen de tareas para enviar.";
    }
    return null;
}

// Envía el resumen de tareas al endpoint serverless /api/send-email (AWS SES)
export async function sendTaskSummary(payload: SendTaskSummaryPayload): Promise<SendTaskSummaryResult> {
    const validationError = validateTaskSummaryPayload(payload);
    if (validationError) {
        throw new Error(validationError);
    }

    let response: Response;
    try {
        response = await fetch("/api/send-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
    } catch {
        throw new Error("No se pudo conectar con el servidor.");
    }

    const data = (await response.json()) as { message?: string };

    if (!response.ok) {
        throw new Error(data?.message || "Ocurrió un error al enviar el email.");
    }

    return { ok: true, message: data?.message ?? "Email enviado correctamente" };
}