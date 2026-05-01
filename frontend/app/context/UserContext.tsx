"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface UserContextType {
    username: string | null;
    role: string | null;
    token: string | null;
    login: (username: string, role: string, token: string) => void;
    logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    const [username, setUsername] = useState<string | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        // Hydrate from localStorage on client load
        const storedToken = localStorage.getItem("token");
        const storedRole = localStorage.getItem("role");
        const storedUsername = localStorage.getItem("username");

        if (storedToken) setToken(storedToken);
        if (storedRole) setRole(storedRole);
        if (storedUsername) setUsername(storedUsername);
    }, []);

    const login = (newUsername: string, newRole: string, newToken: string) => {
        localStorage.setItem("token", newToken);
        localStorage.setItem("role", newRole);
        localStorage.setItem("username", newUsername);
        setToken(newToken);
        setRole(newRole);
        setUsername(newUsername);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("username");
        setToken(null);
        setRole(null);
        setUsername(null);
        router.push("/login");
    };

    return (
        <UserContext.Provider value={{ username, role, token, login, logout }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
}
