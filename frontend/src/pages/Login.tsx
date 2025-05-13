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
      navigate("/home");
    } catch (error) {
      setErro("Erro: " + (error as string));
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        {/* Cabeçalho Azul */}
        <div className="bg-blue-500 text-white py-6 px-8 rounded-t-lg shadow-md">
          <h1 className="text-xl font-bold">Clínica Bem Estar</h1>
          <p className="text-sm mt-1 text-blue-100">Sistema de gerenciamento de senha</p>
        </div>
        
        {/* Formulário */}
        <div className="bg-white p-8 rounded-b-lg shadow-md">
          {erro && <p className="text-red-500 text-center mb-4 p-2 bg-red-50 rounded">{erro}</p>}
          <form onSubmit={handleLogin} className="flex flex-col space-y-5">
            <div className="space-y-2">
              <label htmlFor="usuario" className="block text-sm font-medium text-gray-700">
                Nome de usuário
              </label>
              <input
                id="usuario"
                type="text"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-100"
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
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-100"
              />
            </div>
            
            <button
              type="submit"
              className="w-full p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-md font-medium transition duration-200 mt-4"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}























// import { useState, FormEvent } from "react";
// import { autenticarProfissional } from "../service/profissionalService";
// import { useNavigate } from "react-router-dom";

// export function Login() {
//   const [login, setLogin] = useState("");
//   const [senha, setSenha] = useState("");
//   const [erro, setErro] = useState("");
//   const navigate = useNavigate();

//   async function handleLogin(e: FormEvent) {
//     e.preventDefault();

//     try {
//       await autenticarProfissional(login, senha);
//       alert("Login realizado com sucesso!");
//       navigate("/home");
//     } catch (error) {
//       setErro("Erro: " + (error as string));
//     }
//   }

//   return (
//     <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
//       <h1 className="text-2xl font-bold mb-4 text-center">novo Login</h1>
//       {erro && <p className="text-red-500 text-center mb-4">{erro}</p>}
//       <form onSubmit={handleLogin} className="flex flex-col space-y-4">
//         <input
//           type="text"
//           placeholder="Login"
//           value={login}
//           onChange={(e) => setLogin(e.target.value)}
//           className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//         />
//         <input
//           type="password"
//           placeholder="Senha"
//           value={senha}
//           onChange={(e) => setSenha(e.target.value)}
//           className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//         />
//         <button
//           type="submit"
//           className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md font-medium transition duration-200"
//         >
//           Entrar
//         </button>
//       </form>
//     </div>
//   );
// }
