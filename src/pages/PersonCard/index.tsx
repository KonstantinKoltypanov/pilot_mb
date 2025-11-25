import React, { useEffect, useState } from "react";
import { ContentLayoutBody, ContentLayoutFooter } from "./ContentLayoutHelpers";
import { Spin, Tabs, Typography, Button } from "antd";
import { MainInfoTab } from "../MainInfoTab";
import { DocumentsTab } from "../DocumentsTab";
import { AdressContactsTab } from "../AdressContactsTab";
import { useParams } from "react-router-dom";
import { usePersonResource } from "../../api/usePersonResource/usePersonResource";
import { useReferenceResource } from "../../api/useReferenceResource/useReferenceResource";
import HistoryOutlined from "@ant-design/icons/lib/icons/HistoryOutlined";

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
    getPeopleCardApi: { fetch, data },
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
    if (id) {
      fetch({ id });
    }
  }, [id, fetch]);

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

  const handleOpenHistory = () => {
    if (id) {
      const historyUrl = `/person/${id}/history`;
      window.open(historyUrl, "_blank", "width=1200,height=800");
    }
  };

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
          justifyContent: "space-between",
          padding: "16px 24px",
          borderBottom: "1px solid #f0f0f0",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Typography.Title level={3} style={{ margin: 0 }}>
            Карточка персоны
          </Typography.Title>
          {data ? (
            <>
              {data.generalProperties?.legalForm && (
                <Typography.Title level={3} style={{ margin: 0 }}>
                  ({data.generalProperties.legalForm})
                </Typography.Title>
              )}
              <Typography.Title level={3} style={{ margin: 0 }}>
                {data.generalProperties?.firstName || ""}{" "}
                {data.generalProperties?.lastName || ""}{" "}
                {data.generalProperties?.middleName || ""}
              </Typography.Title>
            </>
          ) : (
            <Spin />
          )}
        </div>
        {id && (
          <Button
            type="default"
            icon={<HistoryOutlined />}
            onClick={handleOpenHistory}
          >
            История изменений
          </Button>
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
          {data?.id ? <Typography.Text>{data.id}</Typography.Text> : null}
        </ContentLayoutFooter>
      )}
    </div>
  );
};
