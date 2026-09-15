import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import logoApp from "../assets/LogoApp.png";

const Navbar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

    // Helper to get initials or display name
    const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : "U";
    const userDisplayName = user?.displayName || user?.email?.split("@")[0] || "Usuario";

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <img src={logoApp} alt="Logo App" className="brand-logo-img" />
                <span>TaskFlow</span>
            </div>

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
                    <li>
                        <Link
                            to="/tasks"
                            className={`navbar-link ${location.pathname === "/tasks" ? "active" : ""}`}
                        >
                            <span className="nav-icon">📋</span>
                            <span>Mis Tareas</span>
                        </Link>
                    </li>
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