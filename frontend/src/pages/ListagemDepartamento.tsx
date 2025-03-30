import { useEffect, useState } from "react";
import {
  listarDepartamentos,
  deletarDepartamento,
  alterarDepartamento,
} from "../service/departamentoService";
import { Departamento } from "../types/types";
import { Link } from "react-router-dom";

export function ListagemDepartamento() {
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);

  useEffect(() => {
    carregarDepartamentos();
  }, []);

  function carregarDepartamentos() {
    listarDepartamentos()
      .then(setDepartamentos)
      .catch((err) => console.error("Erro ao buscar departamentos:", err));
  }

  function handleDelete(idDepartamento: number) {
    deletarDepartamento(idDepartamento)
      .then(() => {
        alert("Departamento deletado com sucesso!");
        setDepartamentos((prev) =>
          prev.filter((d) => d.idDepartamento !== idDepartamento)
        );
      })
      .catch((err) => alert("Erro ao deletar departamento: " + err));
  }

  function handleAlterarStatus(idDepartamento: number) {
    alterarDepartamento(idDepartamento)
      .then(() => {
        setDepartamentos((prev) =>
          prev.map((p) =>
            p.idDepartamento === idDepartamento
              ? {
                  ...p,
                  status: {
                    idStatus: p.status?.idStatus || 0,
                    status:
                      p.status?.status === "Ativo" ? "Desativado" : "Ativo",
                  },
                }
              : p
          )
        );
      })
      .catch((err) => alert("Erro ao alterar status: " + err));
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Lista de Departamentos
      </h1>
      <ul className="space-y-4">
        {departamentos.map((d) => (
          <li
            key={d.idDepartamento}
            className={`p-4 flex justify-between items-center rounded-md border ${
              d.status?.status === "Desativado"
                ? "bg-red-100 border-red-400 text-red-700"
                : "bg-green-100 border-green-400 text-green-700"
            }`}
          >
            <span className="font-medium">
              {d.departamento} - {d.status ? d.status.status : "Sem status"}
            </span>
            <div className="flex space-x-2">
              <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded">
                <Link to={`/alterarDepartamento/${d.idDepartamento}`}>
                  Alterar
                </Link>
              </button>
              <button
                onClick={() =>
                  d.idDepartamento && handleAlterarStatus(d.idDepartamento)
                }
                className={`px-4 py-2 rounded text-white ${
                  d.status?.status === "Ativo"
                    ? "bg-yellow-500 hover:bg-yellow-600"
                    : "bg-green-500 hover:bg-green-600"
                }`}
              >
                {d.status?.status === "Ativo" ? "Desativar" : "Ativar"}
              </button>
              <button
                onClick={() =>
                  d.idDepartamento && handleDelete(d.idDepartamento)
                }
                className="cursor-pointer px-4 py-2 bg-red-500 hover:bg-red-700 text-white rounded"
              >
                Apagar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
