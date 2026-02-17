"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface UIContextType {
    showBreadcrumb: boolean;
    toggleBreadcrumb: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: React.ReactNode }) {
    const [showBreadcrumb, setShowBreadcrumb] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const stored = localStorage.getItem("ui_show_breadcrumb");
        if (stored !== null) {
            setShowBreadcrumb(stored === "true");
        }
    }, []);

    useEffect(() => {
        if (mounted) {
            localStorage.setItem("ui_show_breadcrumb", String(showBreadcrumb));
        }
    }, [showBreadcrumb, mounted]);

    const toggleBreadcrumb = () => {
        setShowBreadcrumb((prev) => !prev);
    };

    return (
        <UIContext.Provider value={{ showBreadcrumb, toggleBreadcrumb }}>
            {children}
        </UIContext.Provider>
    );
}

export function useUI() {
    const context = useContext(UIContext);
    if (context === undefined) {
        throw new Error("useUI must be used within a UIProvider");
    }
    return context;
}
