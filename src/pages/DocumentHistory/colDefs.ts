import type { ColumnsType } from "antd/es/table";
import type { DocumentRevision } from "../../api/useDocumentResource/interfaces";
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

export const colDefs: ColumnsType<DocumentRevision> = [
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
    title: "Тип документа",
    dataIndex: ["documentData", "documentType"],
    key: "documentType",
    width: 150,
  },
  {
    title: "Серия",
    dataIndex: ["documentData", "series"],
    key: "series",
    width: 100,
  },
  {
    title: "Номер",
    dataIndex: ["documentData", "number"],
    key: "number",
    width: 120,
  },
  {
    title: "Дата выдачи",
    dataIndex: ["documentData", "issueDate"],
    key: "issueDate",
    width: 120,
    render: (value: string) =>
      value ? dayjs(value).format("DD.MM.YYYY") : "-",
  },
  {
    title: "Дата окончания",
    dataIndex: ["documentData", "expirationDate"],
    key: "expirationDate",
    width: 120,
    render: (value: string) =>
      value ? dayjs(value).format("DD.MM.YYYY") : "-",
  },
  {
    title: "Действует с",
    dataIndex: ["documentData", "validFrom"],
    key: "validFrom",
    width: 120,
    render: (value: string) =>
      value ? dayjs(value).format("DD.MM.YYYY") : "-",
  },
  {
    title: "Действует по",
    dataIndex: ["documentData", "validTo"],
    key: "validTo",
    width: 120,
    render: (value: string) =>
      value ? dayjs(value).format("DD.MM.YYYY") : "-",
  },
];
