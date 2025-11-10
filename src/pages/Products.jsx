import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IconEdit, IconTrash, IconPlus } from "@tabler/icons-react";
import { useAuth } from "../context/AuthContext";

export default function Products() {
    const { token } = useAuth();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const API_URL = import.meta.env.VITE_API_URL;

    async function load() {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/products`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Error al cargar productos");
            const data = await res.json();
            setItems(data);
        } catch (e) {
            console.error("Error cargando productos:", e);
        } finally {
            setLoading(false);
        }
    }

    async function remove(id) {
        if (!confirm("¿Eliminar producto?")) return;
        await fetch(`${API_URL}/api/products/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });
        await load();
    }

    useEffect(() => {
        load();
    }, []);

    return (
        <div
            className="p-6 bg-[#fdf8f3] rounded-xl shadow-sm border border-[#e6d7c3]"
            style={{ minHeight: "85vh" }}
        >
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold text-[#8b3a3a]">Productos</h1>

                <Link
                    to="/products/new"
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        backgroundColor: "#a12b2b",
                        color: "white",
                        textDecoration: "none",
                        fontWeight: 600,
                        fontSize: "15px",
                        padding: "10px 16px",
                        borderRadius: "8px",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                        transition: "background-color 0.2s ease, transform 0.1s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#8f2020")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#a12b2b")}
                >
                    <IconPlus size={18} />
                    Nuevo producto
                </Link>
            </div>

            {loading ? (
                <div className="text-sm text-gray-500">Cargando...</div>
            ) : items.length === 0 ? (
                <div className="text-sm text-gray-500">No hay productos aún.</div>
            ) : (
                <div
                    className="overflow-auto bg-white rounded-xl shadow-sm"
                    style={{
                        border: "1px solid #e2d5c3",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                    }}
                >
                    <table
                        className="w-full text-sm"
                        style={{
                            borderCollapse: "separate",
                            borderSpacing: 0,
                            width: "100%",
                        }}
                    >
                        <thead>
                        <tr
                            style={{
                                background: "#f2e6d4",
                                color: "#5b3a29",
                                textAlign: "left",
                                borderBottom: "2px solid #d9c9b4",
                            }}
                        >
                            <th style={{ padding: "10px 14px" }}>SKU</th>
                            <th style={{ padding: "10px 14px" }}>Nombre</th>
                            <th style={{ padding: "10px 14px" }}>Descripción</th>
                            <th style={{ padding: "10px 14px" }}>Categoría</th>
                            <th style={{ padding: "10px 14px" }}>Precio</th>
                            <th style={{ padding: "10px 14px" }}>Stock mínimo</th>
                            <th style={{ padding: "10px 14px" }}>Acciones</th>
                        </tr>
                        </thead>

                        <tbody>
                        {items.map((p, i) => (
                            <tr
                                key={p.id}
                                style={{
                                    background: i % 2 === 0 ? "#fff" : "#faf6f1",
                                    borderBottom: "1px solid #e6d7c3",
                                }}
                            >
                                <td style={{ padding: "10px 14px" }}>{p.sku}</td>
                                <td style={{ padding: "10px 14px" }}>{p.name}</td>
                                <td style={{ padding: "10px 14px" }}>{p.description || "-"}</td>
                                <td style={{ padding: "10px 14px" }}>{p.category || "-"}</td>
                                <td style={{ padding: "10px 14px" }}>
                                    ${Number(p.price).toFixed(2)}
                                </td>
                                <td
                                    style={{
                                        padding: "10px 14px",
                                        color:
                                            p.minStock < 5
                                                ? "#a12b2b"
                                                : "#5b3a29",
                                        fontWeight: p.minStock < 5 ? "600" : "400",
                                    }}
                                >
                                    {p.minStock}
                                </td>
                                <td style={{ textAlign: "center", padding: "10px 14px" }}>
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "center",
                                            gap: "10px",
                                        }}
                                    >
                                        <Link
                                            to={`/products/${p.id}`}
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "6px",
                                                background: "#b07a4a",
                                                color: "#fff",
                                                padding: "6px 12px",
                                                borderRadius: "6px",
                                                fontWeight: 500,
                                                fontSize: "14px",
                                                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                                            }}
                                        >
                                            <IconEdit size={15} /> Editar
                                        </Link>
                                        <button
                                            onClick={() => remove(p.id)}
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "6px",
                                                background: "#a12b2b",
                                                color: "#fff",
                                                padding: "6px 12px",
                                                borderRadius: "6px",
                                                fontWeight: 500,
                                                fontSize: "14px",
                                                border: "none",
                                                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                                                cursor: "pointer",
                                            }}
                                        >
                                            <IconTrash size={15} /> Eliminar
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
