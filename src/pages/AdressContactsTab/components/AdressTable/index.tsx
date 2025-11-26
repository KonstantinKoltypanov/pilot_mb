import React from "react";
import { Table } from "antd";
import { colDefs } from "./colDefs";
import type { AddressDTO } from "../../api/useAddressResource/interfaces";

interface AdressTableProps {
  data: AddressDTO[];
  loading: boolean;
}

export const AdressTable: React.FC<AdressTableProps> = ({ data, loading }) => {
  const handleRowClick = (record: any) => {
    if (record?.id) {
      const url = `/address/${record.id}`;
      window.open(url, "_black", "width=1200,height=800");
    }
  };

  return (
    <Table
      size="middle"
      bordered
      loading={loading}
      rowKey={(record) => record.id}
      columns={colDefs}
      dataSource={data}
      pagination={false}
      onRow={(record) => ({
        onDoubleClick: () => handleRowClick(record),
        style: { height: 48, cursor: "pointer" },
      })}
    />
  );
};
