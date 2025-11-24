import type { AddressDTO } from "../../../AdressContactsTab/api/useAddressResource/interfaces";

export interface AddressDetailDTO {
  id?: string;
  level: string;
  type?: string;
  nameRu?: string;
  nameEng?: string;
  address?: AddressDTO;
}
