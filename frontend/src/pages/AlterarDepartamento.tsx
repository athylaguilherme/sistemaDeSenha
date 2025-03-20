import { useState, FormEvent } from "react";
import { useParams } from "react-router-dom";
import { alterarDadosDepartamento } from "../service/departamentoService";
import { Departamento } from "../types/types";

export function AlterarDepartamento() {
  const { id } = useParams<{ id: string }>();
  const [departamento, setDepartamento] = useState("");

  async function handleAlter(e: FormEvent) {
    e.preventDefault();

    if (!id) {
      alert("ID do departamento não encontrado!");
      return;
    }

    const novoDepartamento: Partial<Departamento> = {
      departamento,
    };

    try {
      await alterarDadosDepartamento(Number(id), novoDepartamento);
      alert("Dados do departamento alterados com sucesso!");
    } catch (error) {
      alert("Erro ao alterar os dados: " + error);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleAlter}
        className="bg-white p-6 rounded-lg shadow-lg w-96"
      >
        <h2 className="text-xl font-semibold text-gray-700 text-center mb-4">
          Alterar Departamento
        </h2>
        <input
          type="text"
          value={id}
          disabled
          className="w-full p-2 border border-gray-300 rounded-lg bg-gray-200 cursor-not-allowed mb-2"
        />
        <input
          type="text"
          placeholder="Nome do Departamento"
          value={departamento}
          onChange={(e) => setDepartamento(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Alterar
        </button>
      </form>
    </div>
  );
}
