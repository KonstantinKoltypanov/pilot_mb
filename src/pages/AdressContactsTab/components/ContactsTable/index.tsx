import React from "react";
import { Table } from "antd";
import { colDefs } from "./colDefs";
import type { ContactDTO } from "../../api/useContactResource/interfaces";

interface ContactsTableProps {
  data: ContactDTO[];
  loading: boolean;
}

export const ContactsTable: React.FC<ContactsTableProps> = ({
  data,
  loading,
}) => {
  return (
    <Table
      size="middle"
      bordered
      rowKey={(record) => record.id}
      loading={loading}
      columns={colDefs}
      dataSource={data}
      pagination={false}
      onRow={() => ({ style: { height: 48 } })}
    />
  );
};
