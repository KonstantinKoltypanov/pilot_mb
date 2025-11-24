import React, { useEffect } from "react";
import { Card } from "antd";
import { AdressTable } from "./components/AdressTable";
import { ContactsTable } from "./components/ContactsTable";
import { useAddressResource } from "./api/useAddressResource/useAddressResource";
import { useContactResource } from "./api/useContactResource/useContactResource";

interface ContainerProps {
  id?: string;
}

export const AdressContactsTab: React.FC<ContainerProps> = ({ id }) => {
  const {
    getPersonAdressApi: {
      fetch: adressFetch,
      data: adressData,
      loading: adressLoading,
    },
  } = useAddressResource();

  const {
    getPersonContactsApi: {
      fetch: contactsFetch,
      data: contactsData,
      loading: contactsLoading,
    },
  } = useContactResource();

  useEffect(() => {
    if (!id) return;
    adressFetch({ id });
  }, [id]);

  useEffect(() => {
    if (!id) return;
    contactsFetch({ id });
  }, [id]);

  return (
    <>
      <Card title="Адреса">
        <AdressTable data={adressData || []} loading={adressLoading} />
      </Card>
      <Card title="Контакты">
        <ContactsTable data={contactsData || []} loading={contactsLoading} />
      </Card>
    </>
  );
};
