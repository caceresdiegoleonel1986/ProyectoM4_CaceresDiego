import { useState } from "react";
import { useTasks } from "../hooks/useTasks";

const TodoForm = () => {
    const { addTask } = useTasks();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || isSubmitting) return;

        try {
            setIsSubmitting(true);
            await addTask(title.trim(), description.trim());
            setTitle("");
            setDescription("");
        } catch (error) {
            console.error("Error al crear tarea:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="todo-form-card">
            <div className="todo-form-header">
                <span className="todo-form-title">
                    <span>✨</span> Crear nueva tarea
                </span>
                <span className="badge badge-purple">Rápido y fácil</span>
            </div>

            <form onSubmit={handleSubmit} className="todo-form-row">
                <input
                    type="text"
                    className="form-input"
                    placeholder="Título de la tarea..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <input
                    type="text"
                    className="form-input form-input-desc"
                    placeholder="Descripción o detalles (opcional)..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
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