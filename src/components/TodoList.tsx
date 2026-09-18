import type { Task } from "../types/task";
import Loader from "./Loader";

interface TodoListProps {
    tasks: Task[];
    loading: boolean;
    updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
    deleteTask: (id: string) => Promise<void>;
}

const getDueDateBadge = (dueDate?: number | string | null, completed = false) => {
    if (!dueDate) return null;
    let dueTime: number;
    let dueString = "";
    if (typeof dueDate === "number") {
        dueTime = dueDate;
        dueString = new Date(dueDate).toISOString().split("T")[0];
    } else {
        dueString = dueDate;
        dueTime = new Date(`${dueDate}T23:59:59`).getTime();
    }
    const todayStr = new Date().toISOString().split("T")[0];
    const isToday = dueString === todayStr;
    const isPast = dueTime < new Date().setHours(0, 0, 0, 0);

    const parts = dueString.split("-");
    const formatted = parts.length === 3 ? `${parseInt(parts[2], 10)}/${parseInt(parts[1], 10)}` : dueString;

    if (isToday) {
        return <span className="badge badge-amber">🗓️ Para hoy</span>;
    }
    if (isPast && !completed) {
        return <span className="badge badge-red">⚠️ Vencida ({formatted})</span>;
    }
    return <span className="badge badge-blue">🗓️ {formatted}</span>;
};

const getPriorityBadge = (priority?: "low" | "medium" | "high") => {
    if (!priority) return null;
    if (priority === "high") return <span className="badge badge-red">⚡ Alta</span>;
    if (priority === "low") return <span className="badge badge-muted">Baja</span>;
    return <span className="badge badge-purple">Media</span>;
};

const TodoList = ({ tasks, loading, updateTask, deleteTask }: TodoListProps) => {
    if (loading) {
        return <Loader message="Cargando tus tareas..." />;
    }

    if (!tasks || tasks.length === 0) {
        return (
            <div className="empty-state">
                <div className="empty-icon">📝</div>
                <h3 className="empty-title">No hay tareas para mostrar</h3>
                <p className="empty-desc">Crea una nueva tarea arriba para empezar a organizar tu día.</p>
            </div>
        );
    }

    return (
        <div className="task-list">
            {tasks.map((task) => {
                const dateStr = task.createdAt
                    ? new Date(task.createdAt).toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                    })
                    : null;

                return (
                    <div key={task.id} className={`task-item ${task.completed ? "completed" : ""}`}>
                        {/* Checkbox button */}
                        <button
                            type="button"
                            className={`task-checkbox-btn ${task.completed ? "checked" : ""}`}
                            onClick={() => updateTask(task.id, { completed: !task.completed })}
                            title={task.completed ? "Marcar como pendiente" : "Marcar como completada"}
                        >
                            ✓
                        </button>

                        {/* Content */}
                        <div className="task-body">
                            <div className={`task-title ${task.completed ? "done" : ""}`}>
                                {task.title}
                            </div>
                            {task.description && <p className="task-description">{task.description}</p>}
                            <div className="task-meta">
                                <span className={`badge ${task.completed ? "badge-green" : "badge-purple"}`}>
                                    {task.completed ? "✓ Completada" : "● Pendiente"}
                                </span>
                                {getDueDateBadge(task.dueDate, task.completed)}
                                {getPriorityBadge(task.priority)}
                                {dateStr && (
                                    <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                                        Creada: {dateStr}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="task-actions">
                            <button
                                type="button"
                                className="btn btn-danger btn-sm"
                                onClick={() => deleteTask(task.id)}
                                title="Eliminar tarea"
                            >
                                🗑️ Eliminar
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default TodoList;