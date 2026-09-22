import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import RegisterPage from "../pages/Register";

const { registerMock } = vi.hoisted(() => ({
    registerMock: vi.fn(),
}));

vi.mock("firebase/auth", () => ({
    getAuth: vi.fn(() => ({})),
    createUserWithEmailAndPassword: registerMock,
    GoogleAuthProvider: vi.fn(),
}));

describe("RegisterPage", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        registerMock.mockResolvedValue({ user: { uid: "user-123" } });
    });

    const renderPage = () => render(
        <MemoryRouter initialEntries={["/register"]}>
            <Routes>
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/tasks" element={<div>Tareas protegidas</div>} />
            </Routes>
        </MemoryRouter>
    );

    it("rechaza contraseñas menores a seis caracteres", async () => {
        const user = userEvent.setup();
        renderPage();

        await user.type(screen.getByLabelText("Correo Electrónico"), "new@example.com");
        await user.type(screen.getByLabelText(/Contraseña/), "12345");
        await user.click(screen.getByRole("button", { name: "Crear Cuenta" }));

        expect(screen.getByText("La contraseña debe tener al menos 6 caracteres.")).toBeInTheDocument();
        expect(registerMock).not.toHaveBeenCalled();
    });

    it("registra la cuenta y navega a tareas", async () => {
        const user = userEvent.setup();
        renderPage();

        await user.type(screen.getByLabelText("Correo Electrónico"), "new@example.com");
        await user.type(screen.getByLabelText(/Contraseña/), "secret123");
        await user.click(screen.getByRole("button", { name: "Crear Cuenta" }));

        expect(registerMock).toHaveBeenCalledWith(expect.anything(), "new@example.com", "secret123");
        expect(await screen.findByText("Tareas protegidas")).toBeInTheDocument();
    });

    it("muestra el error de email ya registrado", async () => {
        registerMock.mockRejectedValueOnce({ code: "auth/email-already-in-use" });
        const user = userEvent.setup();
        renderPage();

        await user.type(screen.getByLabelText("Correo Electrónico"), "existing@example.com");
        await user.type(screen.getByLabelText(/Contraseña/), "secret123");
        await user.click(screen.getByRole("button", { name: "Crear Cuenta" }));

        expect(await screen.findByText("Este correo electrónico ya está registrado.")).toBeInTheDocument();
    });
});
