import { useEffect, useState } from "react";
import { IconBell } from "@tabler/icons-react";
import { useAuth } from "../context/AuthContext";

export default function Stock() {
    const { token } = useAuth();
    const [products, setProducts] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const API_URL = import.meta.env.VITE_API_URL;

    // 🔹 Cargar productos y stock actual
    async function loadProducts() {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/products`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Error al cargar productos");
            const data = await res.json();

            const withStock = await Promise.all(
                data.map(async (p) => {
                    try {
                        const stockRes = await fetch(`${API_URL}/api/stock/${p.id}`, {
                            headers: { Authorization: `Bearer ${token}` },
                        });
                        if (!stockRes.ok) return { ...p, quantity: 0 };
                        const stock = await stockRes.json();
                        return {
                            ...p,
                            quantity: stock.quantity || 0,
                            lastUpdated: stock.lastUpdated || null,
                            tempChange: "", // valor temporal para input
                        };
                    } catch {
                        return { ...p, quantity: 0, lastUpdated: null, tempChange: "" };
                    }
                })
            );

            setProducts(withStock);
        } catch (err) {
            console.error("❌ Error cargando productos/stock:", err);
        } finally {
            setLoading(false);
        }
    }

    // 🔹 Cargar alertas activas
    async function loadAlerts() {
        try {
            const res = await fetch(`${API_URL}/api/alerts`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                setAlerts(data);
            }
        } catch (err) {
            console.error("❌ Error cargando alertas:", err);
        }
    }

    // 🔹 Ajustar stock
    async function adjustStock(productId, change, reason) {
        if (!change || isNaN(change)) return;
        try {
            await fetch(`${API_URL}/api/stock/adjust`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ productId, change, reason }),
            });
            await loadProducts();
            await loadAlerts();
        } catch (err) {
            console.error("❌ Error ajustando stock:", err);
        }
    }

    useEffect(() => {
        loadProducts();
        loadAlerts();
    }, []);

    return (
        <div className="p-6 bg-[#fdf8f3] rounded-xl shadow-sm border border-[#e6d7c3]">
            <h1 className="text-2xl font-semibold text-[#8b3a3a] mb-6">Gestión de Stock</h1>

            {/* === SECCIÓN STOCK === */}
            {loading ? (
                <div className="text-sm text-gray-500">Cargando productos...</div>
            ) : (
                <div
                    className="overflow-auto bg-white rounded-xl shadow-sm mb-10"
                    style={{ border: "1px solid #e2d5c3" }}
                >
                    <table className="w-full text-sm">
                        <thead className="bg-[#f2e6d4] text-[#5b3a29]">
                        <tr>
                            <th className="p-3 text-left">SKU</th>
                            <th className="p-3 text-left">Producto</th>
                            <th className="p-3 text-left">Stock actual</th>
                            <th className="p-3 text-left">Stock mínimo</th>
                            <th className="p-3 text-left">Última actualización</th>
                            <th className="p-3 text-left">Ajustar</th>
                        </tr>
                        </thead>
                        <tbody>
                        {products.map((p, i) => (
                            <tr
                                key={p.id}
                                className={
                                    p.quantity <= p.minStock
                                        ? "bg-[#fff1f1] border-t border-[#e6d7c3]"
                                        : i % 2 === 0
                                            ? "bg-white border-t border-[#e6d7c3]"
                                            : "bg-[#faf6f1] border-t border-[#e6d7c3]"
                                }
                            >
                                <td className="p-3">{p.sku}</td>
                                <td className="p-3">{p.name}</td>
                                <td
                                    className={`p-3 font-semibold ${
                                        p.quantity <= p.minStock
                                            ? "text-[#a12b2b]"
                                            : "text-[#4b3a2a]"
                                    }`}
                                >
                                    {p.quantity}
                                </td>
                                <td className="p-3">{p.minStock}</td>
                                <td className="p-3 text-gray-600">
                                    {p.lastUpdated
                                        ? new Date(p.lastUpdated).toLocaleString("es-UY")
                                        : "—"}
                                </td>
                                <td className="p-3">
                                    <div className="flex gap-2 items-center">
                                        <input
                                            type="number"
                                            value={p.tempChange}
                                            onChange={(e) => {
                                                const updated = products.map((prod) =>
                                                    prod.id === p.id
                                                        ? { ...prod, tempChange: e.target.value }
                                                        : prod
                                                );
                                                setProducts(updated);
                                            }}
                                            placeholder="0"
                                            className="border border-[#d5c4a1] rounded px-2 py-1 w-16 text-center"
                                        />
                                        <button
                                            onClick={() => {
                                                const val = parseInt(p.tempChange);
                                                if (isNaN(val) || val === 0) return;
                                                adjustStock(
                                                    p.id,
                                                    val,
                                                    val > 0
                                                        ? "Reposición manual"
                                                        : "Venta o consumo"
                                                );
                                                const updated = products.map((prod) =>
                                                    prod.id === p.id
                                                        ? { ...prod, tempChange: "" }
                                                        : prod
                                                );
                                                setProducts(updated);
                                            }}
                                            className="bg-[#8b3a3a] text-white px-3 py-1 rounded hover:opacity-90"
                                        >
                                            Aplicar
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* === SECCIÓN ALERTAS === */}
            <div>
                <h2 className="text-xl font-semibold text-[#8b3a3a] mb-4 flex items-center gap-2">
                    <IconBell size={20} /> Alertas de Stock Bajo
                </h2>

                {alerts.length === 0 ? (
                    <p className="text-sm text-gray-500">No hay alertas activas.</p>
                ) : (
                    <div className="bg-white rounded-xl border border-[#e6d7c3] shadow-sm">
                        <table className="w-full text-sm">
                            <thead className="bg-[#f2e6d4] text-[#5b3a29]">
                            <tr>
                                <th className="p-3 text-left">Producto</th>
                                <th className="p-3 text-left">Mensaje</th>
                                <th className="p-3 text-left">Fecha</th>
                                <th className="p-3 text-left">Acciones</th>
                            </tr>
                            </thead>
                            <tbody>
                            {alerts.map((a) => {
                                const product = products.find(
                                    (p) => p.id === a.productId
                                );
                                return (
                                    <tr
                                        key={a.id}
                                        className="border-t border-[#e6d7c3] bg-[#fff8f8]"
                                    >
                                        <td className="p-3 font-medium text-[#a12b2b]">
                                            {product ? product.name : `ID ${a.productId}`}
                                        </td>
                                        <td className="p-3">{a.message}</td>
                                        <td className="p-3 text-sm text-gray-500">
                                            {new Date(a.timestamp).toLocaleString("es-UY")}
                                        </td>
                                        <td className="p-3 text-gray-400 italic">Automática</td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
