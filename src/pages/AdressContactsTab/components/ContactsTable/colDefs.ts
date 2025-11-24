import type { ColumnsType } from "antd/es/table";

export const colDefs: ColumnsType<any> = [
  {
    title: "Тип",
    dataIndex: "type",
    key: "type",
  },
  {
    title: "Значение",
    dataIndex: "value",
    key: "value",
  },
  {
    title: "Комментарий",
    dataIndex: "comment",
    key: "comment",
  },
];
