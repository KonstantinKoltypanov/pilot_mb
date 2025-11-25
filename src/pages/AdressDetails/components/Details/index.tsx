import React from "react";
import { Table } from "antd";
import type { TablePaginationConfig } from "antd/es/table";
import { colDefs } from "./colDefs";
import type { AddressDetailDTO } from "../../api/useAddressDetailResource/interfaces";

interface DetailsTableProps {
  value?: AddressDetailDTO[]
}

export const DetailsTable: React.FC<DetailsTableProps> = ({ value: data }) => {

  console.log(data)

  const paginationConfig: false | TablePaginationConfig | undefined = false;

  return (
    <Table
      size="middle"
      bordered
      columns={colDefs}
      dataSource={data || []}
      pagination={paginationConfig}
      onRow={() => ({ style: { height: 48 } })}
    />
  );
};
