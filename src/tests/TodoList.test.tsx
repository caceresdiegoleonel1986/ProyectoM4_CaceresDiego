import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import TodoList from "../components/TodoList";
import type { Task } from "../types/task";

const baseTask: Task = {
    id: "task-1",
    title: "Preparar entrega",
    description: "Revisar los tests",
    completed: false,
    userId: "user-123",
    createdAt: Date.now(),
    priority: "high",
    dueDate: "2099-01-15",
};

describe("TodoList", () => {
    it("muestra el loader mientras carga", () => {
        render(<TodoList tasks={[]} loading updateTask={vi.fn()} deleteTask={vi.fn()} />);

        expect(screen.getByText("Cargando tus tareas...")).toBeInTheDocument();
    });

    it("muestra el estado vacío sin tareas", () => {
        render(<TodoList tasks={[]} loading={false} updateTask={vi.fn()} deleteTask={vi.fn()} />);

        expect(screen.getByText("No hay tareas para mostrar")).toBeInTheDocument();
    });

    it("permite completar y eliminar una tarea", async () => {
        const user = userEvent.setup();
        const updateTask = vi.fn(() => Promise.resolve());
        const deleteTask = vi.fn(() => Promise.resolve());
        render(<TodoList tasks={[baseTask]} loading={false} updateTask={updateTask} deleteTask={deleteTask} />);

        await user.click(screen.getByTitle("Marcar como completada"));
        await user.click(screen.getByRole("button", { name: /Eliminar$/i }));

        expect(updateTask).toHaveBeenCalledWith("task-1", { completed: true });
        expect(deleteTask).toHaveBeenCalledWith("task-1");
    });

    it("renderiza descripción, prioridad y fecha de vencimiento", () => {
        render(<TodoList tasks={[baseTask]} loading={false} updateTask={vi.fn()} deleteTask={vi.fn()} />);

        expect(screen.getByText("Preparar entrega")).toBeInTheDocument();
        expect(screen.getByText("Revisar los tests")).toBeInTheDocument();
        expect(screen.getByText("⚡ Alta")).toBeInTheDocument();
        expect(screen.getByText(/15\/1/)).toBeInTheDocument();
    });
});
