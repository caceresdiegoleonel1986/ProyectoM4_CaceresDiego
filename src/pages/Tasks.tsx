import TodoList from "../components/TodoList";
import TodoForm from "../components/TodoForm";
import { useAuth } from "../hooks/useAuth";

const TasksPage = () => {
    const { logout } = useAuth();

    return (
        <div>
            <h2>Mis Tareas</h2>
            <TodoForm />
            <TodoList />
            <button onClick={logout}>Cerrar sesión</button>
        </div>
    );
};

export default TasksPage;