import React, { useEffect, useState } from "react";
import { ContentLayoutBody, ContentLayoutFooter } from "./ContentLayoutHelpers";
import { Spin, Tabs, Typography } from "antd";
import { MainInfoTab } from "../MainInfoTab";
import { DocumentsTab } from "../DocumentsTab";
import { AdressContactsTab } from "../AdressContactsTab";
import { useParams } from "react-router-dom";
import { usePersonResource } from "../../api/usePersonResource/usePersonResource";
import { useReferenceResource } from "../../api/useReferenceResource/useReferenceResource";

interface ReferenceItem {
  mnemocode: string;
  nameRu: string;
}

interface References {
  legalForms: ReferenceItem[];
  roles: ReferenceItem[];
  countries: ReferenceItem[];
  personTypes: ReferenceItem[];
}

interface ContentLayoutProps {
  hideFooter?: boolean;
  children?: React.ReactNode;
}

export const PersonCard: React.FC<ContentLayoutProps> = ({ hideFooter }) => {
  const { id } = useParams();
  const {
    getPeopleApi: { fetch, data },
  } = usePersonResource();

  const { getOkopfApi, getRoleApi, getCountryApi, getPersonTypeApi } =
    useReferenceResource();

  const [references, setReferences] = useState<References>({
    legalForms: [],
    roles: [],
    countries: [],
    personTypes: [],
  });

  useEffect(() => {
    fetch({ id });
  }, [id]);

  useEffect(() => {
    const loadReferences = async () => {
      try {
        const [legalFormsData, rolesData, countriesData, personTypesData] =
          await Promise.all([
            getOkopfApi.fetch(),
            getRoleApi.fetch(),
            getCountryApi.fetch(),
            getPersonTypeApi.fetch(),
          ]);

        setReferences({
          legalForms: Array.isArray(legalFormsData)
            ? legalFormsData
            : legalFormsData?.data || [],
          roles: Array.isArray(rolesData) ? rolesData : rolesData?.data || [],
          countries: Array.isArray(countriesData)
            ? countriesData
            : countriesData?.data || [],
          personTypes: Array.isArray(personTypesData)
            ? personTypesData
            : personTypesData?.data || [],
        });
      } catch (error) {
        console.error("Ошибка загрузки справочников:", error);
      }
    };

    loadReferences();
  }, [getOkopfApi.fetch, getRoleApi.fetch, getCountryApi.fetch]);

  const fio =
    data &&
    data.firstName
      .concat(" ", data.lastName)
      .concat(" ", data.middleName ? data.middleName : "");

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        minHeight: 200,
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#FFFFFF",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "16px 24px",
          borderBottom: "1px solid #f0f0f0",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
        }}
      >
        <Typography.Title level={3} style={{ margin: 0 }}>
          Карточка персоны
        </Typography.Title>
        {data?.personType ? (
          <>
            <Typography.Title level={3} style={{ margin: 0 }}>
              (
              {
                references.personTypes.find(
                  (type) => type.mnemocode === data?.personType,
                )?.nameRu
              }
              )
            </Typography.Title>
            <Typography.Title level={3} style={{ margin: 0 }}>
              {fio}
            </Typography.Title>
          </>
        ) : (
          <Spin />
        )}
      </div>
      <ContentLayoutBody>
        <Tabs
          items={[
            {
              key: "1",
              label: "Основное",
              children: <MainInfoTab data={data} references={references} />,
            },
            {
              key: "2",
              label: "Документы",
              children: <DocumentsTab id={id} />,
            },
            {
              key: "1763712949364",
              label: "Адреса+Контакты",
              children: <AdressContactsTab id={id} />,
            },
          ]}
          style={{ padding: 8 }}
          type="line"
          size="middle"
          tabPosition="top"
        />
      </ContentLayoutBody>
      {!hideFooter && (
        <ContentLayoutFooter>
          {data ? <Typography.Text>{data.ucdId}</Typography.Text> : null}
        </ContentLayoutFooter>
      )}
    </div>
  );
};
