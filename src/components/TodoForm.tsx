import { useState, useEffect } from "react";
import { useTasks } from "../hooks/useTasks";
import type { TaskFormValues, TaskPriority } from "../types/task";

interface TodoFormProps {
    defaultDueDate?: string;
    onTaskAdded?: () => void;
    compact?: boolean;
    placeholder?: string;
}

const TodoForm = ({
    defaultDueDate = "",
    onTaskAdded,
    compact = false,
    placeholder = "Título de la tarea...",
}: TodoFormProps) => {
    const { addTask } = useTasks();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState(defaultDueDate);
    const [priority, setPriority] = useState<TaskPriority>("medium");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (defaultDueDate) {
            setDueDate(defaultDueDate);
        }
    }, [defaultDueDate]);

    const setQuickDate = (daysToAdd: number) => {
        const d = new Date();
        d.setDate(d.getDate() + daysToAdd);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        setDueDate(`${yyyy}-${mm}-${dd}`);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || isSubmitting) return;

        const formValues: TaskFormValues = {
            title: title.trim(),
            description: description.trim(),
            dueDate: dueDate || null,
            priority,
        };

        try {
            setIsSubmitting(true);
            await addTask(formValues.title, formValues.description, formValues.dueDate, formValues.priority);
            setTitle("");
            setDescription("");
            if (!defaultDueDate) {
                setDueDate("");
            }
            if (onTaskAdded) {
                onTaskAdded();
            }
        } catch (error) {
            console.error("Error al crear tarea:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (compact) {
        return (
            <form onSubmit={handleSubmit} className="todo-form-compact">
                <input
                    type="text"
                    className="form-input"
                    placeholder={placeholder}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <select
                    className="form-select form-select-sm"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as TaskPriority)}
                >
                    <option value="low">Prioridad Baja</option>
                    <option value="medium">Prioridad Media</option>
                    <option value="high">Prioridad Alta</option>
                </select>
                <button
                    type="submit"
                    className="btn btn-primary btn-sm"
                    disabled={isSubmitting || !title.trim()}
                >
                    {isSubmitting ? "Guardando..." : "➕ Agregar"}
                </button>
            </form>
        );
    }

    return (
        <div className="todo-form-card">
            <div className="todo-form-header">
                <span className="todo-form-title">
                    <span>✨</span> Crear nueva tarea
                </span>
                <div className="todo-form-quick-dates">
                    <span className="quick-date-label">Asignar día:</span>
                    <button
                        type="button"
                        className={`btn-quick-date ${dueDate === new Date().toISOString().split("T")[0] ? "active" : ""}`}
                        onClick={() => setQuickDate(0)}
                    >
                        Hoy
                    </button>
                    <button
                        type="button"
                        className="btn-quick-date"
                        onClick={() => setQuickDate(1)}
                    >
                        Mañana
                    </button>
                    {dueDate && (
                        <button
                            type="button"
                            className="btn-quick-date btn-clear-date"
                            onClick={() => setDueDate("")}
                            title="Quitar fecha"
                        >
                            ✕ Sin fecha
                        </button>
                    )}
                </div>
            </div>

            <form onSubmit={handleSubmit} className="todo-form-row">
                <input
                    type="text"
                    className="form-input"
                    placeholder={placeholder}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <input
                    type="text"
                    className="form-input form-input-desc"
                    placeholder="Detalles o notas (opcional)..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <div className="form-date-wrap">
                    <input
                        type="date"
                        className="form-input form-input-date"
                        title="Fecha asignada en agenda"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                    />
                </div>
                <select
                    className="form-select form-select-priority"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as TaskPriority)}
                    title="Prioridad de la tarea"
                >
                    <option value="low">🟢 Baja</option>
                    <option value="medium">🟡 Media</option>
                    <option value="high">🔴 Alta</option>
                </select>
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting || !title.trim()}
                >
                    {isSubmitting ? (
                        <span>Guardando...</span>
                    ) : (
                        <>
                            <span>➕</span>
                            <span>Agregar tarea</span>
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

export default TodoForm;