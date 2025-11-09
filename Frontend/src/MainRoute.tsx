import { createBrowserRouter } from "react-router-dom";
import notFound from "./routes/NotFoundRoute";
import { MainPage } from "./MainPage";
import dashboard from "./routes/DashboardRoute";
import access from "./routes/AccessRoute";

const routes = createBrowserRouter([
    {path: "/app", element: <MainPage />, children: [
        dashboard,
        access,
    ]},
    notFound
])

export default routes