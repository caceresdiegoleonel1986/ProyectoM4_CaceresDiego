import { useState } from "react";
import { useTasks } from "../hooks/useTasks";

const TodoForm = () => {
    const { addTask } = useTasks();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;
        await addTask(title, description);
        setTitle("");
        setDescription("");
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Título" value={title} onChange={e => setTitle(e.target.value)} />
            <input type="text" placeholder="Descripción" value={description} onChange={e => setDescription(e.target.value)} />
            <button type="submit">Agregar tarea</button>
        </form>
    );
};

export default TodoForm;