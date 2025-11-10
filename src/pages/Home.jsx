export default function Home() {
    return (
        <div className="p-6 bg-[#fdf8f3] rounded-xl shadow-sm border border-[#e6d7c3]">
            <h1 className="text-2xl font-semibold text-[#8b3a3a] mb-4">
                Panel general
            </h1>
            <p className="text-[#4b3a2a]">
                Bienvenido al Panel de Control. Aquí podrás monitorear el estado de productos, stock y alertas.
            </p>

            <div className="grid grid-cols-3 gap-6 mt-8">
                <div className="bg-white border border-[#e6d7c3] rounded-xl p-4 shadow-sm">
                    <h3 className="text-[#8b3a3a] font-semibold mb-2">Stock bajo</h3>
                    <p className="text-3xl font-bold text-[#a12b2b]">3</p>
                </div>
            </div>
        </div>
    );
}
