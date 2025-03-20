import api from "./connection";
import { Departamento } from "../types/types";

export const listarDepartamentos = async () => {
  const response = await api.get<Departamento[]>("/departamentos");
  return response.data;
};

export const adicionarDepartamento = async (departamento: Departamento) => {
  const response = await api.post<Departamento>("/departamentos", departamento);
  return response.data;
};

export const deletarDepartamento = async (idDepartamento: number) => {
  await api.delete(`/departamentos/${idDepartamento}`);
  return idDepartamento;
};

export const alterarDepartamento = async (idDepartamento: number) => {
  const response = await api.put(`/departamentos/${idDepartamento}/alterar-status`);
  return response.data;
};

export const alterarDadosDepartamento = async (
  idDepartamento: number,
  dados: Partial<Departamento>
) => {
  const response = await api.put(`/departamentos/${idDepartamento}/alterar-dados`, dados);
  return response.data;
};

