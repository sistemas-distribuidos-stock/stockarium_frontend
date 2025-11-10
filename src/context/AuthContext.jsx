import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "../utils/storage";

const AuthContext = createContext({
    token: null,
    user: null,
    isLoading: true,
    login: async () => {},
    logout: async () => {},
    register: async () => {},
});

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const API_URL = "http://localhost:8080";

    // Carga inicial
    useEffect(() => {
        const loadAuth = async () => {
            try {
                const savedToken = await AsyncStorage.getItem("token");
                const savedUser = await AsyncStorage.getItem("user");
                if (savedToken) setToken(savedToken);
                if (savedUser) setUser(savedUser);
            } catch (error) {
                console.error("Error cargando sesión:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadAuth();
    }, []);

    // Login → backend /api/auth/login
    const login = async (username, password) => {
        const response = await fetch(`${API_URL}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) throw new Error("Credenciales inválidas");

        const data = await response.json();
        const jwt = data.jwt || data.token || data; // tu backend devuelve new AuthResponseDTO(jwt)

        setToken(jwt);
        setUser(username);
        await AsyncStorage.setItem("token", jwt);
        await AsyncStorage.setItem("user", username);
    };

    // Registro → backend /api/auth/register
    const register = async (payload) => {
        const response = await fetch(`${API_URL}/api/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(text);
        }

        return await response.text();
    };

    const logout = async () => {
        setToken(null);
        setUser(null);
        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("user");
    };

    return (
        <AuthContext.Provider value={{ token, user, isLoading, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
