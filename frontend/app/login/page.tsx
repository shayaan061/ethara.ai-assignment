"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "../context/UserContext";

export default function Login() {
    const router = useRouter();
    const { login } = useUser();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch("process.env.NEXT_PUBLIC_API_URL/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await res.json();

        if (data.access) {
            login(username, data.role, data.access);

            // ✅ redirect to dashboard
            router.push("/dashboard");
        } else {
            alert("Login failed");
        }
    };


    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-200 dark:from-zinc-900 dark:to-black overflow-hidden relative selection:bg-zinc-800 selection:text-white">
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
                className="relative z-10 w-full max-w-md p-10 mx-4 bg-white/50 dark:bg-black/40 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-3xl shadow-2xl"
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
                        Welcome Back
                    </h1>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        Please enter your details to sign in.
                    </p>
                </div>

                <form onSubmit={handleLogin} className="flex flex-col gap-5">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Username
                        </label>
                        <input
                            className="w-full px-4 py-3 text-sm transition-all bg-white border border-zinc-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-zinc-900/50 dark:border-zinc-700 dark:text-white dark:focus:ring-blue-500/30"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Password
                        </label>
                        <input
                            className="w-full px-4 py-3 text-sm transition-all bg-white border border-zinc-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-zinc-900/50 dark:border-zinc-700 dark:text-white dark:focus:ring-blue-500/30"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="w-full px-8 py-3.5 mt-2 text-sm font-medium text-white transition-shadow bg-zinc-900 rounded-xl shadow-lg hover:shadow-xl hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                    >
                        Sign In
                    </motion.button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        Don't have an account?{" "}
                        <Link href="/register" className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                            Sign up
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}