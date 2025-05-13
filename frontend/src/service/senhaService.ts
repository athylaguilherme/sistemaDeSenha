import api from "./connection";
import { Senha } from "../types/types";

export const listarSenhas = async () => {
  const response = await api.get<Senha[]>("/senhas");
  return response.data;
};

export const adicionarSenha = async (senha: Senha) => {
  const response = await api.post<Senha>("/senhas", senha);
  return response.data;
};

export const atualizarStatusSenha = async (
  idSenha: number,  // Específica que idSenha deve ser um número
  novoStatus: string,  // Específica que novoStatus deve ser uma string
  guiche: string  // Específica que guiche deve ser uma string
): Promise<Senha> => {
  try {
    // Substitua isso pela sua lógica real de API
    const response = await fetch(`/api/senhas/${idSenha}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: novoStatus,
        guiche: guiche
      }),
    });
    
    if (!response.ok) {
      throw new Error('Erro ao atualizar o status da senha');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erro em atualizarStatusSenha:', error);
    throw error;
  }
};

// Função para marcar uma senha como atendida
export const concluirAtendimento = async (idSenha : number) => {
  try {
    // Substitua isso pela sua lógica real de API
    const response = await fetch(`/api/senhas/${idSenha}/concluir`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Erro ao concluir o atendimento');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erro em concluirAtendimento:', error);
    throw error;
  }
};

