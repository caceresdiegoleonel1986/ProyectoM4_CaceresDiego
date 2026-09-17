import { useAuth } from "../hooks/useAuth";
import Agenda from "../components/Agenda";
import { Link } from "react-router-dom";

const AgendaPage = () => {
    const { user } = useAuth();

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
                    <h1>Agenda de {userName} 📅</h1>
                    <p>Organiza tus actividades por fechas y visualiza tu mes completo.</p>
                </div>
                <div className="tasks-top-actions">
                    <Link to="/tasks" className="btn btn-secondary btn-sm">
                        📋 Ver Lista de Tareas
                    </Link>
                    <div className="tasks-date-pill">
                        <span>🗓️</span>
                        <span>{formattedDate}</span>
                    </div>
                </div>
            </div>

            {/* Agenda Component */}
            <Agenda />
        </div>
    );
};

export default AgendaPage;
