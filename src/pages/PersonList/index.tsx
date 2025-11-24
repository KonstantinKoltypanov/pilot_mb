import React, { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Table, Typography, Space, Button, Input, Select, message } from "antd";
import type { TablePaginationConfig } from "antd/es/table";
import { usePersonResource } from "../../api/usePersonResource/usePersonResource";
import { useReferenceResource } from "../../api/useReferenceResource/useReferenceResource";
import type { PersonDTO } from "../../api/usePersonResource/interfaces";
import { ReloadOutlined, ExportOutlined } from "@ant-design/icons";
import { columns } from "./colDefs";

const { Title } = Typography;
const { Search } = Input;

interface ReferenceItem {
  mnemocode: string;
  nameRu: string;
}

export const PersonList: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { getPeoplesApi } = usePersonResource();
  const {
    getPersonTypeApi,
    getOkopfApi,
    getCountryApi,
    getRoleApi,
    getNameAndIdentitySearchTypeApi,
    getRoleSearchTypeApi,
  } = useReferenceResource();

  const [data, setData] = useState<PersonDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 20,
    showSizeChanger: true,
    showTotal: (total) => `Всего: ${total}`,
  });

  // Проверяем, что мы на правильной странице (не на странице карточки персоны)
  const isPersonListPage = useMemo(() => {
    const path = location.pathname;
    // Проверяем, что это НЕ страница карточки персоны (/person/:id)
    if (path.startsWith("/person/") && path !== "/persons") {
      return false;
    }
    return path === "/" || path === "/persons" || path.startsWith("/persons");
  }, [location.pathname]);

  // Справочники
  const [personTypes, setPersonTypes] = useState<ReferenceItem[]>([]);
  const [legalForms, setLegalForms] = useState<ReferenceItem[]>([]);
  const [jurisdictions, setJurisdictions] = useState<ReferenceItem[]>([]);
  const [roles, setRoles] = useState<ReferenceItem[]>([]);
  const [nameAndIdentitySearchTypes, setNameAndIdentitySearchTypes] = useState<
    ReferenceItem[]
  >([]);
  const [roleSearchTypes, setRoleSearchTypes] = useState<ReferenceItem[]>([]);

  const [filters, setFilters] = useState({
    personTypes: [] as string[],
    legalForms: [] as string[],
    jurisdictions: [] as string[],
    nameAndIdentitySearchType: undefined as string | undefined,
    name: "",
    identity: "",
    roles: [] as string[],
    roleSearchType: undefined as string | undefined,
  });

  // Загрузка справочников
  const loadReferences = async () => {
    // Проверяем, что мы на странице списка перед загрузкой
    const currentPath = location.pathname;
    const isListPage =
      currentPath === "/" ||
      currentPath === "/persons" ||
      (currentPath.startsWith("/persons") &&
        !currentPath.startsWith("/person/"));
    if (!isListPage) {
      return;
    }

    try {
      const [
        personTypesData,
        legalFormsData,
        jurisdictionsData,
        rolesData,
        nameAndIdentitySearchTypesData,
        roleSearchTypesData,
      ] = await Promise.all([
        getPersonTypeApi.fetch(),
        getOkopfApi.fetch(),
        getCountryApi.fetch(),
        getRoleApi.fetch(),
        getNameAndIdentitySearchTypeApi.fetch(),
        getRoleSearchTypeApi.fetch(),
      ]);

      setPersonTypes(
        Array.isArray(personTypesData)
          ? personTypesData
          : personTypesData?.data || [],
      );
      setLegalForms(
        Array.isArray(legalFormsData)
          ? legalFormsData
          : legalFormsData?.data || [],
      );
      setJurisdictions(
        Array.isArray(jurisdictionsData)
          ? jurisdictionsData
          : jurisdictionsData?.data || [],
      );
      setRoles(Array.isArray(rolesData) ? rolesData : rolesData?.data || []);
      setNameAndIdentitySearchTypes(
        Array.isArray(nameAndIdentitySearchTypesData)
          ? nameAndIdentitySearchTypesData
          : nameAndIdentitySearchTypesData?.data || [],
      );
      setRoleSearchTypes(
        Array.isArray(roleSearchTypesData)
          ? roleSearchTypesData
          : roleSearchTypesData?.data || [],
      );
    } catch (error: any) {
      console.error("Ошибка загрузки справочников:", error);
    }
  };

  const loadData = async () => {
    // Проверяем, что мы на странице списка перед загрузкой
    const currentPath = location.pathname;
    const isListPage =
      currentPath === "/" ||
      currentPath === "/persons" ||
      (currentPath.startsWith("/persons") &&
        !currentPath.startsWith("/person/"));
    if (!isListPage) {
      return;
    }

    setLoading(true);
    try {
      // API использует 0-based индексацию страниц, antd использует 1-based
      const params: Record<string, any> = {
        page: (pagination.current || 1) - 1, // Конвертируем в 0-based
        size: pagination.pageSize || 20,
      };

      // Добавляем фильтры только если они заполнены
      if (filters.personTypes.length > 0) {
        params.personTypes = filters.personTypes;
      }
      if (filters.legalForms.length > 0) {
        params.legalForms = filters.legalForms;
      }
      if (filters.jurisdictions.length > 0) {
        params.jurisdictions = filters.jurisdictions;
      }
      if (filters.nameAndIdentitySearchType) {
        params.nameAndIdentitySearchType = filters.nameAndIdentitySearchType;
      }
      if (filters.name) {
        params.name = filters.name;
      }
      if (filters.identity) {
        params.identity = filters.identity;
      }
      if (filters.roles.length > 0) {
        params.roles = filters.roles;
      }
      if (filters.roleSearchType) {
        params.roleSearchType = filters.roleSearchType;
      }

      const result = await getPeoplesApi.fetch({ params });

      // Предполагаем, что API возвращает объект с данными или массив
      const persons = Array.isArray(result)
        ? result
        : result?.content || result?.data || result?.items || [];
      setData(persons);

      // Обновляем пагинацию, если API возвращает информацию о количестве
      if (result?.totalElements !== undefined) {
        setPagination((prev) => ({
          ...prev,
          total: result.totalElements,
        }));
      } else if (result?.total !== undefined) {
        setPagination((prev) => ({
          ...prev,
          total: result.total,
        }));
      }
    } catch (error: any) {
      message.error(
        `Ошибка загрузки данных: ${error.message || "Неизвестная ошибка"}`,
      );
      console.error("Ошибка загрузки персон:", error);
    } finally {
      setLoading(false);
    }
  };

  // Загружаем справочники при монтировании только если мы на странице списка
  useEffect(() => {
    if (isPersonListPage) {
      loadReferences();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPersonListPage]);

  // Загружаем данные при изменении пагинации или фильтров только если мы на странице списка
  useEffect(() => {
    if (isPersonListPage) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.current, pagination.pageSize, isPersonListPage]);

  const handleTableChange = (newPagination: TablePaginationConfig) => {
    setPagination((prev) => ({
      ...prev,
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    }));
  };

  const handleRefresh = () => {
    loadData();
  };

  const handleExport = async () => {
    try {
      message.info("Экспорт в Excel...");
      // Здесь можно добавить вызов API для экспорта
      // await getXlsxApi.fetch();
    } catch (error: any) {
      message.error(`Ошибка экспорта: ${error.message}`);
    }
  };

  console.log("TEST");

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#FFFFFF",
      }}
    >
      {/* Заголовок */}
      <div
        style={{
          padding: "16px 24px",
          borderBottom: "1px solid #f0f0f0",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
        }}
      >
        <Title level={3} style={{ margin: 0 }}>
          Реестр персон
        </Title>
      </div>

      {/* Панель инструментов и фильтров */}
      <div
        style={{
          padding: "16px 24px",
          borderBottom: "1px solid #f0f0f0",
          backgroundColor: "#fafafa",
        }}
      >
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          {/* Кнопки действий */}
          <Space>
            <Button
              icon={<ReloadOutlined />}
              onClick={handleRefresh}
              loading={loading}
            >
              Обновить
            </Button>
            <Button icon={<ExportOutlined />} onClick={handleExport}>
              Экспорт в Excel
            </Button>
            <Select
              placeholder="Количество строк"
              value={pagination.pageSize}
              onChange={(value) =>
                setPagination((prev) => ({
                  ...prev,
                  pageSize: value,
                  current: 1,
                }))
              }
              style={{ width: 150 }}
            >
              <Select.Option value={20}>20</Select.Option>
              <Select.Option value={50}>50</Select.Option>
              <Select.Option value={100}>100</Select.Option>
              <Select.Option value={500}>500</Select.Option>
              <Select.Option value={1000}>1000</Select.Option>
            </Select>
          </Space>

          {/* Фильтры поиска */}
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            {/* Первая строка фильтров */}
            <Space wrap style={{ width: "100%" }}>
              <Select
                mode="multiple"
                placeholder="Типы персон"
                allowClear
                value={filters.personTypes}
                onChange={(value) =>
                  setFilters((prev) => ({ ...prev, personTypes: value }))
                }
                style={{ width: 250 }}
                maxTagCount="responsive"
              >
                {personTypes.map((item, index) => {
                  if (!item.mnemocode) return null;
                  return (
                    <Select.Option key={item.mnemocode} value={item.mnemocode}>
                      {item.nameRu || item.mnemocode}
                    </Select.Option>
                  );
                })}
              </Select>

              <Select
                mode="multiple"
                placeholder="ОПФ"
                allowClear
                value={filters.legalForms}
                onChange={(value) =>
                  setFilters((prev) => ({ ...prev, legalForms: value }))
                }
                style={{ width: 250 }}
                maxTagCount="responsive"
              >
                {legalForms.map((item) => {
                  if (!item.mnemocode) return null;
                  return (
                    <Select.Option key={item.mnemocode} value={item.mnemocode}>
                      {item.nameRu || item.mnemocode}
                    </Select.Option>
                  );
                })}
              </Select>

              <Select
                mode="multiple"
                placeholder="Юрисдикции"
                allowClear
                value={filters.jurisdictions}
                onChange={(value) =>
                  setFilters((prev) => ({ ...prev, jurisdictions: value }))
                }
                style={{ width: 200 }}
                maxTagCount="responsive"
              >
                {jurisdictions.map((item) => {
                  if (!item.mnemocode) return null;
                  return (
                    <Select.Option key={item.mnemocode} value={item.mnemocode}>
                      {item.nameRu || item.mnemocode}
                    </Select.Option>
                  );
                })}
              </Select>
            </Space>

            {/* Вторая строка фильтров */}
            <Space wrap style={{ width: "100%" }}>
              <Select
                placeholder="Режим поиска (Наименование/Идентификация)"
                allowClear
                value={filters.nameAndIdentitySearchType}
                onChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    nameAndIdentitySearchType: value,
                  }))
                }
                style={{ width: 300 }}
              >
                {nameAndIdentitySearchTypes.map((item) => {
                  if (!item.mnemocode) return null;
                  return (
                    <Select.Option key={item.mnemocode} value={item.mnemocode}>
                      {item.nameRu || item.mnemocode}
                    </Select.Option>
                  );
                })}
              </Select>

              <Search
                placeholder="Наименование"
                allowClear
                value={filters.name}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, name: e.target.value }))
                }
                onSearch={() => loadData()}
                style={{ width: 250 }}
              />

              <Search
                placeholder="Идентификация"
                allowClear
                value={filters.identity}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, identity: e.target.value }))
                }
                onSearch={() => loadData()}
                style={{ width: 250 }}
              />
            </Space>

            {/* Третья строка фильтров */}
            <Space wrap style={{ width: "100%" }}>
              <Select
                mode="multiple"
                placeholder="Роли"
                allowClear
                value={filters.roles}
                onChange={(value) =>
                  setFilters((prev) => ({ ...prev, roles: value }))
                }
                style={{ width: 300 }}
                maxTagCount="responsive"
              >
                {roles.map((item) => {
                  if (!item.mnemocode) return null;
                  return (
                    <Select.Option key={item.mnemocode} value={item.mnemocode}>
                      {item.nameRu || item.mnemocode}
                    </Select.Option>
                  );
                })}
              </Select>

              <Select
                placeholder="Режим поиска (Роли)"
                allowClear
                value={filters.roleSearchType}
                onChange={(value) =>
                  setFilters((prev) => ({ ...prev, roleSearchType: value }))
                }
                style={{ width: 200 }}
              >
                {roleSearchTypes.map((item) => {
                  if (!item.mnemocode) return null;
                  return (
                    <Select.Option key={item.mnemocode} value={item.mnemocode}>
                      {item.nameRu || item.mnemocode}
                    </Select.Option>
                  );
                })}
              </Select>
            </Space>
          </Space>
        </Space>
      </div>

      <div style={{ flex: 1, overflow: "auto", padding: "16px 24px" }}>
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          pagination={pagination}
          onChange={handleTableChange}
          size="middle"
          bordered
          scroll={{ x: "max-content", y: "calc(100vh - 300px)" }}
          rowKey="id"
          onRow={(record) => ({
            onDoubleClick: () => {
              navigate(`/person/${record.id}`, {
                state: { personType: record.personType },
              });
            },
            style: { cursor: "pointer" },
          })}
        />
      </div>
    </div>
  );
};
