import { useState } from "react";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import "../styles/login.css";
import { useAuth } from "../context/AuthContext";

export default function Login() {
    const { login } = useAuth();
    const [form, setForm] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            setLoading(true);
            setError("");
            await login(form.username, form.password);
            window.location.href = "/products";
        } catch (err) {
            setError(err.message || "Error al iniciar sesión");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="login-wrapper">
            <form className="login-box" onSubmit={handleSubmit}>
                <h2 className="login-title">Iniciar sesión</h2>

                {error && (
                    <p style={{ color: "#a12b2b", fontSize: "0.9rem", marginBottom: "1rem" }}>
                        {error}
                    </p>
                )}

                <Input
                    icon="user"
                    placeholder="Usuario"
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                />

                <Input
                    type="password"
                    icon="lock"
                    placeholder="Contraseña"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                />

                <Button label={loading ? "INGRESANDO..." : "INGRESAR"} loading={loading} />
                <div className="login-footer">© {new Date().getFullYear()} Stockarium System</div>
            </form>
        </div>
    );
}
