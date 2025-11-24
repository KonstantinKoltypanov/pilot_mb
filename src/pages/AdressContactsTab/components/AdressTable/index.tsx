import React from "react";
import { Table } from "antd";
import { useNavigate } from "react-router-dom";
import { colDefs } from "./colDefs";
import type { AddressDTO } from "../../api/useAddressResource/interfaces";

interface AdressTableProps {
  data: AddressDTO[];
  loading: boolean;
}

export const AdressTable: React.FC<AdressTableProps> = ({ data, loading }) => {
  const navigate = useNavigate();

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
        onDoubleClick: () => {
          if (record.id) {
            navigate(`/address/${record.id}`);
          }
        },
        style: { height: 48, cursor: "pointer" },
      })}
    />
  );
};
