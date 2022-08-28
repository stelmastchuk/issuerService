export interface UpdateDTO {
  companyName?: string;
  email?: string;
  documentNumber?: string;
  password?: string;
}

export interface UpdateDPassDTO extends UpdateDTO {
  password_confirmation: string;
}
