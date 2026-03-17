import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
const AuthContext = createContext({
    user: null,
    authLoading: true,
    login: async () => false,
    signup: async () => false,
    logout: async () => {},
    updateProfile: async () => {},
});
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);

    useEffect(() => {
        localStorage.removeItem("fitforge_user");
        localStorage.removeItem("fitforge_token");
        localStorage.removeItem("fitforge_workouts");
        localStorage.removeItem("fitforge_progress");
        localStorage.removeItem("fitforge_meals");
        localStorage.removeItem("fitforge_goal");
        localStorage.removeItem("fitforge_posts");

        const bootstrap = async () => {
            try {
                const res = await apiRequest("/auth/me");
                setUser({
                    id: res.data._id,
                    name: res.data.name,
                    email: res.data.email,
                    age: res.data.age,
                    height: res.data.height,
                    weight: res.data.weight,
                    goal: res.data.goal,
                    avatarUrl: res.data.avatarUrl,
                    isAnonymous: res.data.isAnonymous ?? false,
                });
            }
            catch (_error) {
                setUser(null);
            }
            finally {
                setAuthLoading(false);
            }
        };

        bootstrap();
    }, []);

    const login = useCallback(async (email, password) => {
        try {
            const res = await apiRequest("/auth/login", {
                method: "POST",
                body: JSON.stringify({ email, password }),
            });

            const nextUser = {
                id: res.data.user.id,
                name: res.data.user.name,
                email: res.data.user.email,
                isAnonymous: res.data.user.isAnonymous ?? false,
            };

            setUser(nextUser);
            return true;
        }
        catch (_error) {
            return false;
        }
    }, []);

    const signup = useCallback(async (name, email, password) => {
        try {
            const res = await apiRequest("/auth/register", {
                method: "POST",
                body: JSON.stringify({ name, email, password }),
            });

            const nextUser = {
                id: res.data.user.id,
                name: res.data.user.name,
                email: res.data.user.email,
                isAnonymous: res.data.user.isAnonymous ?? false,
            };

            setUser(nextUser);
            return true;
        }
        catch (_error) {
            return false;
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            await apiRequest("/auth/logout", { method: "POST" });
        }
        catch (_error) {
        }
        setUser(null);
    }, []);

    const updateProfile = useCallback(async (data) => {
        const res = await apiRequest("/users/profile", {
            method: "PUT",
            body: JSON.stringify(data),
        });

        const updated = {
            id: res.data._id,
            name: res.data.name,
            email: res.data.email,
            age: res.data.age,
            height: res.data.height,
            weight: res.data.weight,
            goal: res.data.goal,
            avatarUrl: res.data.avatarUrl,
            isAnonymous: res.data.isAnonymous ?? false,
        };

        setUser(updated);
        return updated;
    }, []);

        return (<AuthContext.Provider value={{ user, authLoading, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>);
};
