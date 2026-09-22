import { Timestamp } from "firebase/firestore";

// Detecta objetos tipo Timestamp (incluye mocks de tests) sin recurrir a 'any'
function hasToDate(value: unknown): value is { toDate: () => Date } {
    return (
        typeof value === "object" &&
        value !== null &&
        typeof (value as { toDate?: unknown }).toDate === "function"
    );
}

export function getTaskDateStr(
    dueDate: string | number | Timestamp | Date | null | undefined
): string | undefined {
    if (!dueDate) return undefined;

    if (typeof dueDate === "string") {
        return dueDate.split("T")[0];
    }

    if (typeof dueDate === "number") {
        return new Date(dueDate).toISOString().split("T")[0];
    }

    if (hasToDate(dueDate)) {
        try {
            return dueDate.toDate().toISOString().split("T")[0];
        } catch {
            return undefined;
        }
    }

    if (dueDate instanceof Date) {
        return dueDate.toISOString().split("T")[0];
    }

    return undefined;
}