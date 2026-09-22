import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TodoForm from "../components/TodoForm";
import { vi } from "vitest";

const mockAddTask = vi.fn(() => Promise.resolve());

vi.mock("../hooks/useTasks", () => ({
    useTasks: () => ({
        addTask: mockAddTask,
    }),
}));

describe("TodoForm", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renderiza inputs y botón en modo normal", () => {
        render(<TodoForm />);
        expect(screen.getByPlaceholderText("Título de la tarea...")).toBeInTheDocument();
        expect(screen.getByText(/Agregar tarea/i)).toBeInTheDocument();
    });

    it("renderiza inputs y botón en modo compacto", () => {
        render(<TodoForm compact />);
        expect(screen.getByPlaceholderText("Título de la tarea...")).toBeInTheDocument();
        expect(screen.getByText(/Agregar/i)).toBeInTheDocument();
    });

    it("llama a addTask con datos correctos", async () => {
        render(<TodoForm />);
        const titleInput = screen.getByPlaceholderText("Título de la tarea...");
        const descInput = screen.getByPlaceholderText("Detalles o notas (opcional)...");

        await userEvent.type(titleInput, "Nueva tarea");
        await userEvent.type(descInput, "Descripción");

        const submitBtn = screen.getByRole("button", { name: /Agregar tarea/i });
        await userEvent.click(submitBtn);

        await waitFor(() => {
            expect(mockAddTask).toHaveBeenCalledWith("Nueva tarea", "Descripción", null, "medium");
        });
    });

    it("limpia los campos después de agregar tarea", async () => {
        render(<TodoForm />);
        fireEvent.change(screen.getByPlaceholderText("Título de la tarea..."), {
            target: { value: "Tarea limpia" },
        });

        fireEvent.submit(screen.getByPlaceholderText("Título de la tarea...").closest("form")!);

        await waitFor(() => {
            expect(screen.getByPlaceholderText("Título de la tarea...")).toHaveValue("");
        });
    });

    it("ejecuta onTaskAdded si se pasa como prop", async () => {
        const mockOnTaskAdded = vi.fn();
        render(<TodoForm onTaskAdded={mockOnTaskAdded} />);

        fireEvent.change(screen.getByPlaceholderText("Título de la tarea..."), {
            target: { value: "Tarea con callback" },
        });

        fireEvent.submit(screen.getByPlaceholderText("Título de la tarea...").closest("form")!);

        await waitFor(() => {
            expect(mockOnTaskAdded).toHaveBeenCalled();
        });
    });

    it("permite asignar fecha rápida (Hoy)", () => {
        render(<TodoForm />);
        const hoyBtn = screen.getByText("Hoy");
        fireEvent.click(hoyBtn);
        const dateInput = screen.getByTitle("Fecha asignada en agenda");
        expect(dateInput).toHaveValue(new Date().toISOString().split("T")[0]);
    });
});