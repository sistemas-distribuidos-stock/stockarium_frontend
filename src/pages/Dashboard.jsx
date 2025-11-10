import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
    const { logout } = useAuth();

    return (
        <div className="dashboard">
            <Navbar onLogout={logout} />
            <div className="dashboard-body">
                <Sidebar />
                <main className="dashboard-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
