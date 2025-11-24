import type { PersonDTO } from "../usePersonResource/interfaces";

export interface DocumentDTO {
  id?: string;
  documentType: string;
  series?: string;
  number: string;
  issueDate?: string;
  expirationDate?: string;
  validFrom?: string;
  validTo?: string;
  issuingAuthority?: string;
  departmentCode?: string;
  gender?: string;
  birthCountry?: string;
  birthPlace?: string;
  documentStatus?: string;
  cancellationDate?: string;
  comment?: string;
  otherDocumentName?: string;
  person: PersonDTO;
}
