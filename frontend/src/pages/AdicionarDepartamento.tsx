import { useState } from "react";
import { adicionarDepartamento } from "../service/departamentoService";
import { Departamento } from "../types/types";

export function AdicionarDepartamento() {
  const [nome, setNome] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const novoDepartamento: Departamento = {
      departamento: nome,
    };
    await adicionarDepartamento(novoDepartamento);
    alert("Departamento cadastrado!");
    setNome("");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg w-80"
      >
        <h2 className="text-xl font-semibold text-gray-700 text-center mb-4">
          Adicionar Departamento
        </h2>
        <input
          type="text"
          placeholder="Nome do Departamento"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="w-full mt-4 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Adicionar
        </button>
      </form>
    </div>
  );
}
