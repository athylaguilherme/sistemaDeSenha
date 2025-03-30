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

