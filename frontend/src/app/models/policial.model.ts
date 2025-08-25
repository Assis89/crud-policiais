export interface Policial {
  id?: number;
  rg_civil: string;
  rg_militar: string;
  cpf: string;
  data_nascimento: string;
  matricula: string;
}

export interface PoliciaisFiltro {
  cpf?: string;
  rg_civil?: string;
  rg_militar?: string;
}
