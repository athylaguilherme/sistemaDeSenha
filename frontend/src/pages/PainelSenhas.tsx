import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { listarSenhas } from "../service/senhaService"; // Assumo que existe esse serviço
import { Senha } from "../types/types";

export function PainelSenhas() {
  const [senhasPreferenciais, setSenhasPreferenciais] = useState<Senha[]>([]);
  const [senhasComuns, setSenhasComuns] = useState<Senha[]>([]);
  const [senhaAtual, setSenhaAtual] = useState<Senha | null>(null);
  const [guiche, setGuiche] = useState<string>("");
  const navigate = useNavigate();
  
  // Simula o recebimento de atualizações das senhas (em produção, use WebSockets)
  useEffect(() => {
    const buscarSenhas = async () => {
    try {
        const senhas = await listarSenhas();
        
        // Filtra senhas por tipo e status
        const preferenciais = senhas.filter(s => 
            s.tipoSenha === "preferencial" && s.status?.status === "Aguardando");
        const comuns = senhas.filter(s => 
            s.tipoSenha === "normal" && s.status?.status === "Aguardando");
        
        // Verifica a senha atual sendo chamada
        const chamada = senhas.find(s => s.status?.status === "Chamada");
        
        setSenhasPreferenciais(preferenciais);
        setSenhasComuns(comuns);
        
        if (chamada) {
            setSenhaAtual(chamada);
            setGuiche(chamada.guiche || "1"); // Use um valor padrão se guiche for undefined
        }
        } catch (error) {
        console.error("Erro ao buscar senhas:", error);
        }
    };
    
    // Executa imediatamente e depois a cada 5 segundos
    buscarSenhas();
    const interval = setInterval(buscarSenhas, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  function voltarParaHome() {
    navigate("/home");
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Cabeçalho */}
      <header className="bg-blue-500 text-white p-4 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Clínica Bem Estar</h1>
          <button
            onClick={voltarParaHome}
            className="px-4 py-2 bg-white text-blue-500 hover:bg-blue-50 rounded-md text-sm font-medium transition duration-200 shadow"
          >
            Voltar para Home
          </button>
        </div>
      </header>
      
      {/* Área principal */}
      <main className="max-w-7xl mx-auto py-6 px-4">
        {/* Senha sendo chamada */}
        <div className="bg-white rounded-lg shadow-lg mb-8 overflow-hidden">
          <div className="bg-blue-500 text-white p-4">
            <h2 className="text-xl font-bold text-center">Senha Atual</h2>
          </div>
          {senhaAtual ? (
            <div className="p-8 flex flex-col items-center">
              <div className="text-6xl font-bold text-blue-700 mb-4">{senhaAtual?.senha}</div>
              <div className="text-2xl text-gray-600">Guichê {guiche}</div>
              <div className="mt-4 text-sm bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full">
                Por favor, dirija-se ao guichê
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              Aguardando chamada de senha...
            </div>
          )}
        </div>
        
        {/* Grid de senhas em espera */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Senhas Preferenciais */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-green-500 text-white p-4">
              <h3 className="font-bold text-center">Senhas Preferenciais</h3>
            </div>
            <div className="p-4">
              {senhasPreferenciais.length > 0 ? (
                <div className="grid grid-cols-4 gap-3">
                  {senhasPreferenciais.map((senha, index) => (
                    <div 
                      key={index}
                      className="bg-green-50 text-green-700 border border-green-200 rounded-lg p-3 text-center font-bold"
                    >
                      {senha.senha}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  Não há senhas preferenciais em espera
                </div>
              )}
            </div>
          </div>
          
          {/* Senhas Comuns */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-blue-500 text-white p-4">
              <h3 className="font-bold text-center">Senhas Comuns</h3>
            </div>
            <div className="p-4">
              {senhasComuns.length > 0 ? (
                <div className="grid grid-cols-4 gap-3">
                  {senhasComuns.map((senha, index) => (
                    <div 
                      key={index}
                      className="bg-blue-50 text-blue-700 border border-blue-200 rounded-lg p-3 text-center font-bold"
                    >
                      {senha.senha}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  Não há senhas comuns em espera
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Informações */}
        <div className="mt-8 bg-white p-4 rounded-lg shadow text-center text-gray-600">
          <p>As senhas preferenciais têm prioridade no atendimento.</p>
          <p className="text-sm mt-1">Atualizado automaticamente a cada 5 segundos.</p>
        </div>
      </main>
    </div>
  );
}