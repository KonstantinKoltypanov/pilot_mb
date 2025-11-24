import type { ColumnsType } from "antd/es/table";

export const colDefs: ColumnsType<any> = [
  {
    title: "Название",
    dataIndex: "name",
    key: "name",
    width: "40%",
  },
  {
    title: "Значение",
    dataIndex: "value",
    key: "value",
    width: "35%",
  },
  {
    title: "Дата По (План)",
    dataIndex: "dateTo",
    key: "dateTo",
    width: "25%",
  },
];
