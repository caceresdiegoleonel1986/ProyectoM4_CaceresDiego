import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import kairoLogoFull from "../assets/kairo-logo-full.png";

function Home() {
    const { user } = useAuth();

    return (
        <div className="home-page">
            <div className="home-hero">
                <div className="home-logo-wrap">
                    <img src={kairoLogoFull} alt="Kairo Tasks Logo" className="home-hero-logo" />
                </div>
                <h1>
                    Organiza tu día con <span>Kairo Tasks</span>
                </h1>
                <p>
                    La herramienta minimalista y potente para planificar tus días,
                    gestionar proyectos en la agenda y mantener el control de tus tareas diarias.
                </p>

                <div className="hero-actions">
                    {user ? (
                        <>
                            <Link to="/tasks" className="btn btn-primary" style={{ padding: "14px 28px", fontSize: "15px" }}>
                                <span>📋 Mis Tareas</span>
                                <span>➔</span>
                            </Link>
                            <Link to="/agenda" className="btn btn-secondary" style={{ padding: "14px 28px", fontSize: "15px" }}>
                                <span>📅 Ver Agenda</span>
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link to="/register" className="btn btn-primary" style={{ padding: "14px 28px", fontSize: "15px" }}>
                                <span>Empezar gratis</span>
                                <span>➔</span>
                            </Link>
                            <Link to="/login" className="btn btn-secondary" style={{ padding: "14px 28px", fontSize: "15px" }}>
                                <span>Iniciar sesión</span>
                            </Link>
                        </>
                    )}
                </div>
            </div>

            <div className="home-features">
                <div className="feature-card">
                    <div className="feature-icon">📅</div>
                    <h3>Agenda & Calendario</h3>
                    <p>Asigna tareas a días específicos y visualiza tu planificación mensual de un vistazo.</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon">📊</div>
                    <h3>Estadísticas en tiempo real</h3>
                    <p>Monitorea tu progreso diario con métricas claras y contadores automáticos.</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon">⚡</div>
                    <h3>Rápido y fluido</h3>
                    <p>Crea, filtra y completa tareas sin recargar la página, sincronizado en Firestore.</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon">🔒</div>
                    <h3>100% Seguro</h3>
                    <p>Cada usuario tiene su espacio privado respaldado por Firebase Auth.</p>
                </div>
            </div>
        </div>
    );
}

export default Home;
