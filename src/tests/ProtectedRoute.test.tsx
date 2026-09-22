import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { vi } from "vitest";
import { ProtectedRoute } from "../routes/ProtectedRoute";

const { authState } = vi.hoisted(() => ({
    authState: { user: null as { uid: string } | null, loading: false },
}));

vi.mock("../hooks/useAuth", () => ({
    useAuth: () => authState,
}));

describe("ProtectedRoute", () => {
    beforeEach(() => {
        authState.user = null;
        authState.loading = false;
    });

    const renderRoute = () => render(
        <MemoryRouter initialEntries={["/tasks"]}>
            <Routes>
                <Route
                    path="/tasks"
                    element={
                        <ProtectedRoute>
                            <div>Contenido protegido</div>
                        </ProtectedRoute>
                    }
                />
                <Route path="/login" element={<div>Pantalla de login</div>} />
            </Routes>
        </MemoryRouter>
    );

    it("muestra el loader mientras verifica la sesión", () => {
        authState.loading = true;

        renderRoute();

        expect(screen.getByText("Verificando sesión...")).toBeInTheDocument();
        expect(screen.queryByText("Contenido protegido")).not.toBeInTheDocument();
    });

    it("redirige al login cuando no hay usuario", () => {
        renderRoute();

        expect(screen.getByText("Pantalla de login")).toBeInTheDocument();
        expect(screen.queryByText("Contenido protegido")).not.toBeInTheDocument();
    });

    it("renderiza el contenido para un usuario autenticado", () => {
        authState.user = { uid: "user-123" };

        renderRoute();

        expect(screen.getByText("Contenido protegido")).toBeInTheDocument();
    });
});
