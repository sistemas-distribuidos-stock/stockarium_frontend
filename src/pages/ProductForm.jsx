import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IconArrowLeft } from "@tabler/icons-react";
import { useAuth } from "../context/AuthContext";

export default function ProductForm() {
    const { id } = useParams();
    const isNew = id === "new";
    const { token } = useAuth();
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL;

    const [form, setForm] = useState({
        sku: "",
        name: "",
        description: "",
        category: "",
        price: "",
        minStock: 10,
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (isNew) {
            setLoading(false);
            return;
        }

        async function load() {
            const res = await fetch(`${API_URL}/api/products/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setForm(data);
            setLoading(false);
        }

        load();
    }, [id]);

    async function save(e) {
        e.preventDefault();
        setSaving(true);
        try {
            const method = isNew ? "POST" : "PUT";
            const url = isNew ? `${API_URL}/api/products` : `${API_URL}/api/products/${id}`;
            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(form),
            });
            if (!res.ok) throw new Error("Error al guardar producto");
            alert(isNew ? "Producto creado ✔" : "Producto actualizado ✔");
            navigate("/products");
        } catch (err) {
            console.error(err);
            alert("No se pudo guardar el producto");
        } finally {
            setSaving(false);
        }
    }

    if (loading) return <div className="p-6 text-sm text-gray-500">Cargando...</div>;

    return (
        <div className="p-6 bg-[#fdf8f3] rounded-xl shadow-sm border border-[#e6d7c3] max-w-xl">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold text-[#8b3a3a]">
                    {isNew ? "Nuevo producto" : "Editar producto"}
                </h1>
                <button
                    onClick={() => navigate("/products")}
                    className="flex items-center gap-1 bg-[#d9c9b4] text-[#4b3a2a] font-semibold text-sm px-3 py-2 rounded-md hover:opacity-90"
                >
                    <IconArrowLeft size={14} /> Volver
                </button>
            </div>

            <form onSubmit={save} className="flex flex-col gap-3">
                <input
                    value={form.sku}
                    onChange={(e) => setForm({ ...form, sku: e.target.value })}
                    placeholder="Código SKU"
                    required
                    className="border border-[#e6d7c3] rounded-md p-2 bg-white"
                />
                <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Nombre del producto"
                    required
                    className="border border-[#e6d7c3] rounded-md p-2 bg-white"
                />
                <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Descripción"
                    className="border border-[#e6d7c3] rounded-md p-2 bg-white"
                />
                <input
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    placeholder="Categoría"
                    className="border border-[#e6d7c3] rounded-md p-2 bg-white"
                />
                <input
                    type="number"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) })}
                    placeholder="Precio"
                    required
                    className="border border-[#e6d7c3] rounded-md p-2 bg-white"
                />
                <input
                    type="number"
                    value={form.minStock}
                    onChange={(e) => setForm({ ...form, minStock: parseInt(e.target.value) })}
                    placeholder="Stock mínimo"
                    className="border border-[#e6d7c3] rounded-md p-2 bg-white"
                />

                <div className="flex gap-3 mt-4">
                    <button
                        type="button"
                        onClick={() => navigate("/products")}
                        className="bg-[#d9c9b4] text-[#4b3a2a] px-4 py-2 rounded-md font-semibold hover:opacity-90"
                    >
                        Cancelar
                    </button>
                    <button
                        disabled={saving}
                        className="bg-[#a12b2b] text-white px-4 py-2 rounded-md font-bold hover:bg-[#8f2020]"
                    >
                        {saving ? "Guardando..." : "Guardar"}
                    </button>
                </div>
            </form>
        </div>
    );
}
