
export interface Task {
    id: string;              // ID único generado por Firestore
    title: string;           // Título de la tarea
    description?: string;    // Descripción opcional
    completed: boolean;      // Estado de la tarea
    userId: string;          // ID del usuario dueño de la tarea
    createdAt: number;       // Timestamp de creación
    dueDate?: string | null; // Fecha de vencimiento/asignación (timestamp o YYYY-MM-DD)
    priority?: "low" | "medium" | "high"; // Prioridad opcional
}