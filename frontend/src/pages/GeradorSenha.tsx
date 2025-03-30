import { useState } from "react";
import { adicionarSenha } from "../service/senhaService";
import { Senha } from "../types/types";

export function GeradorSenha() {
  const [contadorPreferencial, setContadorPreferencial] = useState(1);
  const [contadorNormal, setContadorNormal] = useState(1);
  const [senha, setSenha] = useState("");
  const [tipoSenha, setTipoSenha] = useState("");

  const handleSubmit = async () => {
    if (!tipoSenha) {
      alert("Por favor, selecione um tipo de senha.");
      return;
    }

    let novaSenha = "";
    if (tipoSenha === "preferencial") {
      novaSenha = `P${String(contadorPreferencial).padStart(3, "0")}`;
      setContadorPreferencial((prev) => prev + 1);
    } else {
      novaSenha = `N${String(contadorNormal).padStart(3, "0")}`;
      setContadorNormal((prev) => prev + 1);
    }

    setSenha(novaSenha);

    const novoProfissional: Senha = {
      senha: novaSenha,
      tipoSenha: tipoSenha,
      dtEmissao: new Date().toISOString(),
    };

    await adicionarSenha(novoProfissional);
  };

  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-xl w-96 mx-auto mt-10 border border-gray-300">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">
        Clínica Bem Estar
      </h2>
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setTipoSenha("preferencial")}
          className={`px-6 py-2 rounded-full text-white font-semibold transition duration-300 ${
            tipoSenha === "preferencial"
              ? "bg-blue-700 shadow-lg scale-105"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          Preferencial
        </button>
        <button
          onClick={() => setTipoSenha("normal")}
          className={`px-6 py-2 rounded-full text-white font-semibold transition duration-300 ${
            tipoSenha === "normal"
              ? "bg-blue-700 shadow-lg scale-105"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          Comum
        </button>
      </div>
      <button
        onClick={handleSubmit}
        className="bg-green-500 text-white font-semibold py-2 px-8 rounded-lg hover:bg-green-600 transition duration-300 shadow-md hover:shadow-lg"
      >
        Gerar Senha
      </button>
      {senha && (
        <div className="mt-6 p-6 bg-blue-100 rounded-xl w-full text-center border border-blue-300 shadow-md">
          <p className="text-blue-700 text-xl font-bold">Senha: {senha}</p>
          <p className="text-gray-700 text-lg">
            Tipo: {tipoSenha.charAt(0).toUpperCase() + tipoSenha.slice(1)}
          </p>
        </div>
      )}
    </div>
  );
}
