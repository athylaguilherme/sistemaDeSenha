import { Link } from "react-router-dom";

export function Home() {
  return (
    <nav className="bg-blue-500 p-4 shadow-md">
      <ul className="flex justify-center space-x-6 text-white font-semibold">
        <li>
          <Link to="/" className="hover:underline">
            Home
          </Link>
        </li>
        <li>
          <Link to="/profissionais" className="hover:underline">
            Profissionais
          </Link>
        </li>
        <li>
          <Link to="/adicionar" className="hover:underline">
            Adicionar
          </Link>
        </li>
        <li>
          <Link to="/listagemDepartamento" className="hover:underline">
            Listagem Departamentos
          </Link>
        </li>
        <li>
          <Link to="/departamento" className="hover:underline">
            Adicionar Departamento
          </Link>
        </li>
        <li>
          <Link to="/senha" className="hover:underline">
            Gerar Senha
          </Link>
        </li>
      </ul>
    </nav>
  );
}
