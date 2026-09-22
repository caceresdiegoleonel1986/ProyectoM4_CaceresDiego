// Normaliza errores de Firebase Auth (o mocks en tests) sin recurrir a 'any'
export function getAuthErrorMessage(err: unknown): { code: string; message: string } {
    const hasCode = typeof err === "object" && err !== null && "code" in err;
    const code = hasCode ? String((err as { code: unknown }).code) : "unknown";

    const hasMessage = typeof err === "object" && err !== null && "message" in err;
    const message = hasMessage
        ? String((err as { message: unknown }).message)
        : "Ocurrió un error inesperado.";

    return { code, message };
}
