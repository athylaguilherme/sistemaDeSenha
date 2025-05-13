import { useEffect, useState } from "react";
import {
  listarProfissionais,
  deletarProfissional,
  alterarStatusProfissional,
} from "../service/profissionalService";
import { Profissional } from "../types/types";
import { Link, useNavigate } from "react-router-dom";

const Profissionais = () => {
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    carregarProfissionais();
  }, []);

  function carregarProfissionais() {
    setIsLoading(true);
    listarProfissionais()
      .then(setProfissionais)
      .catch((err) => console.error("Erro ao buscar profissionais:", err))
      .finally(() => setIsLoading(false));
  }

  function handleDelete(idProfissional: number) {
    if (!window.confirm("Tem certeza que deseja apagar este profissional?"))
      return;

    deletarProfissional(idProfissional)
      .then(() => {
        setProfissionais((prev) =>
          prev.filter((p) => p.idProfissional !== idProfissional)
        );
      })
      .catch((err) => alert("Erro ao deletar profissional: " + err));
  }

  function handleAlterarStatus(idProfissional: number) {
    alterarStatusProfissional(idProfissional)
      .then(() => {
        setProfissionais((prev) =>
          prev.map((p) =>
            p.idProfissional === idProfissional
              ? {
                  ...p,
                  status: {
                    idStatus: p.status?.idStatus || 0,
                    status:
                      p.status?.status === "Ativo" ? "Desativado" : "Ativo",
                  },
                }
              : p
          )
        );
      })
      .catch((err) => alert("Erro ao alterar status: " + err));
  }

  function voltarParaHome() {
    navigate("/home");
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Cabeçalho Azul */}
        <div className="bg-blue-500 text-white py-4 px-6 rounded-t-lg shadow-md flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">Clínica Bem Estar</h1>
            <p className="text-sm text-blue-100 mt-1">Gerenciamento de Profissionais</p>
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
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Lista de Profissionais</h2>
            <Link 
              to="/adicionar" 
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm font-medium transition duration-200"
            >
              Adicionar Profissional
            </Link>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center my-8">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
            </div>
          ) : profissionais.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Nenhum profissional encontrado
            </div>
          ) : (
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nome
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {profissionais.map((p) => (
                    <tr key={p.idProfissional} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{p.nome}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          p.status?.status === "Ativo" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-red-100 text-red-800"
                        }`}>
                          {p.status?.status || "Sem status"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => p.idProfissional && handleAlterarStatus(p.idProfissional)}
                            className={`px-3 py-1 rounded text-xs font-medium ${
                              p.status?.status === "Ativo"
                                ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                                : "bg-green-100 text-green-700 hover:bg-green-200"
                            }`}
                          >
                            {p.status?.status === "Ativo" ? "Desativar" : "Ativar"}
                          </button>
                          <Link 
                            to={`/alterarProfissional/${p.idProfissional}`}
                            className="px-3 py-1 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded text-xs font-medium"
                          >
                            Editar
                          </Link>
                          <button
                            onClick={() => p.idProfissional && handleDelete(p.idProfissional)}
                            className="px-3 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded text-xs font-medium"
                          >
                            Apagar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profissionais;





















// import { useEffect, useState } from "react";
// import {
//   listarProfissionais,
//   deletarProfissional,
//   alterarStatusProfissional,
// } from "../service/profissionalService";
// import { Profissional } from "../types/types";
// import { Link } from "react-router-dom";

// const Profissionais = () => {
//   const [profissionais, setProfissionais] = useState<Profissional[]>([]);

//   useEffect(() => {
//     carregarProfissionais();
//   }, []);

//   function carregarProfissionais() {
//     listarProfissionais()
//       .then(setProfissionais)
//       .catch((err) => console.error("Erro ao buscar profissionais:", err));
//   }

//   function handleDelete(idProfissional: number) {
//     if (!window.confirm("Tem certeza que deseja apagar este profissional?"))
//       return;

//     deletarProfissional(idProfissional)
//       .then(() => {
//         alert("Profissional deletado com sucesso!");
//         setProfissionais((prev) =>
//           prev.filter((p) => p.idProfissional !== idProfissional)
//         );
//       })
//       .catch((err) => alert("Erro ao deletar profissional: " + err));
//   }

//   function handleAlterarStatus(idProfissional: number) {
//     alterarStatusProfissional(idProfissional)
//       .then(() => {
//         setProfissionais((prev) =>
//           prev.map((p) =>
//             p.idProfissional === idProfissional
//               ? {
//                   ...p,
//                   status: {
//                     idStatus: p.status?.idStatus || 0,
//                     status:
//                       p.status?.status === "Ativo" ? "Desativado" : "Ativo",
//                   },
//                 }
//               : p
//           )
//         );
//       })
//       .catch((err) => alert("Erro ao alterar status: " + err));
//   }

//   return (
//     <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
//       <h1 className="text-2xl font-bold mb-4 text-center">
//         Lista de Profissionais
//       </h1>
//       <ul className="space-y-4">
//         {profissionais.map((p) => (
//           <li
//             key={p.idProfissional}
//             className={`p-4 flex justify-between items-center rounded-md border ${
//               p.status?.status === "Desativado"
//                 ? "bg-red-100 border-red-400 text-red-700"
//                 : "bg-green-100 border-green-400 text-green-700"
//             }`}
//           >
//             <span className="font-medium">
//               {p.nome} - {p.status ? p.status.status : "Sem status"}
//             </span>
//             <div className="flex space-x-2">
//               <button
//                 onClick={() =>
//                   p.idProfissional && handleAlterarStatus(p.idProfissional)
//                 }
//                 className={`px-4 py-2 rounded text-white ${
//                   p.status?.status === "Ativo"
//                     ? "cursor-pointer bg-yellow-500 hover:bg-yellow-700"
//                     : "cursor-pointer bg-green-500 hover:bg-green-700"
//                 }`}
//               >
//                 {p.status?.status === "Ativo" ? "Desativar" : "Ativar"}
//               </button>
//               <button
//                 onClick={() =>
//                   p.idProfissional && handleDelete(p.idProfissional)
//                 }
//                 className="cursor-pointer px-4 py-2 bg-red-500 hover:bg-red-700 text-white rounded"
//               >
//                 Apagar
//               </button>
//               <button className="cursor-pointer px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded">
//                 <Link to={`/alterarProfissional/${p.idProfissional}`}>
//                   Alterar
//                 </Link>
//               </button>
//             </div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default Profissionais;
