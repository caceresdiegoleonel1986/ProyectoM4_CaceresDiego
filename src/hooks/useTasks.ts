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
import type { Task } from "../types/task";
import { useAuth } from "./useAuth";
import { getTaskDateStr } from "../utils/dateHelpers";

export const useTasks = () => {
    const { user } = useAuth();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

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
                        priority: (d.priority as "low" | "medium" | "high") || "medium",
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
            },
            (error) => {
                console.error("Error al escuchar tareas en Firestore:", error);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [user]);

    const addTask = async (
        title: string,
        description?: string,
        dueDate?: string | null,
        priority: "low" | "medium" | "high" = "medium"
    ) => {
        if (!user) {
            throw new Error("No hay una sesión de usuario activa para crear la tarea.");
        }

        const taskData: Record<string, any> = {
            title: title.trim(),
            description: (description || "").trim(),
            completed: false,
            userId: user.uid,
            createdAt: Date.now(),
            priority: priority || "medium",
            dueDate: dueDate ? dueDate.trim() : null,
        };

        return await addDoc(collection(db, "tasks"), taskData);
    };

    const updateTask = async (id: string, updates: Partial<Task>) => {
        const taskRef = doc(db, "tasks", id);
        // Evitamos enviar campos con valor undefined que Firestore rechaza
        const cleanUpdates: Record<string, any> = {};
        for (const [key, value] of Object.entries(updates)) {
            if (value !== undefined) {
                cleanUpdates[key] = value;
            }
        }
        await updateDoc(taskRef, cleanUpdates);
    };

    const deleteTask = async (id: string) => {
        const taskRef = doc(db, "tasks", id);
        await deleteDoc(taskRef);
    };

    return { tasks, loading, addTask, updateTask, deleteTask };
};