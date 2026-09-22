import { useEffect, useState } from "react";
import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    onSnapshot,
    query,
    where,
} from "firebase/firestore";
import { db } from "../services/firebase";
import type { Task, TaskPriority } from "../types/task";
import { useAuth } from "./useAuth";
import { getTaskDateStr } from "../utils/dateHelpers";

export const useTasks = () => {
    const { user } = useAuth();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user) {
            setTasks([]);
            setLoading(false);
            return;
        }

        const q = query(collection(db, "tasks"), where("userId", "==", user.uid));
        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const data: Task[] = snapshot.docs.map((docSnap) => {
                    const d = docSnap.data();

                    return {
                        id: docSnap.id,
                        title: d.title || "",
                        description: d.description || "",
                        completed: Boolean(d.completed),
                        userId: d.userId,
                        priority: (d.priority as TaskPriority) || "medium",
                        createdAt:
                            typeof d.createdAt === "number"
                                ? d.createdAt
                                : typeof d.createdAt?.toMillis === "function"
                                ? d.createdAt.toMillis()
                                : Date.now(),
                        dueDate: getTaskDateStr(d.dueDate) || null,
                    };
                });
                setTasks(data);
                setLoading(false);
                setError(null);
            },
            (err) => {
                console.error("Error al escuchar tareas en Firestore:", err);
                setLoading(false);
                setError("No se pudieron sincronizar tus tareas. Verifica tu conexión e intenta de nuevo.");
            }
        );

        return () => unsubscribe();
    }, [user]);

    const addTask = async (
        title: string,
        description?: string,
        dueDate?: string | null,
        priority: TaskPriority = "medium"
    ) => {
        if (!user) {
            throw new Error("No hay una sesión de usuario activa para crear la tarea.");
        }

        const taskData: Omit<Task, "id"> = {
            title: title.trim(),
            description: (description || "").trim(),
            completed: false,
            userId: user.uid,
            createdAt: Date.now(),
            priority: priority || "medium",
            dueDate: dueDate ? dueDate.trim() : null,
        };

        try {
            const ref = await addDoc(collection(db, "tasks"), taskData);
            setError(null);
            return ref;
        } catch (err) {
            setError("No se pudo crear la tarea. Intenta nuevamente.");
            throw err;
        }
    };

    const updateTask = async (id: string, updates: Partial<Task>) => {
        const taskRef = doc(db, "tasks", id);
        // Evitamos enviar campos con valor undefined que Firestore rechaza
        const cleanUpdates: Partial<Task> = {};
        for (const [key, value] of Object.entries(updates) as [keyof Task, Task[keyof Task]][]) {
            if (value !== undefined) {
                (cleanUpdates as Record<string, unknown>)[key] = value;
            }
        }
        try {
            await updateDoc(taskRef, cleanUpdates);
            setError(null);
        } catch (err) {
            setError("No se pudo actualizar la tarea. Intenta nuevamente.");
            throw err;
        }
    };

    const deleteTask = async (id: string) => {
        const taskRef = doc(db, "tasks", id);
        try {
            await deleteDoc(taskRef);
            setError(null);
        } catch (err) {
            setError("No se pudo eliminar la tarea. Intenta nuevamente.");
            throw err;
        }
    };

    return { tasks, loading, error, addTask, updateTask, deleteTask };
};