import api from "./connection";
import { Profissional } from "../types/types";

export const listarProfissionais = async () => {
  const response = await api.get<Profissional[]>("/profissionais");
  return response.data;
};

export const adicionarProfissional = async (profissional: Profissional) => {
  const response = await api.post<Profissional>("/profissionais", profissional);
  return response.data;
};


export const deletarProfissional = async (idProfissional: number) => {
  await api.delete(`/profissionais/${idProfissional}`);
  return idProfissional;
};

export const alterarStatusProfissional = async (idProfissional: number) => {
  const response = await api.put(`/profissionais/${idProfissional}/alterar-status`);
  return response.data;
};

export const alterarDadosProfissional = async (
  idProfissional: number,
  dados: Partial<Profissional>
) => {
  const response = await api.put(`/profissionais/${idProfissional}/alterar-dados`, dados);
  return response.data;
};


export const autenticarProfissional = async (login: string, senha: string) => {
  try {
    const response = await api.post<Profissional>("/profissionais/login", {
      login,
      senha,
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || "Erro ao tentar fazer login";
  }
};