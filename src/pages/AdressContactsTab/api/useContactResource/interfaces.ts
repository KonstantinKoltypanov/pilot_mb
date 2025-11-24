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
