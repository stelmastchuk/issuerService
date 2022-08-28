export interface CreateDTO {
  companyName: string;
  email: string;
  documentNumber: string;
  password: string;
}

export interface CreateAuthDTO {
  email: string;
  password: string;
}

export interface CreatePassDTO extends CreateDTO {
  password_confirmation: string;
}
