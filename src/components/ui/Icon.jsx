import React from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";

export default function Icon({ name, size = 16, color = "#999", className = "" }) {
    const iconMap = {
        user: "fa-regular fa-user",
        lock: "fa-solid fa-lock",
    };

    return (
        <i
            className={`${iconMap[name]} ${className}`}
            style={{ fontSize: size, color }}
        />
    );
}
