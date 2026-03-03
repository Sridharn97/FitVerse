import React, { createContext, useContext, useState, useCallback } from "react";
const AuthContext = createContext({});
export const useAuth = () => useContext(AuthContext);
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem("fitforge_user");
        return saved ? JSON.parse(saved) : null;
    });
    const login = useCallback((email, _password) => {
        const users = JSON.parse(localStorage.getItem("fitforge_users") || "[]");
        const found = users.find((u) => u.email === email);
        if (found) {
            setUser(found);
            localStorage.setItem("fitforge_user", JSON.stringify(found));
            return true;
        }
        return false;
    }, []);
    const signup = useCallback((name, email, _password) => {
        const users = JSON.parse(localStorage.getItem("fitforge_users") || "[]");
        if (users.find((u) => u.email === email))
            return false;
        const newUser = { id: crypto.randomUUID(), name, email };
        users.push(newUser);
        localStorage.setItem("fitforge_users", JSON.stringify(users));
        setUser(newUser);
        localStorage.setItem("fitforge_user", JSON.stringify(newUser));
        return true;
    }, []);
    const logout = useCallback(() => {
        setUser(null);
        localStorage.removeItem("fitforge_user");
    }, []);
    const updateProfile = useCallback((data) => {
        setUser(prev => {
            if (!prev)
                return null;
            const updated = { ...prev, ...data };
            localStorage.setItem("fitforge_user", JSON.stringify(updated));
            return updated;
        });
    }, []);
    return (<AuthContext.Provider value={{ user, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>);
};
