import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";
import { useTasks } from "../hooks/useTasks";
import type { Task } from "../types/task";
import { getTaskDateStr } from "../utils/dateHelpers";

export default function Agenda() {
    const { tasks, addTask, updateTask, deleteTask } = useTasks();

    // Default selected date to today (YYYY-MM-DD)
    const todayStr = new Date().toISOString().split("T")[0];
    const [selectedDate, setSelectedDate] = useState<string>(todayStr);
    const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");

    // Quick add task inputs for the selected date
    const [quickTitle, setQuickTitle] = useState("");
    const [quickDesc, setQuickDesc] = useState("");
    const [quickPriority, setQuickPriority] = useState<"low" | "medium" | "high">("medium");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Filter tasks based on status
    const filteredTasks = tasks.filter((t) => {
        if (filter === "pending" && t.completed) return false;
        if (filter === "completed" && !t.completed) return false;
        return true;
    });

    // Calendar events mapped from tasks with due dates
    const calendarEvents = filteredTasks
        .filter((task) => !!task.dueDate)
        .map((task) => {
            const dateStr = getTaskDateStr(task.dueDate)!;
            const isCompleted = task.completed;

            let bgColor = "#6d28d9"; // default purple
            if (isCompleted) {
                bgColor = "#10b981"; // green
            } else if (task.priority === "high") {
                bgColor = "#ef4444"; // red/orange
            } else if (task.priority === "low") {
                bgColor = "#0284c7"; // sky blue
            }

            return {
                id: task.id,
                title: `${isCompleted ? "✓ " : ""}${task.title}`,
                start: dateStr,
                allDay: true,
                backgroundColor: bgColor,
                borderColor: "transparent",
                textColor: "#ffffff",
                extendedProps: {
                    ...task,
                },
            };
        });

    // Tasks scheduled for the currently selected date
    const selectedDateTasks = tasks.filter((t) => {
        const dStr = getTaskDateStr(t.dueDate);
        return dStr === selectedDate;
    });

    // Format selected date nicely in Spanish
    const formattedSelectedDate = (() => {
        if (!selectedDate) return "";
        const [year, month, day] = selectedDate.split("-").map(Number);
        const dateObj = new Date(year, month - 1, day);
        return dateObj.toLocaleDateString("es-ES", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    })();

    // Handle adding task to selected date
    const handleAddForSelectedDate = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        if (!quickTitle.trim() || isSubmitting) return;

        try {
            setIsSubmitting(true);
            await addTask(quickTitle.trim(), quickDesc.trim(), selectedDate, quickPriority);
            setQuickTitle("");
            setQuickDesc("");
        } catch (err) {
            console.error("Error al programar tarea:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Quick jump to today
    const handleSelectToday = () => {
        setSelectedDate(todayStr);
    };

    // Metrics for agenda
    const scheduledTotal = tasks.filter((t) => !!t.dueDate).length;
    const scheduledCompleted = tasks.filter((t) => !!t.dueDate && t.completed).length;
    const scheduledToday = tasks.filter((t) => getTaskDateStr(t.dueDate) === todayStr).length;

    return (
        <div className="agenda-container">
            {/* Top Toolbar / Metrics */}
            <div className="agenda-header-card">
                <div className="agenda-header-info">
                    <h2>📅 Agenda & Calendario</h2>
                    <p>Planifica tus tareas por día. Haz clic en cualquier fecha para gestionarla.</p>
                </div>

                <div className="agenda-stats-pills">
                    <div className="agenda-pill">
                        <span className="pill-num">{scheduledTotal}</span>
                        <span className="pill-text">Programadas</span>
                    </div>
                    <div className="agenda-pill">
                        <span className="pill-num">{scheduledToday}</span>
                        <span className="pill-text">Para hoy</span>
                    </div>
                    <div className="agenda-pill pill-success">
                        <span className="pill-num">{scheduledCompleted}</span>
                        <span className="pill-text">Completadas</span>
                    </div>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="agenda-filter-row">
                <div className="filter-tabs">
                    <button
                        type="button"
                        className={`filter-tab ${filter === "all" ? "active" : ""}`}
                        onClick={() => setFilter("all")}
                    >
                        Todas en agenda ({scheduledTotal})
                    </button>
                    <button
                        type="button"
                        className={`filter-tab ${filter === "pending" ? "active" : ""}`}
                        onClick={() => setFilter("pending")}
                    >
                        Pendientes ({scheduledTotal - scheduledCompleted})
                    </button>
                    <button
                        type="button"
                        className={`filter-tab ${filter === "completed" ? "active" : ""}`}
                        onClick={() => setFilter("completed")}
                    >
                        Completadas ({scheduledCompleted})
                    </button>
                </div>

                <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={handleSelectToday}
                >
                    📍 Ir a Hoy
                </button>
            </div>

            {/* Main Layout: Calendar Grid + Day Details Panel */}
            <div className="agenda-grid-layout">
                {/* Left: FullCalendar Card */}
                <div className="agenda-calendar-card">
                    <FullCalendar
                        plugins={[dayGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        locale={esLocale}
                        events={calendarEvents}
                        dateClick={(info) => setSelectedDate(info.dateStr)}
                        eventClick={(info) => {
                            const dStr = info.event.startStr.split("T")[0];
                            if (dStr) setSelectedDate(dStr);
                        }}
                        headerToolbar={{
                            left: "prev,next today",
                            center: "title",
                            right: "",
                        }}
                        buttonText={{
                            today: "Hoy",
                        }}
                        height="auto"
                        dayMaxEvents={3}
                    />
                    <div className="agenda-legend">
                        <span className="legend-item">
                            <span className="legend-dot dot-green"></span> Completada
                        </span>
                        <span className="legend-item">
                            <span className="legend-dot dot-blue"></span> Prioridad Baja
                        </span>
                        <span className="legend-item">
                            <span className="legend-dot dot-purple"></span> Prioridad Media
                        </span>
                        <span className="legend-item">
                            <span className="legend-dot dot-red"></span> Prioridad Alta
                        </span>
                    </div>
                </div>

                {/* Right: Day Detail Panel */}
                <div className="agenda-day-panel">
                    <div className="day-panel-header">
                        <div className="day-panel-title-wrap">
                            <span className="day-panel-icon">🗓️</span>
                            <div>
                                <h3>{formattedSelectedDate}</h3>
                                <span className="day-panel-subtitle">
                                    {selectedDate === todayStr ? "📍 Día de hoy" : `Fecha: ${selectedDate}`}
                                </span>
                            </div>
                        </div>
                        <span className="badge badge-purple">
                            {selectedDateTasks.length}{" "}
                            {selectedDateTasks.length === 1 ? "tarea" : "tareas"}
                        </span>
                    </div>

                    {/* Quick Add Form for this specific day */}
                    <div className="day-panel-quick-add">
                        <h4>➕ Agregar tarea para este día</h4>
                        <form onSubmit={handleAddForSelectedDate} className="day-quick-form">
                            <input
                                type="text"
                                className="form-input"
                                placeholder="¿Qué necesitas hacer este día?..."
                                value={quickTitle}
                                onChange={(e) => setQuickTitle(e.target.value)}
                                required
                            />
                            <input
                                type="text"
                                className="form-input form-input-desc"
                                placeholder="Notas o detalles (opcional)..."
                                value={quickDesc}
                                onChange={(e) => setQuickDesc(e.target.value)}
                            />
                            <div className="day-quick-actions">
                                <select
                                    className="form-select form-select-sm"
                                    value={quickPriority}
                                    onChange={(e) =>
                                        setQuickPriority(e.target.value as "low" | "medium" | "high")
                                    }
                                >
                                    <option value="low">🟢 Baja</option>
                                    <option value="medium">🟡 Media</option>
                                    <option value="high">🔴 Alta</option>
                                </select>
                                <button
                                    type="submit"
                                    className="btn btn-primary btn-sm"
                                    disabled={isSubmitting || !quickTitle.trim()}
                                >
                                    {isSubmitting ? "Guardando..." : "Programar tarea"}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Task List for Selected Date */}
                    <div className="day-panel-tasks-list">
                        <h4>Tareas programadas ({selectedDateTasks.length})</h4>
                        {selectedDateTasks.length === 0 ? (
                            <div className="day-empty-state">
                                <span>☕</span>
                                <p>No hay tareas programadas para esta fecha.</p>
                                <small>Escribe una tarea arriba para agendarla.</small>
                            </div>
                        ) : (
                            selectedDateTasks.map((task: Task) => (
                                <div
                                    key={task.id}
                                    className={`day-task-card ${task.completed ? "completed" : ""}`}
                                >
                                    <button
                                        type="button"
                                        className={`task-checkbox-btn ${task.completed ? "checked" : ""}`}
                                        onClick={() =>
                                            updateTask(task.id, { completed: !task.completed })
                                        }
                                        title={
                                            task.completed
                                                ? "Marcar como pendiente"
                                                : "Marcar como completada"
                                        }
                                    >
                                        ✓
                                    </button>

                                    <div className="day-task-info">
                                        <div
                                            className={`day-task-title ${task.completed ? "done" : ""
                                                }`}
                                        >
                                            {task.title}
                                        </div>
                                        {task.description && (
                                            <div className="day-task-desc">{task.description}</div>
                                        )}
                                        <div className="day-task-tags">
                                            <span
                                                className={`badge ${task.completed ? "badge-green" : "badge-purple"
                                                    }`}
                                            >
                                                {task.completed ? "Completada" : "Pendiente"}
                                            </span>
                                            {task.priority === "high" && (
                                                <span className="badge badge-red">⚡ Alta</span>
                                            )}
                                            {task.priority === "low" && (
                                                <span className="badge badge-muted">Baja</span>
                                            )}
                                            {!task.completed && task.priority === "medium" && (
                                                <span className="badge badge-purple">Media</span>
                                            )}
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        className="btn btn-danger btn-xs"
                                        onClick={() => deleteTask(task.id)}
                                        title="Eliminar de la agenda"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}