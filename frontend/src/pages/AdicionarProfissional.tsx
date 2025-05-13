import { useState, FormEvent } from "react";
import { adicionarProfissional } from "../service/profissionalService";
import { Profissional } from "../types/types";
import { useNavigate } from "react-router-dom";

const AdicionarProfissional = () => {
  const [nome, setNome] = useState("");
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErro("");
    
    // Validações básicas
    if (!nome || !login || !senha) {
      setErro("Todos os campos são obrigatórios");
      return;
    }
    
    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem");
      return;
    }
    
    try {
      setIsSubmitting(true);
      const novoProfissional: Profissional = {
        nome,
        login,
        senha,
      };
      await adicionarProfissional(novoProfissional);
      setNome("");
      setLogin("");
      setSenha("");
      setConfirmarSenha("");
      // Mostra mensagem de sucesso e redireciona após um curto período
      setTimeout(() => {
        navigate("/profissionais");
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
            <p className="text-sm text-blue-100 mt-1">Cadastro de Profissional</p>
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
            <h2 className="text-xl font-semibold text-gray-800">Adicionar Profissional</h2>
            <button
              onClick={() => navigate("/profissionais")}
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
          
          {isSubmitting && (
            <div className="mb-6 p-3 bg-green-50 border border-green-200 text-green-600 rounded-md text-sm">
              Cadastrando profissional...
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
                Nome Completo:
              </label>
              <input
                id="nome"
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                placeholder="Digite o nome completo"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="login" className="block text-sm font-medium text-gray-700">
                Login:
              </label>
              <input
                id="login"
                type="text"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                placeholder="Digite o login"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="senha" className="block text-sm font-medium text-gray-700">
                Senha:
              </label>
              <input
                id="senha"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                placeholder="Digite a senha"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="confirmarSenha" className="block text-sm font-medium text-gray-700">
                Confirmar Senha:
              </label>
              <input
                id="confirmarSenha"
                type="password"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                placeholder="Confirme a senha"
              />
            </div>
            
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-md font-medium transition duration-200 
                  ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? 'Cadastrando...' : 'Cadastrar Profissional'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdicionarProfissional;











// import { useState, FormEvent } from "react";
// import { adicionarProfissional } from "../service/profissionalService";
// import { Profissional } from "../types/types";

// const AdicionarProfissional = () => {
//   const [nome, setNome] = useState("");
//   const [login, setLogin] = useState("");
//   const [senha, setSenha] = useState("");

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();
//     const novoProfissional: Profissional = {
//       nome,
//       login,
//       senha,
//     };
//     await adicionarProfissional(novoProfissional);
//     alert("Profissional cadastrado!");
//     setNome("");
//     setLogin("");
//     setSenha("");
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white p-6 rounded-lg shadow-lg w-96"
//       >
//         <h2 className="text-xl font-semibold text-gray-700 text-center mb-4">
//           Adicionar Profissional
//         </h2>
//         <input
//           type="text"
//           placeholder="Nome"
//           value={nome}
//           onChange={(e) => setNome(e.target.value)}
//           className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
//         />
//         <input
//           type="text"
//           placeholder="Login"
//           value={login}
//           onChange={(e) => setLogin(e.target.value)}
//           className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
//         />
//         <input
//           type="password"
//           placeholder="Senha"
//           value={senha}
//           onChange={(e) => setSenha(e.target.value)}
//           className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
//         />
//         <button
//           type="submit"
//           className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
//         >
//           Adicionar
//         </button>
//       </form>
//     </div>
//   );
// };

// export default AdicionarProfissional;
