import { renderHook, act } from "@testing-library/react";
import { vi } from "vitest";
import { useTasks } from "../hooks/useTasks";

const { mockAuth } = vi.hoisted(() => ({
    mockAuth: { user: { uid: "user-123" } as { uid: string } | null },
}));

// Mock de useAuth
vi.mock("../hooks/useAuth", () => ({
    useAuth: () => mockAuth,
}));

// Mock de Firestore (todo dentro del factory)
vi.mock("firebase/firestore", () => {
    const mockAddDoc = vi.fn(() => Promise.resolve({ id: "new-task-id" }));
    const mockUpdateDoc = vi.fn(() => Promise.resolve());
    const mockDeleteDoc = vi.fn(() => Promise.resolve());

    const mockOnSnapshot = vi.fn((_q, onNext, onError) => {
        const snapshotMock = mockOnSnapshot as typeof mockOnSnapshot & {
            callback?: typeof onNext;
            errorCallback?: typeof onError;
        };
        snapshotMock.callback = onNext;
        snapshotMock.errorCallback = onError;
        return vi.fn();
    });

    return {
        getFirestore: vi.fn(() => ({})),
        collection: vi.fn(),
        query: vi.fn(),
        where: vi.fn(),
        doc: vi.fn(),
        onSnapshot: mockOnSnapshot,
        addDoc: mockAddDoc,
        updateDoc: mockUpdateDoc,
        deleteDoc: mockDeleteDoc,
    };
});

// Mock de utils
vi.mock("../utils/dateHelpers", () => ({
    getTaskDateStr: (date: any) => (date ? "2026-09-21" : null),
}));

describe("useTasks", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockAuth.user = { uid: "user-123" };
    });

    it("inicializa con loading=true y tasks vacías", () => {
        const { result } = renderHook(() => useTasks());
        expect(result.current.loading).toBe(true);
        expect(result.current.tasks).toEqual([]);
    });

    it("no consulta Firestore cuando no hay usuario autenticado", async () => {
        mockAuth.user = null;
        const { result } = renderHook(() => useTasks());
        const { onSnapshot } = await import("firebase/firestore");

        expect(result.current.loading).toBe(false);
        expect(result.current.tasks).toEqual([]);
        expect(onSnapshot).not.toHaveBeenCalled();
    });

    it("setea tasks cuando onSnapshot devuelve datos", async () => {
        const { result } = renderHook(() => useTasks());

        const fakeDoc = {
            id: "1",
            data: () => ({
                title: "Tarea 1",
                description: "Desc",
                completed: false,
                userId: "user-123",
                priority: "high",
                createdAt: Date.now(),
                dueDate: "2026-09-21",
            }),
        };
        const fakeSnapshot = { docs: [fakeDoc] };

        const { onSnapshot } = await import("firebase/firestore");

        await act(async () => {
            (onSnapshot as any).callback(fakeSnapshot);
        });

        expect(result.current.tasks[0].title).toBe("Tarea 1");
        expect(result.current.loading).toBe(false);
    });

    it("normaliza valores opcionales y timestamps de Firestore", async () => {
        const { result } = renderHook(() => useTasks());
        const { onSnapshot } = await import("firebase/firestore");

        await act(async () => {
            (onSnapshot as any).callback({
                docs: [{
                    id: "2",
                    data: () => ({
                        completed: 1,
                        userId: "user-123",
                        createdAt: { toMillis: () => 123456 },
                        dueDate: null,
                    }),
                }],
            });
        });

        expect(result.current.tasks[0]).toMatchObject({
            id: "2",
            title: "",
            description: "",
            completed: true,
            priority: "medium",
            createdAt: 123456,
            dueDate: null,
        });
    });

    it("deja de cargar y conserva la lista vacía si Firestore falla", async () => {
        const { result } = renderHook(() => useTasks());
        const { onSnapshot } = await import("firebase/firestore");

        await act(async () => {
            (onSnapshot as any).errorCallback(new Error("Firestore unavailable"));
        });

        expect(result.current.loading).toBe(false);
        expect(result.current.tasks).toEqual([]);
        expect(result.current.error).toMatch(/sincronizar/i);
    });

    it("cancela la suscripción al desmontarse", async () => {
        const { result, unmount } = renderHook(() => useTasks());
        const { onSnapshot } = await import("firebase/firestore");

        const unsubscribe = (onSnapshot as any).mock.results[0].value;
        unmount();

        expect(unsubscribe).toHaveBeenCalledTimes(1);
        expect(result.current.loading).toBe(true);
    });

    it("addTask llama a addDoc con datos correctos", async () => {
        const { result } = renderHook(() => useTasks());
        const { addDoc } = await import("firebase/firestore");

        await act(async () => {
            await result.current.addTask("Nueva tarea", "Desc", "2026-09-21", "low");
        });

        expect(addDoc).toHaveBeenCalled();
        const args = (addDoc as any).mock.calls[0][1];
        expect(args.title).toBe("Nueva tarea");
        expect(args.description).toBe("Desc");
        expect(args.dueDate).toBe("2026-09-21");
        expect(args.priority).toBe("low");
        expect(args.userId).toBe("user-123");
    });

    it("updateTask llama a updateDoc con updates limpios", async () => {
        const { result } = renderHook(() => useTasks());
        const { updateDoc } = await import("firebase/firestore");

        await act(async () => {
            await result.current.updateTask("1", { title: "Editada", description: undefined });
        });

        expect(updateDoc).toHaveBeenCalled();
        const updates = (updateDoc as any).mock.calls[0][1];
        expect(updates.title).toBe("Editada");
        expect(updates.description).toBeUndefined();
    });

    it("deleteTask llama a deleteDoc", async () => {
        const { result } = renderHook(() => useTasks());
        const { deleteDoc } = await import("firebase/firestore");

        await act(async () => {
            await result.current.deleteTask("1");
        });

        expect(deleteDoc).toHaveBeenCalled();
    });

    it("expone un mensaje de error si deleteTask falla (caso borde)", async () => {
        const { result } = renderHook(() => useTasks());
        const { deleteDoc } = await import("firebase/firestore");
        (deleteDoc as any).mockRejectedValueOnce(new Error("permission-denied"));

        await act(async () => {
            await expect(result.current.deleteTask("1")).rejects.toThrow();
        });

        expect(result.current.error).toMatch(/no se pudo eliminar/i);
    });
});