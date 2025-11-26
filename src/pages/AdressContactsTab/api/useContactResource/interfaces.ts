import type { PersonDTO } from "../../../../api/usePersonResource/interfaces";

export interface ContactDTO {
  id?: string;
  contactType: string;
  email?: string;
  comment?: string;
  countryCode?: string;
  code?: string;
  phoneNumber?: string;
  organization?: string;
  extension?: string;
  person: PersonDTO;
}

export interface ContactCardDTO {
  id: string;
  type: string;
  email?: string;
  telephone?: string;
  countryCode?: string;
  phoneNumber?: string;
  extension?: string;
  comment?: string;
  organization?: string;
}
