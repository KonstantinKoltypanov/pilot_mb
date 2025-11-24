import type { ColumnsType } from "antd/es/table";

export const colDefs: ColumnsType<any> = [
  {
    title: "Тип документа",
    dataIndex: "documentType",
    key: "documentType",
  },
  {
    title: "Серия",
    dataIndex: "series",
    key: "series",
  },
  {
    title: "Номер",
    dataIndex: "number",
    key: "number",
  },
  {
    title: "Дата выдачи",
    dataIndex: "issueDate",
    key: "issueDate",
  },
  {
    title: "Дата окончания",
    dataIndex: "expiryDate",
    key: "expiryDate",
  },
  {
    title: "Действует с",
    dataIndex: "validFrom",
    key: "validFrom",
  },
  {
    title: "Действует по",
    dataIndex: "validTo",
    key: "validTo",
  },
];
