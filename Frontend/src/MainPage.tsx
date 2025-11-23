import type { JSX } from "react";
import { Outlet } from "react-router-dom";

export function MainPage(): JSX.Element {
    return (
        <div className="font-[Inter] bg-background-primary min-h-screen">
            <Outlet />
        </div>
    )
}