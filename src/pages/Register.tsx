import { useState } from "react";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../services/firebase";
import { useNavigate, Link } from "react-router-dom";
import kairoLogoFull from "../assets/kairo-logo-full.png";
import { getAuthErrorMessage } from "../utils/authErrors";

const RegisterPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres.");
            return;
        }

        setIsSubmitting(true);
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            navigate("/tasks");
        } catch (err) {
            const code = getAuthErrorMessage(err).code;
            if (code === "auth/email-already-in-use") {
                setError("Este correo electrónico ya está registrado.");
            } else if (code === "auth/invalid-email") {
                setError("El formato de correo no es válido.");
            } else if (code === "auth/weak-password") {
                setError("La contraseña es demasiado débil.");
            } else {
                setError("Error al registrarse: " + getAuthErrorMessage(err).message);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGoogleRegister = async () => {
        setError("");
        setIsSubmitting(true);

        try {
            await signInWithPopup(auth, googleProvider);
            navigate("/tasks");
        } catch (err) {
            setError("Error al registrarse con Google: " + getAuthErrorMessage(err).message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-header">
                    <img src={kairoLogoFull} alt="Kairo Tasks Logo" className="auth-logo-img" />
                    <h2>Crea tu cuenta</h2>
                    <p className="auth-subtitle">Empieza a organizar tus tareas de forma inteligente</p>
                </div>

                <form onSubmit={handleRegister}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="register-email">
                            Correo Electrónico
                        </label>
                        <input
                            id="register-email"
                            type="email"
                            className="form-input"
                            placeholder="tu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="register-password">
                            Contraseña (mínimo 6 caracteres)
                        </label>
                        <input
                            id="register-password"
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
                        {isSubmitting ? "Registrando..." : "Crear Cuenta"}
                    </button>

                    <button
                        type="button"
                        className="btn btn-secondary"
                        style={{ width: "100%", padding: "12px", marginTop: "8px" }}
                        onClick={handleGoogleRegister}
                        disabled={isSubmitting}
                    >
                        Registrarse con Google
                    </button>

                    {error && (
                        <div className="auth-error">
                            <span>⚠️</span>
                            <span>{error}</span>
                        </div>
                    )}
                </form>

                <div className="auth-footer">
                    <span>¿Ya tienes una cuenta?</span>
                    <Link to="/login">Inicia sesión</Link>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
