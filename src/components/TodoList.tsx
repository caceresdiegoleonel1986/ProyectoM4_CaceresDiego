import { useTasks } from "../hooks/useTasks";

const TodoList = () => {
    const { tasks, loading, updateTask, deleteTask } = useTasks();

    if (loading) return <p>Cargando tareas...</p>;

    return (
        <ul>
            {tasks.map((task) => (
                <li key={task.id}>
                    <span
                        style={{ textDecoration: task.completed ? "line-through" : "none" }}
                    >
                        {task.title}
                    </span>
                    <button onClick={() => updateTask(task.id, { completed: !task.completed })}>
                        {task.completed ? "Desmarcar" : "Completar"}
                    </button>
                    <button onClick={() => deleteTask(task.id)}>Eliminar</button>
                </li>
            ))}
        </ul>
    );
};

export default TodoList;