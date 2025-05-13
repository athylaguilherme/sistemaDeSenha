import { useState } from "react";
import { adicionarDepartamento } from "../service/departamentoService";
import { Departamento } from "../types/types";
import { useNavigate } from "react-router-dom";

export function AdicionarDepartamento() {
  const [nome, setNome] = useState("");
  const [erro, setErro] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setSuccess(false);
    
    // Validação básica
    if (!nome.trim()) {
      setErro("O nome do departamento é obrigatório");
      return;
    }
    
    try {
      setIsSubmitting(true);
      const novoDepartamento: Departamento = {
        departamento: nome,
      };
      await adicionarDepartamento(novoDepartamento);
      setSuccess(true);
      setNome("");
      // Redireciona após um curto período
      setTimeout(() => {
        navigate("/departamentos");
      }, 1500);
    } catch (error) {
      setErro(`Erro ao cadastrar: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsSubmitting(false);
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
            <p className="text-sm text-blue-100 mt-1">Cadastro de Departamento</p>
          </div>
          <button
            onClick={voltarParaHome}
            className="px-4 py-2 bg-white text-blue-500 hover:bg-blue-50 rounded-md text-sm font-medium transition duration-200 shadow"
          >
            Voltar para Home
          </button>
        </div>
        
        {/* Formulário */}
        <div className="bg-white p-6 rounded-b-lg shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Adicionar Departamento</h2>
            <button
              onClick={() => navigate("/listagemDepartamento")}
              className="px-4 py-1 border border-gray-300 text-gray-600 rounded-md text-sm hover:bg-gray-50 transition duration-200"
            >
              Cancelar
            </button>
          </div>
          
          {erro && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
              {erro}
            </div>
          )}
          
          {success && (
            <div className="mb-6 p-3 bg-green-50 border border-green-200 text-green-600 rounded-md text-sm">
              Departamento cadastrado com sucesso! Redirecionando...
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="nomeDepartamento" className="block text-sm font-medium text-gray-700">
                Nome do Departamento:
              </label>
              <input
                id="nomeDepartamento"
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                placeholder="Digite o nome do departamento"
              />
              <p className="text-xs text-gray-500 mt-1">
                O nome do departamento deve ser único e descrever claramente sua função.
              </p>
            </div>
            
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-md font-medium transition duration-200 
                  ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? 'Cadastrando...' : 'Cadastrar Departamento'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}












// import { useState } from "react";
// import { adicionarDepartamento } from "../service/departamentoService";
// import { Departamento } from "../types/types";

// export function AdicionarDepartamento() {
//   const [nome, setNome] = useState("");

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const novoDepartamento: Departamento = {
//       departamento: nome,
//     };
//     await adicionarDepartamento(novoDepartamento);
//     alert("Departamento cadastrado!");
//     setNome("");
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white p-6 rounded-lg shadow-lg w-80"
//       >
//         <h2 className="text-xl font-semibold text-gray-700 text-center mb-4">
//           Adicionar Departamento
//         </h2>
//         <input
//           type="text"
//           placeholder="Nome do Departamento"
//           value={nome}
//           onChange={(e) => setNome(e.target.value)}
//           className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//         <button
//           type="submit"
//           className="w-full mt-4 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
//         >
//           Adicionar
//         </button>
//       </form>
//     </div>
//   );
// }
