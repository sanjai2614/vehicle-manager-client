import { RouterProvider } from "react-router-dom";
import router from "./routes/router";
import ToastProvider from "./providers/ToastProvider";

const App = () => {
  return (
    <>
      <ToastProvider />
      <RouterProvider router={router} />
    </>
  );
};

export default App;
