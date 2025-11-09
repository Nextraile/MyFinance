import { createBrowserRouter } from "react-router-dom";
import notFound from "./routes/NotFoundRoute";
import { MainPage } from "./MainPage";
import dashboard from "./routes/DashboardRoute";

const routes = createBrowserRouter([
    {path: "/app", element: <MainPage />, children: [
        dashboard
    ]},
    notFound
])

export default routes