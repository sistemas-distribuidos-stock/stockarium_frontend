import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductForm from "./pages/ProductForm";
import Stock from "./pages/Stock";

function PrivateRoute({ children }) {
    const { token, isLoading } = useAuth();

    if (isLoading) return <div>Cargando sesión...</div>;
    return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* 🔐 Login público */}
                    <Route path="/login" element={<Login />} />

                    {/* 🔒 Área protegida */}
                    <Route
                        path="/"
                        element={
                            <PrivateRoute>
                                <Dashboard />
                            </PrivateRoute>
                        }
                    >
                        <Route index element={<Home />} />
                        <Route path="products" element={<Products />} />
                        <Route path="products/:id" element={<ProductForm />} />
                        <Route path="stock" element={<Stock />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}
