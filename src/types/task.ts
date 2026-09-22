
// Prioridad reutilizada por formularios, lista, agenda y hooks
export type TaskPriority = "low" | "medium" | "high";

export interface Task {
    id: string;              // ID único generado por Firestore
    title: string;           // Título de la tarea
    description?: string;    // Descripción opcional
    completed: boolean;      // Estado de la tarea
    userId: string;          // ID del usuario dueño de la tarea
    createdAt: number;       // Timestamp de creación
    dueDate?: string | null; // Fecha de vencimiento/asignación (timestamp o YYYY-MM-DD)
    priority?: TaskPriority; // Prioridad opcional
}

// Valores editables al crear/actualizar una tarea desde formularios
export interface TaskFormValues {
    title: string;
    description: string;
    dueDate: string | null;
    priority: TaskPriority;
}