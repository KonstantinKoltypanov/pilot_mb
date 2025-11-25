import type { ColumnsType } from "antd/es/table";
import type { PersonRevision } from "../../api/usePersonResource/interfaces";
import dayjs from "dayjs";

const getRevisionTypeLabel = (type: string) => {
  switch (type) {
    case "ADD":
      return "Добавление";
    case "MODIFY":
      return "Изменение";
    case "DELETE":
      return "Удаление";
    default:
      return type;
  }
};

const formatDate = (dateString: string) => {
  if (!dateString) return "-";
  return dayjs(dateString).format("DD.MM.YYYY HH:mm:ss");
};

export const colDefs: ColumnsType<PersonRevision> = [
  {
    title: "ID ревизии",
    dataIndex: "revisionId",
    key: "revisionId",
    width: 100,
  },
  {
    title: "Дата изменения",
    dataIndex: "revisionDate",
    key: "revisionDate",
    width: 180,
    render: (value: string) => formatDate(value),
  },
  {
    title: "Тип изменения",
    dataIndex: "revisionType",
    key: "revisionType",
    width: 120,
    render: (value: string) => getRevisionTypeLabel(value),
  },
  {
    title: "Пользователь",
    dataIndex: "username",
    key: "username",
    width: 150,
  },
  {
    title: "IP адрес",
    dataIndex: "ipAddress",
    key: "ipAddress",
    width: 150,
  },
  {
    title: "Тип персоны",
    dataIndex: ["personData", "personType"],
    key: "personType",
    width: 120,
  },
  {
    title: "Фамилия",
    dataIndex: ["personData", "lastName"],
    key: "lastName",
    width: 150,
  },
  {
    title: "Имя",
    dataIndex: ["personData", "firstName"],
    key: "firstName",
    width: 150,
  },
  {
    title: "Отчество",
    dataIndex: ["personData", "middleName"],
    key: "middleName",
    width: 150,
  },
  {
    title: "Дата рождения",
    dataIndex: ["personData", "birthDate"],
    key: "birthDate",
    width: 120,
    render: (value: string) => (value ? dayjs(value).format("DD.MM.YYYY") : "-"),
  },
  {
    title: "ОПФ",
    dataIndex: ["personData", "legalForm"],
    key: "legalForm",
    width: 120,
  },
  {
    title: "ИНН",
    dataIndex: ["personData", "inn"],
    key: "inn",
    width: 120,
  },
  {
    title: "СНИЛС",
    dataIndex: ["personData", "snils"],
    key: "snils",
    width: 120,
  },
];

