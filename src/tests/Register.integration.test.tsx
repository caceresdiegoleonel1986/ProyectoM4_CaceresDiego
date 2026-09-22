import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import RegisterPage from "../pages/Register";
import { AuthProvider } from "../hooks/useAuth";
import { ProtectedRoute } from "../routes/ProtectedRoute";

type TestUser = { uid: string; email: string };

const { authListener, googleSignInMock } = vi.hoisted(() => ({
    authListener: { current: undefined as ((user: TestUser | null) => void) | undefined },
    googleSignInMock: vi.fn(),
}));

vi.mock("firebase/auth", () => ({
    getAuth: vi.fn(() => ({})),
    onAuthStateChanged: vi.fn((_auth, callback) => {
        authListener.current = callback;
        callback(null);
        return vi.fn();
    }),
    signInWithPopup: googleSignInMock,
    GoogleAuthProvider: vi.fn(),
    createUserWithEmailAndPassword: vi.fn(),
    signInWithEmailAndPassword: vi.fn(),
    signOut: vi.fn(),
}));

describe("Registro con Google e integración de autenticación", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        authListener.current = undefined;
        googleSignInMock.mockImplementation(async () => {
            const user = { uid: "google-user-123", email: "google@example.com" };
            authListener.current?.(user);
            return { user };
        });
    });

    it("autentica con Google y permite acceder a una ruta protegida", async () => {
        const user = userEvent.setup();

        render(
            <MemoryRouter initialEntries={["/register"]}>
                <AuthProvider>
                    <Routes>
                        <Route path="/register" element={<RegisterPage />} />
                        <Route
                            path="/tasks"
                            element={
                                <ProtectedRoute>
                                    <div>Tareas protegidas</div>
                                </ProtectedRoute>
                            }
                        />
                        <Route path="/login" element={<div>Pantalla de login</div>} />
                    </Routes>
                </AuthProvider>
            </MemoryRouter>
        );

        await user.click(screen.getByRole("button", { name: "Registrarse con Google" }));

        expect(googleSignInMock).toHaveBeenCalledTimes(1);
        expect(await screen.findByText("Tareas protegidas")).toBeInTheDocument();
        expect(screen.queryByText("Pantalla de login")).not.toBeInTheDocument();
    });
});
