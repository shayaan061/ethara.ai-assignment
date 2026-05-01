"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useUser } from "../context/UserContext";

export default function Tasks() {
    const { token } = useUser();
    const [title, setTitle] = useState("");
    const [projectId, setProjectId] = useState("");
    const [assignedTo, setAssignedTo] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [projects, setProjects] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);

    useEffect(() => {
        if (!token) return;

        // fetch projects
        fetch("process.env.NEXT_PUBLIC_API_URL/api/projects/list", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setProjects(data);
            });

        // fetch users
        fetch("process.env.NEXT_PUBLIC_API_URL/api/users/list", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setUsers(data);
            });
    }, [token]);

    const createTask = async (e: any) => {
        e.preventDefault();

        if (!dueDate || dueDate.length !== 10) {
            alert("Invalid date format");
            return;
        }

        const res = await fetch("process.env.NEXT_PUBLIC_API_URL/api/tasks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                title,
                project_id: Number(projectId),
                assigned_to: Number(assignedTo),
                due_date: dueDate,
            }),
        });

        const data = await res.json();

        if (res.ok) {
            alert("Task created");
        } else {
            alert("Error: " + JSON.stringify(data));
        }
    };
    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-10 bg-gradient-to-br from-zinc-50 to-zinc-200 dark:from-zinc-900 dark:to-black overflow-hidden relative selection:bg-zinc-800 selection:text-white">
            {/* Abstract Background Shapes */}
            <motion.div
                className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-[100px] pointer-events-none"
                animate={{
                    x: [0, 50, 0],
                    y: [0, 30, 0],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />
            <motion.div
                className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-purple-500/10 blur-[80px] pointer-events-none"
                animate={{
                    x: [0, -40, 0],
                    y: [0, -40, 0],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-10 w-full max-w-lg p-10 mx-4 bg-white/50 dark:bg-black/40 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-3xl shadow-2xl"
            >
                <div className="flex flex-col items-center gap-2 mb-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="px-4 py-1.5 text-xs font-semibold tracking-wide text-blue-600 uppercase bg-blue-100/50 dark:text-blue-400 dark:bg-blue-900/30 rounded-full"
                    >
                        Ethara.Ai Assignment
                    </motion.div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
                        Create Task
                    </h1>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        Assign a new task to your team.
                    </p>
                </div>

                <form onSubmit={createTask} className="flex flex-col gap-5">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Task Title
                        </label>
                        <input
                            className="w-full px-4 py-3 text-sm transition-all bg-white border border-zinc-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-zinc-900/50 dark:border-zinc-700 dark:text-white dark:focus:ring-blue-500/30"
                            placeholder="e.g. Update user dashboard"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Project
                        </label>
                        <select
                            className="w-full px-4 py-3 text-sm transition-all bg-white border border-zinc-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-zinc-900/50 dark:border-zinc-700 dark:text-white dark:focus:ring-blue-500/30 appearance-none"
                            value={projectId}
                            onChange={(e) => setProjectId(e.target.value)}
                            required
                        >
                            <option value="">Select Project</option>
                            {Array.isArray(projects) && projects.map((p: any) => (
                                <option key={p.id} value={p.id}>
                                    {p.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Assign User
                        </label>
                        <select
                            className="w-full px-4 py-3 text-sm transition-all bg-white border border-zinc-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-zinc-900/50 dark:border-zinc-700 dark:text-white dark:focus:ring-blue-500/30 appearance-none"
                            value={assignedTo}
                            onChange={(e) => setAssignedTo(e.target.value)}
                            required
                        >
                            <option value="">Select User</option>
                            {Array.isArray(users) && users.map((u: any) => (
                                <option key={u.id} value={u.id}>
                                    {u.username}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Due Date
                        </label>
                        <input
                            className="w-full px-4 py-3 text-sm transition-all bg-white border border-zinc-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-zinc-900/50 dark:border-zinc-700 dark:text-white dark:focus:ring-blue-500/30"
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            required
                        />
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="w-full px-8 py-3.5 mt-2 text-sm font-medium text-white transition-shadow bg-zinc-900 rounded-xl shadow-lg hover:shadow-xl hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                    >
                        Create Task
                    </motion.button>
                </form>

                <div className="mt-6 text-center">
                    <Link href="/dashboard" className="text-sm font-semibold text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors">
                        ← Back to Dashboard
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}