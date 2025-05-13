import { useState, useEffect } from "react";
import { adicionarSenha } from "../service/senhaService";
import { Senha } from "../types/types";
import { useNavigate } from "react-router-dom";

export function GeradorSenha() {
  const [contadorPreferencial, setContadorPreferencial] = useState(1);
  const [contadorNormal, setContadorNormal] = useState(1);
  const [senha, setSenha] = useState("");
  const [tipoSenha, setTipoSenha] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  // Reset da mensagem de sucesso após alguns segundos
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  const handleSubmit = async () => {
    if (!tipoSenha) {
      alert("Por favor, selecione um tipo de senha.");
      return;
    }

    setIsGenerating(true);
    
    try {
      let novaSenha = "";
      if (tipoSenha === "preferencial") {
        novaSenha = `P${String(contadorPreferencial).padStart(3, "0")}`;
        setContadorPreferencial((prev) => prev + 1);
      } else {
        novaSenha = `N${String(contadorNormal).padStart(3, "0")}`;
        setContadorNormal((prev) => prev + 1);
      }

      setSenha(novaSenha);

      const novaSenhaObj: Senha = {
        senha: novaSenha,
        tipoSenha: tipoSenha,
        dtEmissao: new Date().toISOString(),
      };

      await adicionarSenha(novaSenhaObj);
      setShowSuccess(true);
    } catch (error) {
      console.error("Erro ao gerar senha:", error);
      alert("Erro ao gerar senha. Tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  function voltarParaHome() {
    navigate("/home");
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-md mx-auto">
        {/* Cabeçalho Azul */}
        <div className="bg-blue-500 text-white py-4 px-6 rounded-t-lg shadow-md flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">Clínica Bem Estar</h1>
            <p className="text-sm text-blue-100 mt-1">Gerador de Senhas</p>
          </div>
          <button
            onClick={voltarParaHome}
            className="px-4 py-2 bg-white text-blue-500 hover:bg-blue-50 rounded-md text-sm font-medium transition duration-200 shadow"
          >
            Voltar para Home
          </button>
        </div>
        
        {/* Conteúdo */}
        <div className="bg-white p-6 rounded-b-lg shadow-md">
          <div className="text-center mb-8">
            <h2 className="text-xl font-semibold text-gray-800">Emissão de Nova Senha</h2>
            <p className="text-gray-500 text-sm mt-1">Selecione o tipo de atendimento e gere a senha</p>
          </div>
          
          {showSuccess && (
            <div className="mb-6 p-3 bg-green-50 border border-green-200 text-green-600 rounded-md text-sm text-center">
              Senha gerada com sucesso!
            </div>
          )}
          
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => setTipoSenha("preferencial")}
              className={`px-8 py-3 rounded-lg font-medium transition duration-300 text-base ${
                tipoSenha === "preferencial"
                  ? "bg-blue-600 text-white shadow-lg scale-105"
                  : "bg-blue-100 text-blue-700 hover:bg-blue-200"
              }`}
            >
              Preferencial
            </button>
            <button
              onClick={() => setTipoSenha("normal")}
              className={`px-8 py-3 rounded-lg font-medium transition duration-300 text-base ${
                tipoSenha === "normal"
                  ? "bg-blue-600 text-white shadow-lg scale-105"
                  : "bg-blue-100 text-blue-700 hover:bg-blue-200"
              }`}
            >
              Comum
            </button>
          </div>
          
          <div className="flex justify-center mb-8">
            <button
              onClick={handleSubmit}
              disabled={!tipoSenha || isGenerating}
              className={`bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-8 rounded-lg transition duration-300 shadow-md flex items-center ${
                !tipoSenha || isGenerating ? 'opacity-60 cursor-not-allowed' : ''
              }`}
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Gerando...
                </>
              ) : (
                'Gerar Senha'
              )}
            </button>
          </div>
          
          {senha && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
              <div className="flex justify-center items-center mb-4">
                <div className="bg-white p-4 rounded-lg shadow-inner border border-blue-100 min-w-32">
                  <h3 className="text-3xl font-bold text-blue-700">{senha}</h3>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <p>Tipo: <span className="font-medium">{tipoSenha === "preferencial" ? "Preferencial" : "Comum"}</span></p>
                <p>Emitido em: <span className="font-medium">{new Date().toLocaleTimeString()}</span></p>
              </div>
            </div>
          )}
          
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              As senhas são processadas por ordem de prioridade. Senhas preferenciais têm atendimento prioritário.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}



// import { useState } from "react";
// import { adicionarSenha } from "../service/senhaService";
// import { Senha } from "../types/types";

// export function GeradorSenha() {
//   const [contadorPreferencial, setContadorPreferencial] = useState(1);
//   const [contadorNormal, setContadorNormal] = useState(1);
//   const [senha, setSenha] = useState("");
//   const [tipoSenha, setTipoSenha] = useState("");

//   const handleSubmit = async () => {
//     if (!tipoSenha) {
//       alert("Por favor, selecione um tipo de senha.");
//       return;
//     }

//     let novaSenha = "";
//     if (tipoSenha === "preferencial") {
//       novaSenha = `P${String(contadorPreferencial).padStart(3, "0")}`;
//       setContadorPreferencial((prev) => prev + 1);
//     } else {
//       novaSenha = `N${String(contadorNormal).padStart(3, "0")}`;
//       setContadorNormal((prev) => prev + 1);
//     }

//     setSenha(novaSenha);

//     const novoProfissional: Senha = {
//       senha: novaSenha,
//       tipoSenha: tipoSenha,
//       dtEmissao: new Date().toISOString(),
//     };

//     await adicionarSenha(novoProfissional);
//   };

//   return (
//     <div className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-xl w-96 mx-auto mt-10 border border-gray-300">
//       <h2 className="text-2xl font-bold text-blue-700 mb-4">
//         Clínica Bem Estar
//       </h2>
//       <div className="flex gap-4 mb-6">
//         <button
//           onClick={() => setTipoSenha("preferencial")}
//           className={`px-6 py-2 rounded-full text-white font-semibold transition duration-300 ${
//             tipoSenha === "preferencial"
//               ? "bg-blue-700 shadow-lg scale-105"
//               : "bg-blue-500 hover:bg-blue-600"
//           }`}
//         >
//           Preferencial
//         </button>
//         <button
//           onClick={() => setTipoSenha("normal")}
//           className={`px-6 py-2 rounded-full text-white font-semibold transition duration-300 ${
//             tipoSenha === "normal"
//               ? "bg-blue-700 shadow-lg scale-105"
//               : "bg-blue-500 hover:bg-blue-600"
//           }`}
//         >
//           Comum
//         </button>
//       </div>
//       <button
//         onClick={handleSubmit}
//         className="bg-green-500 text-white font-semibold py-2 px-8 rounded-lg hover:bg-green-600 transition duration-300 shadow-md hover:shadow-lg"
//       >
//         Gerar Senha
//       </button>
//       {senha && (
//         <div className="mt-6 p-6 bg-blue-100 rounded-xl w-full text-center border border-blue-300 shadow-md">
//           <p className="text-blue-700 text-xl font-bold">Senha: {senha}</p>
//           <p className="text-gray-700 text-lg">
//             Tipo: {tipoSenha.charAt(0).toUpperCase() + tipoSenha.slice(1)}
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }
