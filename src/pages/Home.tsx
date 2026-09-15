import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import logoApp from "../assets/LogoApp.png";

function Home() {
    const { user } = useAuth();

    return (
        <div className="home-page">
            <div className="home-hero">
                <div className="home-logo-wrap">
                    <img src={logoApp} alt="TaskFlow Logo" className="home-hero-logo" />
                </div>
                <div className="home-badge">
                    <span>✨</span> Nueva versión con diseño moderno
                </div>
                <h1>
                    Organiza tu día con <span>TaskFlow</span>
                </h1>
                <p>
                    La herramienta minimalista y potente para gestionar tus proyectos,
                    completar objetivos y mantener el control de tus tareas diarias.
                </p>

                <div className="hero-actions">
                    {user ? (
                        <Link to="/tasks" className="btn btn-primary" style={{ padding: "14px 28px", fontSize: "15px" }}>
                            <span>Ir a mis tareas</span>
                            <span>➔</span>
                        </Link>
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