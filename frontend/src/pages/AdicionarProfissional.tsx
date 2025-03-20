import { useState, FormEvent } from "react";
import { adicionarProfissional } from "../service/profissionalService";
import { Profissional } from "../types/types";

const AdicionarProfissional = () => {
  const [nome, setNome] = useState("");
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const novoProfissional: Profissional = {
      nome,
      login,
      senha,
    };
    await adicionarProfissional(novoProfissional);
    alert("Profissional cadastrado!");
    setNome("");
    setLogin("");
    setSenha("");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg w-96"
      >
        <h2 className="text-xl font-semibold text-gray-700 text-center mb-4">
          Adicionar Profissional
        </h2>
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
          Adicionar
        </button>
      </form>
    </div>
  );
};

export default AdicionarProfissional;
