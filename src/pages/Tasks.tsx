import { useState } from "react";
import { Link } from "react-router-dom";
import TodoList from "../components/TodoList";
import TodoForm from "../components/TodoForm";
import { useAuth } from "../hooks/useAuth";
import { useTasks } from "../hooks/useTasks";
import type { Task } from "../types/task";

const TasksPage = () => {
    const { user } = useAuth();
    const { tasks, loading, updateTask, deleteTask } = useTasks();

    const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");
    const [priorityFilter, setPriorityFilter] = useState<"all" | "low" | "medium" | "high">("all");
    const [searchQuery, setSearchQuery] = useState("");

    // Métricas
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const pending = total - completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Fecha actual
    const today = new Date().toLocaleDateString("es-ES", {
        weekday: "long",
        day: "numeric",
        month: "long",
    });
    const formattedDate = today.charAt(0).toUpperCase() + today.slice(1);

    const userName = user?.displayName || user?.email?.split("@")[0] || "Usuario";

    // 🔹 Filtrado combinado
    const filteredTasks: Task[] = tasks.filter((t) => {
        const matchesStatus =
            filter === "all" ||
            (filter === "completed" && t.completed) ||
            (filter === "pending" && !t.completed);

        const matchesPriority =
            priorityFilter === "all" || t.priority === priorityFilter;

        const matchesSearch =
            searchQuery === "" ||
            t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (t.description ?? "").toLowerCase().includes(searchQuery.toLowerCase());

        return matchesStatus && matchesPriority && matchesSearch;
    });

    return (
        <div className="tasks-page-container">
            {/* Top Bar Greeting */}
            <div className="tasks-top-bar">
                <div className="tasks-greeting">
                    <h1>¡Hola, {userName}! 👋</h1>
                    <p>Organiza, gestiona y completa tus tareas diarias.</p>
                </div>
                <div className="tasks-top-actions">
                    <Link to="/agenda" className="btn btn-secondary btn-sm">
                        📅 Ver Agenda
                    </Link>
                    <div className="tasks-date-pill">
                        <span>🗓️</span>
                        <span>{formattedDate}</span>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon stat-icon-purple">📋</div>
                    <div className="stat-details">
                        <span className="stat-label">Total Tareas</span>
                        <span className="stat-value">{total}</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon stat-icon-green">✅</div>
                    <div className="stat-details">
                        <span className="stat-label">Completadas</span>
                        <span className="stat-value">
                            {completed}{" "}
                            <span style={{ fontSize: "14px", color: "var(--green)", fontWeight: 600 }}>
                                ({completionRate}%)
                            </span>
                        </span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon stat-icon-amber">⏳</div>
                    <div className="stat-details">
                        <span className="stat-label">Pendientes</span>
                        <span className="stat-value">{pending}</span>
                    </div>
                </div>
            </div>

            {/* Todo Form */}
            <TodoForm />

            {/* Toolbar: Search + Filter Tabs */}
            <div className="task-toolbar">
                <div className="search-box">
                    <span className="search-icon">🔍</span>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Buscar tareas..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="filter-tabs">
                    <button
                        type="button"
                        className={`filter-tab ${filter === "all" ? "active" : ""}`}
                        onClick={() => setFilter("all")}
                    >
                        Todas ({total})
                    </button>
                    <button
                        type="button"
                        className={`filter-tab ${filter === "pending" ? "active" : ""}`}
                        onClick={() => setFilter("pending")}
                    >
                        Pendientes ({pending})
                    </button>
                    <button
                        type="button"
                        className={`filter-tab ${filter === "completed" ? "active" : ""}`}
                        onClick={() => setFilter("completed")}
                    >
                        Completadas ({completed})
                    </button>
                </div>

                {/* 🔹 Tabs de prioridad */}
                <div className="priority-tabs">
                    <button
                        type="button"
                        className={`filter-tab ${priorityFilter === "all" ? "active" : ""}`}
                        onClick={() => setPriorityFilter("all")}
                    >
                        Todas
                    </button>
                    <button
                        type="button"
                        className={`filter-tab ${priorityFilter === "low" ? "active" : ""}`}
                        onClick={() => setPriorityFilter("low")}
                    >
                        Baja
                    </button>
                    <button
                        type="button"
                        className={`filter-tab ${priorityFilter === "medium" ? "active" : ""}`}
                        onClick={() => setPriorityFilter("medium")}
                    >
                        Media
                    </button>
                    <button
                        type="button"
                        className={`filter-tab ${priorityFilter === "high" ? "active" : ""}`}
                        onClick={() => setPriorityFilter("high")}
                    >
                        Alta
                    </button>
                </div>
            </div>

            {/* Tasks List */}
            <div className="task-list-section">
                <TodoList
                    tasks={filteredTasks}
                    loading={loading}
                    updateTask={updateTask}
                    deleteTask={deleteTask}
                />
            </div>
        </div>
    );
};

export default TasksPage;