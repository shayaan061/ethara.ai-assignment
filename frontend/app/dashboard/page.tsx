"use client";

const API = "https://etharaai-assignment-production.up.railway.app";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "../context/UserContext";

export default function Dashboard() {
    const router = useRouter();
    const { username, role, token, logout } = useUser();
    const [data, setData] = useState<any>({ total: 0, completed: 0, overdue: 0, tasks: [] });
    const [isLoading, setIsLoading] = useState(true);
    const [projectTitle, setProjectTitle] = useState("");

    const createProject = async () => {
        if (!projectTitle.trim() || !token) return;

        const res = await fetch(`${API}/api/projects`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                title: projectTitle,
            }),
        });

        if (res.ok) {
            alert("Project created");
            setProjectTitle("");
            window.location.reload();
        } else {
            alert("Error creating project");
        }
    };

    const updateTask = async (id: number, updates: any) => {
        const res = await fetch(`${API}/api/tasks/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updates),
        });
        if (res.ok) window.location.reload();
    };

    const updateProject = async (id: number, title: string) => {
        const res = await fetch(`${API}/api/projects/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ title }),
        });
        if (res.ok) window.location.reload();
    };

    useEffect(() => {
        if (!token) return;

        fetch(`${API}/api/dashboard`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => res.json())
            .then((res) => {
                setData(res);
                setIsLoading(false);
            })
            .catch(() => setIsLoading(false));
    }, [token]);

    const statCards = [
        {
            title: "Total Tasks",
            value: data.total || 0,
            icon: (
                <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
            ),
            bgColor: "bg-blue-500/10",
        },
        {
            title: "Completed",
            value: data.completed || 0,
            icon: (
                <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            ),
            bgColor: "bg-emerald-500/10",
        },
        {
            title: "Overdue",
            value: data.overdue || 0,
            icon: (
                <svg className="w-6 h-6 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            bgColor: "bg-rose-500/10",
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-200 dark:from-zinc-900 dark:to-black overflow-hidden relative selection:bg-zinc-800 selection:text-white">
            {/* Abstract Background Shapes */}
            <motion.div
                className="fixed top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-[100px] pointer-events-none"
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
                className="fixed bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-purple-500/10 blur-[80px] pointer-events-none"
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

            <div className="relative z-10 max-w-6xl px-6 py-12 mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-start justify-between gap-4 mb-12 sm:flex-row sm:items-center"
                >
                    <div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="inline-block px-3 py-1 mb-3 text-xs font-semibold tracking-wide text-blue-600 uppercase bg-blue-100/50 dark:text-blue-400 dark:bg-blue-900/30 rounded-full"
                        >
                            {role === "ADMIN" ? "Admin View" : "Member View"}
                        </motion.div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
                            Welcome, {username || "User"}
                        </h1>
                        <p className="mt-1 text-zinc-600 dark:text-zinc-400">
                            Overview of your team's task metrics.
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <Link href="/task">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-white transition-shadow bg-zinc-900 rounded-xl shadow-lg hover:shadow-xl hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Create New Task
                            </motion.button>
                        </Link>
                        <motion.button
                            onClick={logout}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-red-600 transition-colors bg-white border border-red-200 rounded-xl hover:bg-red-50 dark:bg-zinc-900 dark:border-red-900/30 dark:hover:bg-red-900/20"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Logout
                        </motion.button>
                    </div>
                </motion.div>

                {isLoading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="w-8 h-8 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                    </div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className="flex flex-col gap-10"
                    >
                        {/* Admin Create Project */}
                        {role === "ADMIN" && (
                            <motion.div variants={itemVariants} className="flex flex-col gap-4 p-6 bg-white/60 dark:bg-black/40 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-3xl shadow-xl">
                                <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">Create New Project</h2>
                                <div className="flex flex-col gap-3 sm:flex-row">
                                    <input
                                        className="flex-1 px-4 py-3 bg-white/50 border rounded-xl dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder-zinc-400 dark:placeholder-zinc-600"
                                        placeholder="Enter project title..."
                                        value={projectTitle}
                                        onChange={(e) => setProjectTitle(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && createProject()}
                                    />
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="px-6 py-3 font-medium text-white bg-blue-600 rounded-xl shadow-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
                                        onClick={createProject}
                                    >
                                        Create Project
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                            {statCards.map((stat, index) => (
                                <motion.div
                                    key={index}
                                    variants={itemVariants}
                                    whileHover={{ y: -5 }}
                                    className="relative p-6 overflow-hidden bg-white/60 dark:bg-black/40 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-3xl shadow-xl group"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-medium text-zinc-600 dark:text-zinc-400">
                                            {stat.title}
                                        </h3>
                                        <div className={`p-3 rounded-2xl ${stat.bgColor}`}>
                                            {stat.icon}
                                        </div>
                                    </div>
                                    <div className="flex items-baseline gap-2">
                                        <h2 className="text-5xl font-bold tracking-tight text-zinc-900 dark:text-white">
                                            {stat.value}
                                        </h2>
                                    </div>

                                    {/* Decorative subtle glow on hover */}
                                    <div className="absolute inset-0 transition-opacity opacity-0 bg-gradient-to-br from-white/10 to-transparent group-hover:opacity-100 pointer-events-none" />
                                </motion.div>
                            ))}
                        </div>

                        {/* Task List */}
                        <div>
                            <motion.h2 variants={itemVariants} className="mb-6 text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                                Recent Tasks
                            </motion.h2>
                            <div className="flex flex-col gap-4">
                                {data.tasks?.length > 0 ? (
                                    data.tasks.map((task: any) => (
                                        <motion.div
                                            key={task.id}
                                            variants={itemVariants}
                                            whileHover={{ scale: 1.01 }}
                                            className="flex flex-col justify-between p-6 overflow-hidden sm:flex-row sm:items-center bg-white/60 dark:bg-black/40 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-2xl shadow-lg"
                                        >
                                            <div className="mb-4 sm:mb-0">
                                                <h3 className="text-lg font-bold text-zinc-900 dark:text-white">{task.title}</h3>
                                                <div className="flex items-center gap-4 mt-2 text-sm font-medium text-zinc-600 dark:text-zinc-400">
                                                    <span className="flex items-center gap-1.5 bg-white/50 dark:bg-black/50 px-3 py-1 rounded-full border border-zinc-200 dark:border-zinc-800">
                                                        <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                                        </svg>
                                                        {task.project}
                                                    </span>
                                                    <span className="flex items-center gap-1.5 bg-white/50 dark:bg-black/50 px-3 py-1 rounded-full border border-zinc-200 dark:border-zinc-800">
                                                        <svg className="w-4 h-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                        </svg>
                                                        {task.assigned_to}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-start gap-3 sm:items-end">
                                                {(role === "ADMIN" || username === task.assigned_to) ? (
                                                    <select
                                                        className="px-3 py-1.5 text-xs font-bold tracking-wide uppercase rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        onChange={(e) => updateTask(task.id, { status: e.target.value })}
                                                        defaultValue={task.status}
                                                    >
                                                        <option value="TODO">TODO</option>
                                                        <option value="IN_PROGRESS">IN_PROGRESS</option>
                                                        <option value="DONE">DONE</option>
                                                    </select>
                                                ) : (
                                                    <span className={`px-4 py-1.5 text-xs font-bold tracking-wide uppercase rounded-full ${task.status === "DONE" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50" :
                                                            task.status === "IN_PROGRESS" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50" :
                                                                "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-700"
                                                        }`}>
                                                        {task.status.replace("_", " ")}
                                                    </span>
                                                )}
                                                <span className="flex items-center gap-1.5 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                                                    <svg className="w-4 h-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    {task.due_date}
                                                </span>
                                            </div>
                                        </motion.div>
                                    ))
                                ) : (
                                    <motion.div variants={itemVariants} className="p-8 text-center border-2 border-dashed rounded-2xl border-zinc-300 dark:border-zinc-800">
                                        <p className="font-medium text-zinc-500 dark:text-zinc-400">No tasks found. Create one to get started!</p>
                                    </motion.div>
                                )}
                            </div>
                        </div>

                        {/* Projects List (Admin Only) */}
                        {role === "ADMIN" && data.projects?.length > 0 && (
                            <div>
                                <motion.div variants={itemVariants} className="mb-6">
                                    <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                                        Manage Projects
                                    </h2>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                                        Click on a project title to rename it. Press Enter or click away to save.
                                    </p>
                                </motion.div>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                                    {data.projects.map((p: any) => (
                                        <motion.div
                                            key={p.id}
                                            variants={itemVariants}
                                            className="group flex items-center p-4 bg-white/60 dark:bg-black/40 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-2xl shadow-lg gap-3"
                                        >
                                            <div className="flex items-center justify-center shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                                </svg>
                                            </div>
                                            <div className="relative flex-1 flex items-center">
                                                <input
                                                    defaultValue={p.title}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            e.currentTarget.blur();
                                                        }
                                                    }}
                                                    onBlur={(e) => {
                                                        if (e.target.value.trim() !== "" && e.target.value !== p.title) {
                                                            updateProject(p.id, e.target.value);
                                                        }
                                                    }}
                                                    className="w-full bg-transparent border border-transparent hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-white/50 dark:hover:bg-zinc-800/50 text-zinc-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white dark:focus:bg-zinc-900 rounded-lg px-2 py-1.5 transition-all"
                                                    title="Click to edit"
                                                />
                                                <svg className="w-4 h-4 text-zinc-400 absolute right-2 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                </svg>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </div>
        </div>
    );
}