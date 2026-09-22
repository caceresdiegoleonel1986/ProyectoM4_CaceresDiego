import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { act } from "react";
import EmailSummaryButton from "../components/Email.SummaryButton"; // tu import está bien
import type { Task } from "../types/task";

const mockTodos: Partial<Task>[] = [
    { id: "1", title: "Tarea 1", completed: false },
    { id: "2", title: "Tarea 2", completed: true },
];

describe("EmailSummaryButton", () => {
    beforeEach(() => {
        globalThis.fetch = vi.fn(() =>
            new Promise((resolve) =>
                setTimeout(
                    () =>
                        resolve({
                            ok: true,
                            json: () => Promise.resolve({ message: "Email enviado" }),
                        }),
                    50
                )
            )
        ) as any;
    });

    it("renderiza el botón con texto inicial", () => {
        render(<EmailSummaryButton todos={mockTodos as Task[]} userEmail="test@example.com" />);
        expect(screen.getByText("📧 Enviar mi resumen")).toBeInTheDocument();
    });

    it("muestra spinner y texto 'Enviando...' al hacer click", async () => {
        render(<EmailSummaryButton todos={mockTodos as Task[]} userEmail="test@example.com" />);
        await act(async () => {
            fireEvent.click(screen.getByText("📧 Enviar mi resumen"));
        });
        const loadingText = await screen.findByText(/Enviando.../i);
        expect(loadingText).toBeTruthy();
    });

    it("muestra toast de éxito cuando el envío es correcto", async () => {
        render(<EmailSummaryButton todos={mockTodos as Task[]} userEmail="test@example.com" />);
        fireEvent.click(screen.getByText("📧 Enviar mi resumen"));
        await waitFor(() => {
            expect(screen.getByText("¡Email enviado!")).toBeInTheDocument();
        });
    });

    it("muestra toast de error cuando la API falla", async () => {
        (globalThis.fetch as any).mockImplementationOnce(() =>
            Promise.resolve({
                ok: false,
                json: () => Promise.resolve({ message: "Error en servidor" }),
            })
        );
        render(<EmailSummaryButton todos={mockTodos as Task[]} userEmail="test@example.com" />);
        fireEvent.click(screen.getByText("📧 Enviar mi resumen"));
        await waitFor(() => {
            expect(screen.getByText("Error en servidor")).toBeInTheDocument();
        });
    });

    it("muestra error de conexión cuando fetch falla", async () => {
        (globalThis.fetch as any).mockRejectedValueOnce(new Error("Network error"));
        render(<EmailSummaryButton todos={mockTodos as Task[]} userEmail="test@example.com" />);

        fireEvent.click(screen.getByText("📧 Enviar mi resumen"));

        expect(await screen.findByText("No se pudo conectar con el servidor.")).toBeInTheDocument();
    });

    it("deshabilita el botón mientras espera la respuesta", async () => {
        render(<EmailSummaryButton todos={mockTodos as Task[]} userEmail="test@example.com" />);

        fireEvent.click(screen.getByText("📧 Enviar mi resumen"));

        expect(screen.getByRole("button", { name: /Enviando/i })).toBeDisabled();
    });

    it("deshabilita el botón y no llama a fetch cuando no hay tareas (caso borde)", () => {
        render(<EmailSummaryButton todos={[]} userEmail="test@example.com" />);

        const button = screen.getByRole("button", { name: /Enviar mi resumen/i });
        expect(button).toBeDisabled();

        fireEvent.click(button);
        expect(globalThis.fetch).not.toHaveBeenCalled();
    });
});