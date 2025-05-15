import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Certifique-se de ter o axios instalado
import { Senha } from "../types/types";

export function PainelRecepcionista() {
    const [senhasPreferenciais, setSenhasPreferenciais] = useState<Senha[]>([]);
    const [senhasComuns, setSenhasComuns] = useState<Senha[]>([]);
    const [senhaAtual, setSenhaAtual] = useState<Senha | null>(null);
    const [guiche, setGuiche] = useState<string>("1");
    const [carregando, setCarregando] = useState<boolean>(false);
    const navigate = useNavigate();

    // Função para buscar dados atualizados
    const buscarDados = async () => {
        try {
            setCarregando(true);
            // Buscar senhas preferenciais em espera
            const resPreferenciais = await axios.get('http://localhost:8080/senhas/preferencial/espera');
            setSenhasPreferenciais(resPreferenciais.data);
            
            // Buscar senhas comuns em espera
            const resComuns = await axios.get('http://localhost:8080/senhas/comum/espera');
            setSenhasComuns(resComuns.data);
            
            // Buscar informações da senha em atendimento no guichê atual
            const resSenhaAtual = await axios.get(`http://localhost:8080/senhas/guiche/${guiche}`);
            
            // Verificar se há uma senha em atendimento
            if (resSenhaAtual.data && !resSenhaAtual.data.message) {
                setSenhaAtual(resSenhaAtual.data);
            } else {
                setSenhaAtual(null);
            }
        } catch (error) {
            console.error("Erro ao buscar dados:", error);
        } finally {
            setCarregando(false);
        }
    };
    
    // Buscar dados iniciais e configurar intervalo de atualização
    useEffect(() => {
        buscarDados();
        const interval = setInterval(buscarDados, 10000); // Atualiza a cada 10 segundos
        return () => clearInterval(interval);
    }, [guiche]); // Dependência do guiche para atualizar quando mudar
    
    // Função para chamar a próxima senha
    const chamarProximaSenha = async () => {
    try {
        setCarregando(true);
        
        // Chamada ao endpoint para chamar próxima senha
        const response = await axios.post(`http://localhost:8080/senhas/chamar?guiche=${guiche}`);
        
        if (response.data && response.data.message) {
            // Se receber uma mensagem, não há senhas para chamar
            alert(response.data.message);
        } else if (response.data) {
            // Senha chamada com sucesso
            const senhaChamada = response.data;
            
            // Iniciar atendimento automaticamente
            try {
                const inicioResponse = await axios.post(`http://localhost:8080/senhas/${senhaChamada.idSenha}/iniciar`);
                setSenhaAtual(inicioResponse.data);
            } catch (inicioError) {
                console.error("Erro ao iniciar atendimento:", inicioError);
                // Mesmo se falhar em iniciar, manter a senha chamada
                setSenhaAtual(senhaChamada);
            }
        }
        
        // Atualiza os dados após chamar a senha
        buscarDados();
    } catch (error) {
        console.error("Erro ao chamar próxima senha:", error);
        alert("Ocorreu um erro ao chamar a próxima senha");
    } finally {
        setCarregando(false);
    }
};
    
    // Função para finalizar o atendimento
    const finalizarAtendimento = async () => {
        if (!senhaAtual) {
            alert("Não há senha em atendimento");
            return;
        }
        
        try {
            setCarregando(true);
            
            // Chamar endpoint para finalizar atendimento
            await axios.post(`http://localhost:8080/senhas/${senhaAtual.idSenha}/finalizar`);
            
            // Limpar a senha atual e atualizar dados
            setSenhaAtual(null);
            buscarDados();
        } catch (error) {
            console.error("Erro ao finalizar atendimento:", error);
            alert("Ocorreu um erro ao finalizar o atendimento");
        } finally {
            setCarregando(false);
        }
    };
    
    // Função para voltar para a Home
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
                                disabled={carregando || (senhaAtual !== null)}
                                className={`w-full p-3 rounded-md font-medium flex items-center justify-center space-x-2 
                                    ${(senhaAtual === null && (senhasPreferenciais.length > 0 || senhasComuns.length > 0)) 
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
                                    {senhasPreferenciais.map((senha) => (
                                        <div 
                                            key={senha.idSenha}
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
                                    {senhasComuns.map((senha) => (
                                        <div 
                                            key={senha.idSenha}
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