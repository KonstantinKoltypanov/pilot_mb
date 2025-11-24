import type { ColumnsType } from "antd/es/table";

export const colDefs: ColumnsType<any> = [
  {
    title: "Уровень",
    dataIndex: "level",
    key: "level",
  },
  {
    title: "Тип",
    dataIndex: "type",
    key: "type",
  },
  {
    title: "Наименование(РУС.)",
    dataIndex: "nameRu",
    key: "nameRu",
  },
  {
    title: "Наименование(ENG)",
    dataIndex: "nameEng",
    key: "nameEng",
  },
];
