import { RouterProvider } from "react-router-dom";
import { router } from "./router";

export { RouterProvider } from "react-router-dom";

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
