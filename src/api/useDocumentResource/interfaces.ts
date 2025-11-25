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

export interface DocumentCard {
  id: string;
  cardName?: string;
  documentType?: string;
  otherDocumentName?: string;
  series?: string;
  number?: string;
  issuingAuthority?: string;
  departmentCode?: string;
  gender?: string;
  birthCountry?: string;
  birthPlace?: string;
  issueDate?: string;
  expirationDate?: string;
  documentStatus?: string;
  cancellationDate?: string;
  comment?: string;
  validFrom?: string;
  validTo?: string;
  personId: string;
}

export interface DocumentRevisionData {
  id: string;
  documentType?: string;
  series?: string;
  number?: string;
  issueDate?: string;
  expirationDate?: string;
  validFrom?: string;
  validTo?: string;
  personId: string;
}

export interface DocumentRevision {
  revisionId: number;
  revisionDate: string;
  revisionType: "ADD" | "MODIFY" | "DELETE";
  username: string;
  ipAddress: string;
  documentData: DocumentRevisionData;
}
