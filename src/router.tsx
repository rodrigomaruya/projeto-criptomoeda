import { createBrowserRouter } from "react-router-dom";
import { Home } from "./pages/home/home";
import { Details } from "./pages/details/details";
import { NotFound } from "./pages/notFound/notFound";
import { Layout } from "./components/layout/layout";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/details/:search",
        element: <Details />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

export { router };
