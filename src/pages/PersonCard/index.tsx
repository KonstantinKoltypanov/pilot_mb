import React, { useEffect, useState } from "react";
import { ContentLayoutBody, ContentLayoutFooter } from "./ContentLayoutHelpers";
import { Spin, Tabs, Typography, Button, Tag, Space } from "antd";
import { MainInfoTab } from "../MainInfoTab";
import { DocumentsTab } from "../DocumentsTab";
import { AdressContactsTab } from "../AdressContactsTab";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { usePersonResource } from "../../api/usePersonResource/usePersonResource";
import { useReferenceResource } from "../../api/useReferenceResource/useReferenceResource";
import HistoryOutlined from "@ant-design/icons/lib/icons/HistoryOutlined";
import ArrowLeftOutlined from "@ant-design/icons/lib/icons/ArrowLeftOutlined";

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
  const location = useLocation();
  const navigate = useNavigate();
  const personTypeFromState = (location.state as { personType?: string })
    ?.personType;
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
        <div
          style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}
        >
          {data ? (
            <Space size="middle" align="center">
              <Typography.Title
                level={3}
                style={{ margin: 0, fontWeight: 600 }}
              >
                {[
                  data.generalProperties?.lastName,
                  data.generalProperties?.firstName,
                  data.generalProperties?.middleName,
                ]
                  .filter(Boolean)
                  .join(" ") || "Не указано"}
              </Typography.Title>
              {personTypeFromState && (
                <Tag
                  color="default"
                  style={{ fontSize: 14, padding: "4px 12px", margin: 0 }}
                >
                  {references.personTypes.find(
                    (item) => item.mnemocode === personTypeFromState,
                  )?.nameRu || personTypeFromState}
                </Tag>
              )}
            </Space>
          ) : (
            <Spin />
          )}
        </div>
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/persons")}
          style={{ marginRight: 8 }}
        >
          Реестр персон
        </Button>
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
