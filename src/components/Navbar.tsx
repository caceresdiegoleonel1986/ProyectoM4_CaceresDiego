import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="navbar">
            <ul>
                <li><Link to="/">Inicio</Link></li>
                {user ? (
                    <>
                        <li><Link to="/tasks">Tareas</Link></li>
                        <li>
                            <button onClick={logout}>Cerrar sesión</button>
                        </li>
                    </>
                ) : (
                    <>
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/register">Registro</Link></li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;