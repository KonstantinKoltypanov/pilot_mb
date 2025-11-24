import type { ColumnsType } from "antd/es/table";

export const colDefs: ColumnsType<any> = [
  {
    title: "Название",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Значение",
    dataIndex: "value",
    key: "value",
  },
  {
    title: "Дата По(План)",
    dataIndex: "dateTo",
    key: "dateTo",
  },
];
