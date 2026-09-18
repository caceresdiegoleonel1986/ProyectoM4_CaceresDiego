import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";
import { useNavigate, useLocation, Link } from "react-router-dom";
import kairoLogoFull from "../assets/kairo-logo-full.png";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Ruta previa o fallback a /tasks
    const from = location.state?.from || "/tasks";

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);

        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate(from, { replace: true });
        } catch (err: any) {
            if (
                err.code === "auth/invalid-credential" ||
                err.code === "auth/wrong-password" ||
                err.code === "auth/user-not-found"
            ) {
                setError("Correo o contraseña incorrectos.");
            } else if (err.code === "auth/invalid-email") {
                setError("El formato de correo no es válido.");
            } else {
                setError("Error al iniciar sesión: " + err.message);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-header">
                    <img src={kairoLogoFull} alt="Kairo Tasks Logo" className="auth-logo-img" />
                    <h2>Bienvenido de nuevo</h2>
                    <p className="auth-subtitle">Ingresa tus credenciales para acceder a tus tareas</p>
                </div>

                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="email">
                            Correo Electrónico
                        </label>
                        <input
                            id="email"
                            type="email"
                            className="form-input"
                            placeholder="tu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="password">
                            Contraseña
                        </label>
                        <input
                            id="password"
                            type="password"
                            className="form-input"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: "100%", padding: "12px", marginTop: "8px" }}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Ingresando..." : "Iniciar Sesión"}
                    </button>

                    {error && (
                        <div className="auth-error">
                            <span>⚠️</span>
                            <span>{error}</span>
                        </div>
                    )}
                </form>

                <div className="auth-footer">
                    <span>¿No tienes una cuenta?</span>
                    <Link to="/register">Regístrate gratis</Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;