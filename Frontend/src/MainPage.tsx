import type { JSX } from "react";
import { Outlet } from "react-router-dom";

export function MainPage(): JSX.Element {
    return (
        <div className="font-[inter]">
            <Outlet />
        </div>
    )
}