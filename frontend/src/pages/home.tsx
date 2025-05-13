import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export function Home() {
  const navigate = useNavigate();
  const [currentDate] = useState(new Date().toLocaleDateString('pt-BR', {
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric'
  }));
  
  const [currentTime] = useState(new Date().toLocaleTimeString('pt-BR', {
    hour: '2-digit', 
    minute: '2-digit'
  }));

  const handleLogout = () => {
    // Aqui você pode adicionar lógica para limpar tokens de autenticação, etc.
    navigate("/"); // Assumindo que "/" é a rota para a página de login
  };

  const menuItems = [
    {
      title: "Profissionais",
      description: "Gerencie os profissionais da clínica",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      links: [
        { to: "/profissionais", text: "Listar Profissionais" },
        { to: "/adicionar", text: "Adicionar Profissional" }
      ],
      color: "bg-blue-100 text-blue-600"
    },
    {
      title: "Departamentos",
      description: "Gerencie os departamentos da clínica",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      links: [
        { to: "/listagemDepartamento", text: "Listar Departamentos" },
        { to: "/departamento", text: "Adicionar Departamento" }
      ],
      color: "bg-green-100 text-green-600"
    },
    {
      title: "Atendimento",
      description: "Gerencie o atendimento e senhas",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      links: [
        { to: "/senha", text: "Gerar Senha" }
      ],
      color: "bg-purple-100 text-purple-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Barra de navegação superior */}
      <nav className="bg-blue-500 p-4 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="text-white font-bold text-xl">Clínica Bem Estar</div>
          </div>
          <div className="flex items-center">
            <div className="text-white text-sm mr-6">
              {currentDate} | {currentTime}
            </div>
            <button
              onClick={handleLogout}
              className="bg-white text-blue-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-50 transition duration-150 shadow-sm flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sair
            </button>
          </div>
        </div>
      </nav>
      
      {/* Conteúdo principal */}
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho do painel */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Painel de Controle</h1>
          <p className="text-gray-600 mt-2">Bem-vindo ao sistema de gerenciamento da Clínica Bem Estar</p>
        </div>
        
        {/* Blocos de acesso rápido */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {menuItems.map((item, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className={`p-5 ${item.color} flex items-center`}>
                <div className="mr-4">
                  {item.icon}
                </div>
                <div>
                  <h2 className="font-bold text-lg">{item.title}</h2>
                  <p className="text-sm opacity-75">{item.description}</p>
                </div>
              </div>
              <div className="p-5 bg-white">
                <ul className="space-y-2">
                  {item.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link 
                        to={link.to}
                        className="flex items-center p-2 hover:bg-gray-50 rounded-md text-gray-700 hover:text-blue-500 transition duration-150"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        {link.text}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
        
        {/* Acesso rápido */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="p-5 bg-gray-100 border-b">
            <h2 className="font-semibold text-lg text-gray-700">Acesso Rápido</h2>
          </div>
          <div className="p-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            <Link 
              to="/senha" 
              className="flex flex-col items-center justify-center p-4 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition duration-150"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
              <span className="text-sm font-medium">Gerar Senha</span>
            </Link>
            
            <Link 
              to="/profissionais" 
              className="flex flex-col items-center justify-center p-4 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition duration-150"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span className="text-sm font-medium">Profissionais</span>
            </Link>
            
            <Link 
              to="/listagemDepartamento" 
              className="flex flex-col items-center justify-center p-4 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition duration-150"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-medium">Departamentos</span>
            </Link>
            
            <Link 
              to="/adicionar" 
              className="flex flex-col items-center justify-center p-4 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 transition duration-150"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              <span className="text-sm font-medium">Novo Profissional</span>
            </Link>

            <Link 
              to="/painel-senhas" 
              className="flex flex-col items-center justify-center p-4 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition duration-150"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span className="text-sm font-medium">Painel de Senhas</span>
            </Link>

            <Link 
              to="/painel-recepcionista" 
              className="flex flex-col items-center justify-center p-4 bg-teal-50 text-teal-600 rounded-lg hover:bg-teal-100 transition duration-150"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium">Chamar Senhas</span>
            </Link>
          </div>
        </div>
        
        {/* Rodapé */}
        <div className="text-center text-gray-500 text-sm mt-12">
          <p>Sistema de Gerenciamento da Clínica Bem Estar &copy; {new Date().getFullYear()}</p>
        </div>
      </div>
    </div>
  );
}





// import { Link } from "react-router-dom";

// export function Home() {
//   return (
//     <nav className="bg-blue-500 p-4 shadow-md">
//       <ul className="flex justify-center space-x-6 text-white font-semibold">
//         <li>
//           <Link to="/" className="hover:underline">
//             Home
//           </Link>
//         </li>
//         <li>
//           <Link to="/profissionais" className="hover:underline">
//             Profissionais
//           </Link>
//         </li>
//         <li>
//           <Link to="/adicionar" className="hover:underline">
//             Adicionar
//           </Link>
//         </li>
//         <li>
//           <Link to="/listagemDepartamento" className="hover:underline">
//             Listagem Departamentos
//           </Link>
//         </li>
//         <li>
//           <Link to="/departamento" className="hover:underline">
//             Adicionar Departamento
//           </Link>
//         </li>
//         <li>
//           <Link to="/senha" className="hover:underline">
//             Gerar Senha
//           </Link>
//         </li>
//       </ul>
//     </nav>
//   );
// }
