import type { ColumnsType } from "antd/es/table";
import type { PersonDTO } from "../../api/usePersonResource/interfaces";

const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return "-";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
};
export const columns: ColumnsType<PersonDTO> = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    width: 80,
    fixed: "left",
  },
  {
    title: "Код",
    dataIndex: "code",
    key: "code",
    width: 120,
  },
  {
    title: "Тип",
    dataIndex: "personType",
    key: "personType",
    width: 150,
    filters: [
      { text: "Физическое лицо", value: "INDIVIDUAL" },
      { text: "Юридическое лицо", value: "LEGAL" },
    ],
    onFilter: (value, record) => record.personType === value,
  },
  {
    title: "Наименование",
    dataIndex: "name",
    key: "name",
    width: 250,
    ellipsis: true,
  },
  {
    title: "Фамилия",
    dataIndex: "lastName",
    key: "lastName",
    width: 150,
  },
  {
    title: "Имя",
    dataIndex: "firstName",
    key: "firstName",
    width: 150,
  },
  {
    title: "Отчество",
    dataIndex: "middleName",
    key: "middleName",
    width: 150,
  },
  {
    title: "ОПФ",
    dataIndex: "legalForm",
    key: "legalForm",
    width: 120,
  },
  {
    title: "Роли",
    dataIndex: "roles",
    key: "roles",
    width: 200,
    render: (roles: any) => {
      if (!roles) return "-";
      if (Array.isArray(roles)) {
        return roles.join(", ");
      }
      if (typeof roles === "string") {
        return roles;
      }
      return String(roles);
    },
  },
  {
    title: "ИНН",
    dataIndex: "inn",
    key: "inn",
    width: 120,
  },
  {
    title: "СНИЛС",
    dataIndex: "snils",
    key: "snils",
    width: 120,
  },
  {
    title: "Дата рождения",
    dataIndex: "birthDate",
    key: "birthDate",
    width: 120,
    render: (date: string) => formatDate(date),
  },
];
