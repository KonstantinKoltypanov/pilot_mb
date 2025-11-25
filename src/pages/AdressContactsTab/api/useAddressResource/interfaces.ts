import type { PersonDTO } from "../../../../api/usePersonResource/interfaces";

export interface AddressDTO {
  id?: string;
  addressType: string;
  format?: string;
  detailingMethod?: string;
  postalCode?: string;
  country?: string;
  other?: string;
  validTo?: string;
  person: PersonDTO;
}

export interface AddressDetail {
  id: string;
  level?: string;
  type?: string;
  nameRu?: string;
  nameEng?: string;
}

export interface AddressCard {
  id: string;
  cardName?: string;
  addressType?: string;
  format?: string;
  detailingMethod?: string;
  addressRu?: string;
  addressEng?: string;
  countryRu?: string;
  countryEng?: string;
  postalCode?: string;
  other?: string;
  details?: AddressDetail[];
  personId: string;
}

export interface AddressRevisionData {
  id: string;
  addressType?: string;
  format?: string;
  detailingMethod?: string;
  postalCode?: string;
  country?: string;
  other?: string;
  validTo?: string;
  personId: string;
}

export interface AddressRevision {
  revisionId: number;
  revisionDate: string;
  revisionType: "ADD" | "MODIFY" | "DELETE";
  username: string;
  ipAddress: string;
  addressData: AddressRevisionData;
}
