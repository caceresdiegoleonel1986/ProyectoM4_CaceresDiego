import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import LoginPage from "../pages/Login";

const { signInMock, popupMock } = vi.hoisted(() => ({
    signInMock: vi.fn(),
    popupMock: vi.fn(),
}));

vi.mock("firebase/auth", () => ({
    getAuth: vi.fn(() => ({})),
    signInWithEmailAndPassword: signInMock,
    signInWithPopup: popupMock,
    GoogleAuthProvider: vi.fn(),
}));

describe("LoginPage", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        signInMock.mockResolvedValue({ user: { uid: "user-123" } });
        popupMock.mockResolvedValue({ user: { uid: "user-123" } });
    });

    const renderPage = () => render(
        <MemoryRouter initialEntries={["/login"]}>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/tasks" element={<div>Tareas protegidas</div>} />
            </Routes>
        </MemoryRouter>
    );

    it("inicia sesión y navega a la ruta protegida", async () => {
        const user = userEvent.setup();
        renderPage();

        await user.type(screen.getByLabelText("Correo Electrónico"), "test@example.com");
        await user.type(screen.getByLabelText("Contraseña"), "secret123");
        await user.click(screen.getByRole("button", { name: "Iniciar Sesión" }));

        expect(signInMock).toHaveBeenCalledWith(expect.anything(), "test@example.com", "secret123");
        expect(await screen.findByText("Tareas protegidas")).toBeInTheDocument();
    });

    it("muestra un mensaje para credenciales inválidas", async () => {
        signInMock.mockRejectedValueOnce({ code: "auth/invalid-credential" });
        const user = userEvent.setup();
        renderPage();

        await user.type(screen.getByLabelText("Correo Electrónico"), "test@example.com");
        await user.type(screen.getByLabelText("Contraseña"), "wrongpass");
        await user.click(screen.getByRole("button", { name: "Iniciar Sesión" }));

        expect(await screen.findByText("Correo o contraseña incorrectos.")).toBeInTheDocument();
    });

    it("permite iniciar sesión con Google", async () => {
        const user = userEvent.setup();
        renderPage();

        await user.click(screen.getByRole("button", { name: "Iniciar sesión con Google" }));

        expect(popupMock).toHaveBeenCalled();
        expect(await screen.findByText("Tareas protegidas")).toBeInTheDocument();
    });
});
