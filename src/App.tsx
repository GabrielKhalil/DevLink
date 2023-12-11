import { createBrowserRouter } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Home } from "./pages/home";
import { Login } from "./pages/login";
import { Admin } from "./pages/admin";
import { Networks } from "./pages/networks";
import { Cadastro } from "./pages/cadastro";
import { Private } from "./routes/Private";

const router = createBrowserRouter([
  {
    path: '/home/user/:uid',
    element: (
      <div>
        <Home />
        <ToastContainer autoClose={3000} />
      </div>
    ),
  },
  {
    path: '/',
    element: (
      <div>
        <Login />
        <ToastContainer autoClose={3000} />
      </div>
    ),
  },
  {
    path: '/admin',
    element: (
      <div>
        <Private> <Admin /> </Private>
        <ToastContainer autoClose={3000} />
      </div>
    ),
  },
  {
    path: '/admin/social',
    element: (
      <div>
        <Private> <Networks /> </Private>
        <ToastContainer autoClose={3000} />
      </div>
    ),
  },
  {
    path: '/cadastro',
    element: (
      <div>
        <Cadastro />
        <ToastContainer autoClose={3000} />
      </div>
    ),
  },
]);

export { router };
