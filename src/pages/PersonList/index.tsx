import React, { useEffect, useState, useMemo, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Table, Typography, Space, Button, Input, Select, message } from "antd";
import type { TablePaginationConfig, TableProps } from "antd/es/table";
import { usePersonResource } from "../../api/usePersonResource/usePersonResource";
import { useReferenceResource } from "../../api/useReferenceResource/useReferenceResource";
import type { PersonDTO } from "../../api/usePersonResource/interfaces";
import { ReloadOutlined, ExportOutlined } from "@ant-design/icons";
import { columns } from "./colDefs";
import axiosInstance from "../../api/axios";

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
    showTotal: (total, range) => {
      if (!range || !total) return "";
      return `${range[0]}-${range[1]} из ${total}`;
    },
  });
  const [sortOrder, setSortOrder] = useState<string[]>([]);
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [tableHeight, setTableHeight] = useState<number>(0);

  const isPersonListPage = useMemo(() => {
    const path = location.pathname;
    if (path.startsWith("/person/") && path !== "/persons") {
      return false;
    }
    return path === "/" || path === "/persons" || path.startsWith("/persons");
  }, [location.pathname]);

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

  const loadReferences = async () => {
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
      const pageSize = pagination.pageSize || 20;
      const params: Record<string, any> = {
        page: (pagination.current || 1) - 1,
        size: pageSize + 1, // Запрашиваем на 1 больше для определения наличия следующей страницы
      };

      if (sortOrder.length > 0) {
        params.sort = sortOrder;
      }

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

      const allPersons = Array.isArray(result)
        ? result
        : result?.content || result?.data || result?.items || [];

      // Определяем, есть ли следующая страница
      const hasNextPage = allPersons.length > pageSize;

      // Обрезаем массив до нужного количества для отображения
      const persons = hasNextPage ? allPersons.slice(0, pageSize) : allPersons;
      setData(persons);

      // Вычисляем общее количество записей на основе текущей страницы и наличия следующей
      const currentPage = pagination.current || 1;
      let totalRecords: number | undefined;

      if (hasNextPage) {
        // Если есть следующая страница, устанавливаем число больше текущего диапазона,
        // чтобы показать кнопку "следующая" и правильный диапазон в showTotal
        totalRecords = currentPage * pageSize + 1;
      } else {
        // Если это последняя страница, вычисляем точное количество
        totalRecords = (currentPage - 1) * pageSize + persons.length;
      }

      setPagination((prev) => ({
        ...prev,
        total: totalRecords,
        showQuickJumper: false,
        showTotal: (total, range) => {
          if (!range || !total) return "";

          if (hasNextPage) {
            // Если есть следующая страница, показываем диапазон с "+"
            return `${range[0]}-${range[1]} из ${total}+`;
          }
          // Если это последняя страница, показываем точное количество
          return `${range[0]}-${range[1]} из ${total}`;
        },
      }));
    } catch (error: any) {
      message.error(
        `Ошибка загрузки данных: ${error.message || "Неизвестная ошибка"}`,
      );
      console.error("Ошибка загрузки персон:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isPersonListPage) {
      loadReferences();
    }
  }, [isPersonListPage]);

  // Сброс пагинации на первую страницу при изменении фильтров
  useEffect(() => {
    if (isPersonListPage) {
      setPagination((prev) => ({
        ...prev,
        current: 1,
      }));
    }
  }, [
    filters.personTypes,
    filters.legalForms,
    filters.jurisdictions,
    filters.nameAndIdentitySearchType,
    filters.name,
    filters.identity,
    filters.roles,
    filters.roleSearchType,
  ]);

  useEffect(() => {
    if (isPersonListPage) {
      loadData();
    }
  }, [
    pagination.current,
    pagination.pageSize,
    isPersonListPage,
    sortOrder,
    filters,
  ]);

  // Вычисление высоты таблицы для скролла
  useEffect(() => {
    if (!isPersonListPage) return;

    const updateTableHeight = () => {
      if (tableContainerRef.current) {
        // Получаем высоту контейнера
        const containerHeight = tableContainerRef.current.clientHeight;

        // Если контейнер не имеет высоты, не обновляем
        if (containerHeight === 0) {
          return;
        }

        // Вычитаем padding контейнера (16px сверху и снизу = 32px)
        let availableHeight = containerHeight - 32;

        // Находим элементы таблицы
        const tableWrapper =
          tableContainerRef.current.querySelector(".ant-table-wrapper");
        const tableHeader =
          tableContainerRef.current.querySelector(".ant-table-thead");
        const paginationElement =
          tableContainerRef.current.querySelector(".ant-pagination");

        if (tableWrapper && tableHeader && paginationElement) {
          // Получаем реальные высоты элементов
          const headerHeight = (tableHeader as HTMLElement).offsetHeight || 40;
          const paginationHeight =
            (paginationElement as HTMLElement).offsetHeight || 56;

          // Вычитаем высоту заголовка, пагинации и отступы
          // Отступы: 16px сверху от таблицы, 16px снизу от пагинации, 16px между элементами
          const margins = 16 + 16 + 16;
          availableHeight =
            availableHeight - headerHeight - paginationHeight - margins;

          // Дополнительная проверка: если расчет дал отрицательное или очень маленькое значение,
          // используем более консервативный расчет
          if (availableHeight < 100) {
            availableHeight = containerHeight - 32 - 200; // Вычитаем фиксированные 200px для заголовка, пагинации и отступов
          }
        } else {
          // Если элементы еще не отрендерены, используем примерные значения
          // Заголовок ~40px, пагинация ~56px, отступы ~48px, дополнительный запас ~56px
          availableHeight = availableHeight - 200;
        }

        // Устанавливаем минимальную высоту 200px
        if (availableHeight > 200) {
          setTableHeight(Math.floor(availableHeight));
        } else if (availableHeight > 0) {
          setTableHeight(200);
        } else {
          setTableHeight(200); // Минимальная высота даже если расчет отрицательный
        }
      }
    };

    // Используем ResizeObserver для отслеживания изменений размера
    const resizeObserver = new ResizeObserver(() => {
      setTimeout(updateTableHeight, 100);
    });

    if (tableContainerRef.current) {
      resizeObserver.observe(tableContainerRef.current);
    }

    // Несколько проверок с задержками для корректного вычисления после рендера
    const timeoutId1 = setTimeout(updateTableHeight, 150);
    const timeoutId2 = setTimeout(updateTableHeight, 400);
    const timeoutId3 = setTimeout(updateTableHeight, 700);
    const timeoutId4 = setTimeout(updateTableHeight, 1200);

    window.addEventListener("resize", updateTableHeight);
    return () => {
      clearTimeout(timeoutId1);
      clearTimeout(timeoutId2);
      clearTimeout(timeoutId3);
      clearTimeout(timeoutId4);
      window.removeEventListener("resize", updateTableHeight);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [data, pagination, isPersonListPage]);

  const handleTableChange: TableProps<PersonDTO>["onChange"] = (
    paginationConfig,
    _filters,
    sorter,
  ) => {
    // Обработка пагинации
    setPagination((prev) => ({
      ...prev,
      current: paginationConfig.current,
      pageSize: paginationConfig.pageSize,
    }));

    // Обработка сортировки
    if (sorter && !Array.isArray(sorter)) {
      // Одна колонка сортировки
      if (sorter.order) {
        const order = sorter.order === "ascend" ? "asc" : "desc";
        const field = sorter.field as string;
        setSortOrder([`${field},${order}`]);
      } else {
        setSortOrder([]);
      }
    } else if (Array.isArray(sorter) && sorter.length > 0) {
      // Несколько колонок сортировки
      const sortArray = sorter
        .filter((s) => s.order)
        .map((s) => {
          const order = s.order === "ascend" ? "asc" : "desc";
          const field = s.field as string;
          return `${field},${order}`;
        });
      setSortOrder(sortArray);
    } else {
      setSortOrder([]);
    }
  };

  const handleRefresh = () => {
    loadData();
  };

  const handleExport = async () => {
    try {
      message.loading({ content: "Экспорт в Excel...", key: "export" });

      const params: Record<string, any> = {};

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

      const response = await axiosInstance.get("/api/people/xlsx", {
        params,
        responseType: "blob",
      });

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `persons_${new Date().toISOString().split("T")[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      message.success({ content: "Экспорт завершен", key: "export" });
    } catch (error: any) {
      message.error({
        content: `Ошибка экспорта: ${error.message}`,
        key: "export",
      });
    }
  };

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

      <div
        style={{
          padding: "16px 24px",
          borderBottom: "1px solid #f0f0f0",
          backgroundColor: "#fafafa",
        }}
      >
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
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

          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
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
                {personTypes.map((item) => {
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

      <div
        ref={tableContainerRef}
        style={{
          flex: 1,
          overflow: "hidden",
          position: "relative",
          padding: "16px 24px",
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          height: 0, // Важно для правильной работы flex
        }}
      >
        <div
          style={{
            flex: 1,
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <Table
            columns={columns}
            dataSource={data}
            loading={loading}
            pagination={pagination}
            onChange={handleTableChange}
            size="middle"
            bordered
            scroll={{
              x: "max-content",
              y: tableHeight > 0 ? tableHeight : undefined,
            }}
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
    </div>
  );
};
