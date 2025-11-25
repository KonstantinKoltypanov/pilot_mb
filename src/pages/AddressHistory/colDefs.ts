import type { ColumnsType } from "antd/es/table";
import type { AddressRevision } from "../AdressContactsTab/api/useAddressResource/interfaces";
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

export const colDefs: ColumnsType<AddressRevision> = [
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
    title: "Тип адреса",
    dataIndex: ["addressData", "addressType"],
    key: "addressType",
    width: 150,
  },
  {
    title: "Формат",
    dataIndex: ["addressData", "format"],
    key: "format",
    width: 120,
  },
  {
    title: "Метод детализации",
    dataIndex: ["addressData", "detailingMethod"],
    key: "detailingMethod",
    width: 150,
  },
  {
    title: "Индекс",
    dataIndex: ["addressData", "postalCode"],
    key: "postalCode",
    width: 100,
  },
  {
    title: "Страна",
    dataIndex: ["addressData", "country"],
    key: "country",
    width: 120,
  },
  {
    title: "Прочее",
    dataIndex: ["addressData", "other"],
    key: "other",
    width: 150,
  },
  {
    title: "Действует по",
    dataIndex: ["addressData", "validTo"],
    key: "validTo",
    width: 120,
    render: (value: string) => (value ? dayjs(value).format("DD.MM.YYYY") : "-"),
  },
];

