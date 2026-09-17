import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import kairoIcon from "../assets/kairo-icon.png";

const Navbar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

    // Helper to get initials or display name
    const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : "U";
    const userDisplayName = user?.displayName || user?.email?.split("@")[0] || "Usuario";

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-brand">
                <img src={kairoIcon} alt="Kairo Tasks" className="brand-logo-img" />
                <div className="brand-text">
                    <span className="brand-name-kairo">Kairo</span>
                    <span className="brand-name-tasks">Tasks</span>
                </div>
            </Link>

            {user && (
                <div className="navbar-user-card">
                    <div className="navbar-user-avatar">{userInitial}</div>
                    <div className="navbar-user-info">
                        <span className="navbar-user-name">{userDisplayName}</span>
                        <span className="navbar-user-role">{user.email}</span>
                    </div>
                </div>
            )}

            <ul>
                <li>
                    <Link
                        to="/"
                        className={`navbar-link ${location.pathname === "/" ? "active" : ""}`}
                    >
                        <span className="nav-icon">🏠</span>
                        <span>Inicio</span>
                    </Link>
                </li>

                {user ? (
                    <>
                        <li>
                            <Link
                                to="/tasks"
                                className={`navbar-link ${location.pathname === "/tasks" ? "active" : ""}`}
                            >
                                <span className="nav-icon">📋</span>
                                <span>Mis Tareas</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/agenda"
                                className={`navbar-link ${location.pathname === "/agenda" ? "active" : ""}`}
                            >
                                <span className="nav-icon">📅</span>
                                <span>Agenda</span>
                            </Link>
                        </li>
                    </>
                ) : (
                    <>
                        <li>
                            <Link
                                to="/login"
                                className={`navbar-link ${location.pathname === "/login" ? "active" : ""}`}
                            >
                                <span className="nav-icon">🔑</span>
                                <span>Iniciar sesión</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/register"
                                className={`navbar-link ${location.pathname === "/register" ? "active" : ""}`}
                            >
                                <span className="nav-icon">📝</span>
                                <span>Registrarse</span>
                            </Link>
                        </li>
                    </>
                )}
            </ul>

            {user && (
                <div className="navbar-footer">
                    <button className="btn-logout" onClick={logout} title="Cerrar sesión">
                        <span>🚪</span>
                        <span>Cerrar sesión</span>
                    </button>
                </div>
            )}
        </nav>
    );
};

export default Navbar;