import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";

const formatDate = (dateString: string | undefined | null): string => {
  if (!dateString) return "-";
  try {
    const date = dayjs(dateString);
    if (!date.isValid()) return dateString;
    return date.format("DD.MM.YYYY");
  } catch {
    return dateString;
  }
};

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
    render: (date: string) => formatDate(date),
  },
  {
    title: "Дата окончания",
    dataIndex: "expiryDate",
    key: "expiryDate",
    render: (date: string) => formatDate(date),
  },
  {
    title: "Действует с",
    dataIndex: "validFrom",
    key: "validFrom",
    render: (date: string) => formatDate(date),
  },
  {
    title: "Действует по",
    dataIndex: "validTo",
    key: "validTo",
    render: (date: string) => formatDate(date),
  },
];
