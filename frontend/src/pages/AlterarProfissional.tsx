import { useState, FormEvent } from "react";
import { useParams } from "react-router-dom";
import { alterarDadosProfissional } from "../service/profissionalService";
import { Profissional } from "../types/types";

export function AlterarProfissional() {
  const { id } = useParams<{ id: string }>();
  const [nome, setNome] = useState("");
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");

  async function handleAlter(e: FormEvent) {
    e.preventDefault();

    if (!id) {
      alert("ID do profissional não encontrado!");
      return;
    }

    const novoProfissional: Partial<Profissional> = {
      nome,
      login,
      senha,
    };

    try {
      await alterarDadosProfissional(Number(id), novoProfissional);
      alert("Dados do profissional alterados com sucesso!");
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
          Alterar Profissional
        </h2>
        <input
          type="text"
          value={id}
          disabled
          className="w-full p-2 border border-gray-300 rounded-lg bg-gray-200 cursor-not-allowed mb-2"
        />
        <input
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
        />
        <input
          type="text"
          placeholder="Login"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
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
