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
