import React from "react";
import { NavLink } from "react-router-dom";
import { IconHome, IconBox, IconPackages } from "@tabler/icons-react";

export default function Sidebar() {
    const links = [
        { to: "/", label: "Inicio", icon: <IconHome size={18} /> },
        { to: "/products", label: "Productos", icon: <IconBox size={18} /> },
        { to: "/stock", label: "Stock", icon: <IconPackages size={18} /> },
    ];

    return (
        <aside className="sidebar">
            <nav className="sidebar-nav">
                {links.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        end
                        className={({ isActive }) =>
                            `sidebar-item ${isActive ? "active" : ""}`
                        }
                    >
                        <span className="sidebar-icon">{link.icon}</span>
                        <span className="sidebar-label">{link.label}</span>
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
}
