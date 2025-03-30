import { useState, FormEvent } from "react";
import { autenticarProfissional } from "../service/profissionalService";
import { useNavigate } from "react-router-dom";

export function Login() {
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  async function handleLogin(e: FormEvent) {
    e.preventDefault();

    try {
      await autenticarProfissional(login, senha);
      alert("Login realizado com sucesso!");
      navigate("/home");
    } catch (error) {
      setErro("Erro: " + (error as string));
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>
      {erro && <p className="text-red-500 text-center mb-4">{erro}</p>}
      <form onSubmit={handleLogin} className="flex flex-col space-y-4">
        <input
          type="text"
          placeholder="Login"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md font-medium transition duration-200"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
