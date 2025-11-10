import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, requireAdmin = false }) {
    const token = localStorage.getItem("stockarium_token");
    if (!token) return <Navigate to="/login" replace />;

    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const exp = payload.exp * 1000;

        if (Date.now() > exp) throw new Error("Token expirado");

        const role = payload.role || payload.authorities || payload.rol;
        if (requireAdmin && role !== "ADMIN") throw new Error("No autorizado");
    } catch {
        localStorage.removeItem("stockarium_token");
        localStorage.removeItem("stockarium_user");
        return <Navigate to="/login" replace />;
    }

    return children;
}
