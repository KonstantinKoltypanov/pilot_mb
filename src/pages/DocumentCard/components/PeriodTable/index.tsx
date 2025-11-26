import React from "react";
import { Table, Typography } from "antd";
import type { TablePaginationConfig } from "antd/es/table";
import { colDefs } from "./colDefs";

interface PeriodTableProps {
  data: any;
  loading: boolean;
}

export const PeriodTable: React.FC<PeriodTableProps> = ({ data, loading }) => {
  const paginationConfig: false | TablePaginationConfig | undefined = false;

  return (
    <Table
      title={() => (
        <Typography.Title level={5} style={{ margin: 0 }}>
          Период действий
        </Typography.Title>
      )}
      size="middle"
      bordered
      loading={loading}
      columns={colDefs}
      dataSource={data}
      pagination={paginationConfig}
      onRow={() => ({ style: { height: 48 } })}
    />
  );
};
