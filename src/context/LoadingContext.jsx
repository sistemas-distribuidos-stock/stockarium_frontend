import React, { createContext, useContext, useState } from "react";

const LoadingContext = createContext(undefined);

export function LoadingProvider({ children }) {
    const [loading, setLoading] = useState(false);

    return (
        <LoadingContext.Provider value={{ loading, setLoading }}>
            {children}
        </LoadingContext.Provider>
    );
}

export function useLoading() {
    const context = useContext(LoadingContext);
    if (!context) throw new Error("useLoading debe usarse dentro de LoadingProvider");
    return context;
}
