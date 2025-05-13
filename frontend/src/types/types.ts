export interface Profissional {
    idProfissional?: number;
    nome: string;
    login: string;
    senha: string;
    status?: Status;
  }
  
  export interface Status {
    idStatus: number;
    status: string;
  }
  
export interface Senha {
  id: number | undefined;
  idSenha?: number;
  senha: string;
  tipoSenha: string;
  dtEmissao: string;
  status?: {
    idStatus?: number;
    status: string;
  };
  guiche?: string;
}
  
  export interface Departamento {
    idDepartamento?: number;
    departamento: string;
    status?: Status;
  }
  