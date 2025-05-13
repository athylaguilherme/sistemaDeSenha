import { createBrowserRouter } from "react-router-dom";
import Profissionais from "./pages/Profissionais";
import AdicionarProfissional from "./pages/AdicionarProfissional";
import { Home } from "./pages/home";
import { GeradorSenha } from "./pages/GeradorSenha";
import { AdicionarDepartamento } from "./pages/AdicionarDepartamento";
import { ListagemDepartamento } from "./pages/ListagemDepartamento";
import { AlterarProfissional } from "./pages/AlterarProfissional";
import { Login } from "./pages/Login";
import { AlterarDepartamento } from "./pages/AlterarDepartamento";
import { PainelSenhas } from "./pages/PainelSenhas";
import { PainelRecepcionista } from "./pages/PainelRecepcionista";

const router = createBrowserRouter([
  {
    path: "/Home",
    element: <Home />,
  },
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/profissionais",
    element: <Profissionais />,
  },
  {
    path: "/adicionar",
    element: <AdicionarProfissional />,
  },
  {
    path: "/senha",
    element: <GeradorSenha />,
  },
  {
    path: "/departamento",
    element: <AdicionarDepartamento />,
  },
  {
    path: "/listagemDepartamento",
    element: <ListagemDepartamento />,
  },
  {
    path: "/alterarProfissional/:id",
    element: <AlterarProfissional />,
  },
  {
    path: "/alterarDepartamento/:id",
    element: <AlterarDepartamento />,
  },
  {
    path: "/painel-senhas",
    element: <PainelSenhas  />,
  },
  {
    path: "/painel-recepcionista",
    element: <PainelRecepcionista  />,
  },
  {},
]);

export { router };
