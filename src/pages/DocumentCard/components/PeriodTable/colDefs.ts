import type { ColumnsType } from "antd/es/table";

export const colDefs: ColumnsType<any> = [
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
