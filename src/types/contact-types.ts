export interface Contact {
  id: string;

  fullName: string;
  email: string;
  phone: string;
  topic: string;
  content: string;
  status: boolean;
}

export interface CreateContact {
  fullName: string;
  email: string;
  phone: string;
  topic: string;
  content: string;
  status: boolean;
}
