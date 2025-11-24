import type { ColumnsType } from "antd/es/table";

export const colDefs: ColumnsType<any> = [
  {
    title: "Тип адреса",
    dataIndex: "addressType",
    key: "addressType",
  },
  {
    title: "Формат",
    dataIndex: "format",
    key: "format",
  },
  {
    title: "Индекс",
    dataIndex: "postalCode",
    key: "postalCode",
  },
  {
    title: "Страна",
    dataIndex: "country",
    key: "country",
  },
  {
    title: "Значение",
    dataIndex: "value",
    key: "value",
  },
  {
    title: "Действует по",
    dataIndex: "validTo",
    key: "validTo",
  },
];
