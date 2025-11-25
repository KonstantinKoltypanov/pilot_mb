export interface PersonDTO {
  id?: string;
  personType?: string;
  lastName: string;
  firstName: string;
  middleName?: string;
  lastNameLatin?: string;
  firstNameLatin?: string;
  middleNameLatin?: string;
  birthDate?: string;
  name?: string;
  legalForm?: string;
  roles?: Array<string> | string;
  citizenship?: string;
  code?: string;
  residencyType?: string;
  inn?: string;
  foreignTinCountry?: string;
  foreignTin?: string;
  okpo?: string;
  okved?: string;
  additionalOkved?: string;
  okato?: string;
  okfs?: string;
  snils?: string;
  lawyerRegistryNumber?: string;
  notaryRegistryNumber?: string;
  ucdId?: string;
  citizenshipType?: string;
}

export interface AdditionalPropertyNode {
  nodeName: string;
  nodeValue: string;
  children?: AdditionalPropertyNode[];
}

export interface PersonCardResponse {
  id: string;
  generalProperties: {
    lastName?: string;
    firstName?: string;
    middleName?: string;
    legalForm?: string;
    roles?: string;
    lastNameLatin?: string;
    firstNameLatin?: string;
    middleNameLatin?: string;
    citizenship?: string;
    citizenshipType?: string;
    code?: string;
  };
  additionalProperties: AdditionalPropertyNode;
}

export interface PersonRevisionData {
  id: string;
  personType?: string;
  lastName?: string;
  firstName?: string;
  middleName?: string;
  lastNameLatin?: string;
  firstNameLatin?: string;
  middleNameLatin?: string;
  birthDate?: string;
  name?: string;
  legalForm?: string;
  roles?: Array<string> | string;
  citizenship?: string;
  code?: string;
  residencyType?: string;
  inn?: string;
  foreignTinCountry?: string;
  foreignTin?: string;
  okpo?: string;
  okved?: string;
  additionalOkved?: string;
  okato?: string;
  okfs?: string;
  snils?: string;
  lawyerRegistryNumber?: string;
  notaryRegistryNumber?: string;
  ucdId?: string;
  citizenshipType?: string;
}

export interface PersonRevision {
  revisionId: number;
  revisionDate: string;
  revisionType: "ADD" | "MODIFY" | "DELETE";
  username: string;
  ipAddress: string;
  personData: PersonRevisionData;
}
