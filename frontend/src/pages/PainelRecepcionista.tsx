import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  listarSenhas, 
  atualizarStatusSenha, 
  concluirAtendimento 
} from "../service/senhaService"; // Assumindo esses serviços

import { Senha } from "../types/types";

export function PainelRecepcionista() {
    const [senhasPreferenciais, setSenhasPreferenciais] = useState<Senha[]>([]);
    const [senhasComuns, setSenhasComuns] = useState<Senha[]>([]);
    const [senhaAtual, setSenhaAtual] = useState<Senha | null>(null);
    const [guiche, setGuiche] = useState<string>("1");
    const [carregando, setCarregando] = useState<boolean>(false);
  const navigate = useNavigate();

  
  
  const buscarSenhas = async () => {
    try {
      setCarregando(true);
      const senhas = await listarSenhas();
      
      // Filtra senhas por tipo e status
      const preferenciais = senhas.filter(s => 
        s.tipoSenha === "preferencial" && s.status?.status === "Aguardando");
        const comuns = senhas.filter(s => 
        s.tipoSenha === "normal" && s.status?.status === "Aguardando");
        const chamada = senhas.find(s => s.status?.status === "Chamada");

        setSenhasPreferenciais(preferenciais);
        setSenhasComuns(comuns);
        if (chamada) setSenhaAtual(chamada);
    } catch (error) {
      console.error("Erro ao buscar senhas:", error);
    } finally {
      setCarregando(false);
    }
  };
  
  useEffect(() => {
    buscarSenhas();
    // Atualização a cada 10 segundos
    const interval = setInterval(buscarSenhas, 10000);
    return () => clearInterval(interval);
  }, []);
  
  const chamarProximaSenha = async () => {
  try {
    setCarregando(true);
    // Prioridade para senhas preferenciais
    let proximaSenha;
    if (senhasPreferenciais.length > 0) {
      proximaSenha = senhasPreferenciais[0];
    } else if (senhasComuns.length > 0) {
      proximaSenha = senhasComuns[0];
    } else {
      alert("Não há senhas em espera");
      return;
    }

    // COLOQUE AQUI: Verificação e conversão do ID da senha
    const idSenha = proximaSenha.idSenha || proximaSenha.id; // Tenta idSenha ou id
    if (typeof idSenha !== 'number') {
      console.error("Erro: ID da senha inválido", proximaSenha);
      alert("Erro: ID da senha inválido");
      return;
    }
    
    // Use idSenha em vez de proximaSenha.idSenha
    await atualizarStatusSenha(idSenha, "Chamada", guiche);
    setSenhaAtual(proximaSenha);
    
    // Atualiza a lista após chamar
    buscarSenhas();
  } catch (error) {
    console.error("Erro ao chamar senha:", error);
    alert("Erro ao chamar a próxima senha");
  } finally {
    setCarregando(false);
  }
};
    
    const finalizarAtendimento = async () => {
    if (!senhaAtual) {
        alert("Nenhuma senha em atendimento");
        return;
    }
    
    try {
        setCarregando(true);
        
        // COLOQUE AQUI: Verificação e conversão do ID da senha
        const idSenha = senhaAtual.idSenha || senhaAtual.id; // Tenta idSenha ou id
        if (typeof idSenha !== 'number') {
        console.error("Erro: ID da senha inválido", senhaAtual);
        alert("Erro: ID da senha inválido");
        return;
        }
        
        // Use idSenha em vez de senhaAtual.idSenha
        await concluirAtendimento(idSenha);
        setSenhaAtual(null);
        
        // Atualiza a lista após finalizar
        buscarSenhas();
    } catch (error) {
        console.error("Erro ao finalizar atendimento:", error);
        alert("Erro ao finalizar o atendimento");
    } finally {
        setCarregando(false);
    }
    };
  
  function voltarParaHome() {
    navigate("/home");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cabeçalho */}
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">Clínica Bem Estar</h1>
            <p className="text-sm text-blue-200">Painel de Controle - Recepção</p>
          </div>
          <button
            onClick={voltarParaHome}
            className="px-4 py-2 bg-white text-blue-600 hover:bg-blue-50 rounded-md text-sm font-medium transition duration-200 shadow"
          >
            Voltar para Home
          </button>
        </div>
      </header>
      
      {/* Conteúdo principal */}
      <main className="max-w-6xl mx-auto py-6 px-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna de Controle */}
        <div className="lg:col-span-1 space-y-6">
          {/* Guichê */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Seu Guichê</h2>
            <div className="flex items-center mb-4">
              <label htmlFor="guiche" className="mr-4 text-gray-700">Número:</label>
              <select
                id="guiche"
                value={guiche}
                onChange={(e) => setGuiche(e.target.value)}
                className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="1">Guichê 1</option>
                <option value="2">Guichê 2</option>
                <option value="3">Guichê 3</option>
                <option value="4">Guichê 4</option>
              </select>
            </div>
          </div>
          
          {/* Controles */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Controle de Atendimento</h2>
            <div className="space-y-3">
              <button
                onClick={chamarProximaSenha}
                disabled={carregando}
                className={`w-full p-3 rounded-md font-medium flex items-center justify-center space-x-2 
                  ${(senhasPreferenciais.length > 0 || senhasComuns.length > 0) 
                    ? 'bg-green-500 hover:bg-green-600 text-white' 
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
              >
                {carregando ? (
                  <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
                  </svg>
                )}
                <span>Chamar Próxima Senha</span>
              </button>
              
              <button
                onClick={finalizarAtendimento}
                disabled={!senhaAtual || carregando}
                className={`w-full p-3 rounded-md font-medium flex items-center justify-center space-x-2 
                  ${senhaAtual 
                    ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Finalizar Atendimento</span>
              </button>
            </div>
          </div>
          
          {/* Senha Atual */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Em Atendimento</h2>
            {senhaAtual ? (
              <div className="text-center">
                <div className={`text-4xl font-bold mb-2 ${senhaAtual.tipoSenha === 'preferencial' ? 'text-green-600' : 'text-blue-600'}`}>
                  {senhaAtual.senha}
                </div>
                <div className="text-sm text-gray-500">
                  {senhaAtual.tipoSenha === 'preferencial' ? 'Preferencial' : 'Comum'}
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-4">
                Nenhuma senha em atendimento
              </div>
            )}
          </div>
        </div>
        
        {/* Coluna das Filas */}
        <div className="lg:col-span-2 space-y-6">
          {/* Senhas Preferenciais */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-green-500 text-white p-4">
              <h3 className="font-bold">Senhas Preferenciais em Espera ({senhasPreferenciais.length})</h3>
            </div>
            <div className="p-4">
              {senhasPreferenciais.length > 0 ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {senhasPreferenciais.map((senha, index) => (
                    <div 
                      key={index}
                      className="bg-green-50 text-green-700 border border-green-200 rounded-lg p-3 text-center font-bold flex flex-col items-center"
                    >
                      <span>{senha.senha}</span>
                      <span className="text-xs mt-1 text-gray-500">
                        {new Date(senha.dtEmissao).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
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
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-blue-500 text-white p-4">
              <h3 className="font-bold">Senhas Comuns em Espera ({senhasComuns.length})</h3>
            </div>
            <div className="p-4">
              {senhasComuns.length > 0 ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {senhasComuns.map((senha, index) => (
                    <div 
                      key={index}
                      className="bg-blue-50 text-blue-700 border border-blue-200 rounded-lg p-3 text-center font-bold flex flex-col items-center"
                    >
                      <span>{senha.senha}</span>
                      <span className="text-xs mt-1 text-gray-500">
                        {new Date(senha.dtEmissao).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
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
          
          {/* Estatísticas */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Estatísticas de Atendimento</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm text-blue-600 mb-1">Total em Espera</div>
                <div className="text-2xl font-bold text-blue-700">{senhasPreferenciais.length + senhasComuns.length}</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-sm text-green-600 mb-1">Tempo Médio</div>
                <div className="text-2xl font-bold text-green-700">5 min</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}