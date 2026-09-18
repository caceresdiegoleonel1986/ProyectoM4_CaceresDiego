import { Timestamp } from "firebase/firestore";

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

    if (typeof (dueDate as any)?.toDate === "function") {
        try {
            return (dueDate as any).toDate().toISOString().split("T")[0];
        } catch {
            return undefined;
        }
    }

    if (dueDate instanceof Timestamp) {
        return dueDate.toDate().toISOString().split("T")[0];
    }

    if (dueDate instanceof Date) {
        return dueDate.toISOString().split("T")[0];
    }

    return undefined;
}