import { useState } from "react";
import TodoList from "../components/TodoList";
import TodoForm from "../components/TodoForm";
import { useAuth } from "../hooks/useAuth";
import { useTasks } from "../hooks/useTasks";

const TasksPage = () => {
    const { user } = useAuth();
    const { tasks } = useTasks();

    const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");
    const [searchQuery, setSearchQuery] = useState("");

    // Calculate metrics for stats cards
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const pending = total - completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Format current date
    const today = new Date().toLocaleDateString("es-ES", {
        weekday: "long",
        day: "numeric",
        month: "long",
    });
    const formattedDate = today.charAt(0).toUpperCase() + today.slice(1);

    const userName = user?.displayName || user?.email?.split("@")[0] || "Usuario";

    return (
        <div className="tasks-page-container">
            {/* Top Bar Greeting */}
            <div className="tasks-top-bar">
                <div className="tasks-greeting">
                    <h1>¡Hola, {userName}! 👋</h1>
                    <p>Organiza, gestiona y completa tus tareas diarias.</p>
                </div>
                <div className="tasks-date-pill">
                    <span>🗓️</span>
                    <span>{formattedDate}</span>
                </div>
            </div>

            {/* Stats Cards (Inspiration from Pinterest/Figma screenshots) */}
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
            </div>

            {/* Tasks List */}
            <div className="task-list-section">
                <TodoList filter={filter} searchQuery={searchQuery} />
            </div>
        </div>
    );
};

export default TasksPage;