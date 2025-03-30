import { useEffect, useState } from "react";
import {
  listarProfissionais,
  deletarProfissional,
  alterarStatusProfissional,
} from "../service/profissionalService";
import { Profissional } from "../types/types";
import { Link } from "react-router-dom";

const Profissionais = () => {
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);

  useEffect(() => {
    carregarProfissionais();
  }, []);

  function carregarProfissionais() {
    listarProfissionais()
      .then(setProfissionais)
      .catch((err) => console.error("Erro ao buscar profissionais:", err));
  }

  function handleDelete(idProfissional: number) {
    if (!window.confirm("Tem certeza que deseja apagar este profissional?"))
      return;

    deletarProfissional(idProfissional)
      .then(() => {
        alert("Profissional deletado com sucesso!");
        setProfissionais((prev) =>
          prev.filter((p) => p.idProfissional !== idProfissional)
        );
      })
      .catch((err) => alert("Erro ao deletar profissional: " + err));
  }

  function handleAlterarStatus(idProfissional: number) {
    alterarStatusProfissional(idProfissional)
      .then(() => {
        setProfissionais((prev) =>
          prev.map((p) =>
            p.idProfissional === idProfissional
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
        Lista de Profissionais
      </h1>
      <ul className="space-y-4">
        {profissionais.map((p) => (
          <li
            key={p.idProfissional}
            className={`p-4 flex justify-between items-center rounded-md border ${
              p.status?.status === "Desativado"
                ? "bg-red-100 border-red-400 text-red-700"
                : "bg-green-100 border-green-400 text-green-700"
            }`}
          >
            <span className="font-medium">
              {p.nome} - {p.status ? p.status.status : "Sem status"}
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() =>
                  p.idProfissional && handleAlterarStatus(p.idProfissional)
                }
                className={`px-4 py-2 rounded text-white ${
                  p.status?.status === "Ativo"
                    ? "cursor-pointer bg-yellow-500 hover:bg-yellow-700"
                    : "cursor-pointer bg-green-500 hover:bg-green-700"
                }`}
              >
                {p.status?.status === "Ativo" ? "Desativar" : "Ativar"}
              </button>
              <button
                onClick={() =>
                  p.idProfissional && handleDelete(p.idProfissional)
                }
                className="cursor-pointer px-4 py-2 bg-red-500 hover:bg-red-700 text-white rounded"
              >
                Apagar
              </button>
              <button className="cursor-pointer px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded">
                <Link to={`/alterarProfissional/${p.idProfissional}`}>
                  Alterar
                </Link>
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Profissionais;
