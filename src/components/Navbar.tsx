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

            <div className="navbar-footer">
                <div className="navbar-social-links" aria-label="Perfiles de Caceres Diego">
                    <a
                        className="navbar-social-link"
                        href="https://github.com/caceresdiegoleonel1986"
                        target="_blank"
                        rel="noreferrer"
                        aria-label="Visitar perfil de GitHub"
                        title="GitHub"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.725-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.744.084-.729.084-.729 1.205.084 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.467-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23a11.5 11.5 0 0 1 3-.405c1.02.005 2.047.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                        </svg>
                    </a>
                    <a
                        className="navbar-social-link"
                        href="https://www.linkedin.com/in/diego-leonel-caceres/"
                        target="_blank"
                        rel="noreferrer"
                        aria-label="Visitar perfil de LinkedIn"
                        title="LinkedIn"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.114 20.452H3.558V9h3.556v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                    </a>
                </div>

                {user && (
                    <button className="btn-logout" onClick={logout} title="Cerrar sesión">
                        <span>🚪</span>
                        <span>Cerrar sesión</span>
                    </button>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
