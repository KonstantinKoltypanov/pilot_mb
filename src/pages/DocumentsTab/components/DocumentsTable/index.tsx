import React from "react";
import { Table } from "antd";
import type { TablePaginationConfig } from "antd/es/table";
import { colDefs } from "./colDefs";

interface DocumentsTableProps {
  data: any;
}

export const DocumentsTable: React.FC<DocumentsTableProps> = ({ data }) => {
  const paginationConfig: false | TablePaginationConfig | undefined = false;

  const handleRowClick = (record: any) => {
    if (record?.id) {
      const url = `/document/${record.id}`;
      window.open(url, "_black", "width=1200,height=800");
    }
  };

  return (
    <Table
      size="middle"
      bordered
      columns={colDefs}
      dataSource={data || []}
      pagination={paginationConfig}
      onRow={(record) => ({
        onDoubleClick: () => handleRowClick(record),
        style: { height: 48, cursor: "pointer" },
      })}
    />
  );
};
