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
    Timestamp,
} from "firebase/firestore";
import { db } from "../services/firebase";
import type { Task } from "../types/task";
import { useAuth } from "./useAuth";

export const useTasks = () => {
    const { user } = useAuth();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const q = query(collection(db, "tasks"), where("userId", "==", user.uid));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data: Task[] = snapshot.docs.map((docSnap) => ({
                id: docSnap.id,
                ...docSnap.data(),
            })) as Task[];
            setTasks(data);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const addTask = async (title: string, description?: string) => {
        if (!user) return;
        await addDoc(collection(db, "tasks"), {
            title,
            description,
            completed: false,
            userId: user.uid,
            createdAt: Timestamp.now().toMillis(),
        });
    };

    const updateTask = async (id: string, updates: Partial<Task>) => {
        const taskRef = doc(db, "tasks", id);
        await updateDoc(taskRef, updates);
    };

    const deleteTask = async (id: string) => {
        const taskRef = doc(db, "tasks", id);
        await deleteDoc(taskRef);
    };

    return { tasks, loading, addTask, updateTask, deleteTask };
};