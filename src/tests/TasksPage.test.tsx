import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import TasksPage from "../pages/Tasks";

// Mock de useAuth
vi.mock("../hooks/useAuth", () => ({
    useAuth: () => ({ user: { email: "test@example.com", displayName: "Diego" } }),
}));

// Mock de useTasks
vi.mock("../hooks/useTasks", () => ({
    useTasks: () => ({
        tasks: [
            { id: "1", title: "Tarea pendiente", completed: false, priority: "low" },
            { id: "2", title: "Tarea completada", completed: true, priority: "high" },
        ],
        loading: false,
        updateTask: vi.fn(),
        deleteTask: vi.fn(),
    }),
}));

describe("TasksPage", () => {
    it("muestra saludo con nombre de usuario", () => {
        render(
            <MemoryRouter>
                <TasksPage />
            </MemoryRouter>
        );
        expect(screen.getByText(/¡Hola, Diego!/)).toBeInTheDocument();
    });

    it("muestra métricas de tareas", () => {
        render(
            <MemoryRouter>
                <TasksPage />
            </MemoryRouter>
        );
        expect(screen.getByText("Total Tareas")).toBeInTheDocument();
        expect(screen.getByText("Completadas")).toBeInTheDocument();
        expect(screen.getByText("Pendientes")).toBeInTheDocument();
    });

    it("filtra tareas por estado", () => {
        render(
            <MemoryRouter>
                <TasksPage />
            </MemoryRouter>
        );
        fireEvent.click(screen.getByRole("button", { name: /Completadas/ }));
        expect(screen.getByText("Tarea completada")).toBeInTheDocument();
    });

    it("renderiza el botón de EmailSummaryButton", () => {
        render(
            <MemoryRouter>
                <TasksPage />
            </MemoryRouter>
        );
        expect(screen.getByText("📧 Enviar mi resumen")).toBeInTheDocument();
    });
});