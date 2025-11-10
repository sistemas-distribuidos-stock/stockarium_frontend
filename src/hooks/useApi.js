import { useAuth } from "../context/AuthContext";

export function useApi() {
    const { token, logout } = useAuth();
    const API_URL = import.meta.env.VITE_API_URL;

    async function request(path, options = {}) {
        const headers = {
            "Content-Type": "application/json",
            ...(options.headers || {}),
        };

        if (token) headers.Authorization = `Bearer ${token}`;

        const response = await fetch(`${API_URL}${path}`, {
            ...options,
            headers,
        });

        if (response.status === 401) {
            await logout();
            throw new Error("Sesión expirada");
        }

        if (!response.ok) {
            const msg = await response.text();
            throw new Error(msg || "Error al obtener datos");
        }

        const contentType = response.headers.get("content-type");
        return contentType && contentType.includes("application/json")
            ? response.json()
            : response.text();
    }

    return { request };
}
