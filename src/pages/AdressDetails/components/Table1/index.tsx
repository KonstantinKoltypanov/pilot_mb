import React, { useMemo } from "react";
import { Table } from "antd";
import type { TablePaginationConfig } from "antd/es/table";
import { colDefs } from "./colDefs";

interface Table1Props {}

export const Table1: React.FC<Table1Props> = () => {
  const dataSource = [];

  const scrollY = useMemo(() => ({ y: 360 }), []);

  const paginationConfig: false | TablePaginationConfig | undefined = false;

  return (
    <Table
      size="middle"
      bordered
      columns={colDefs}
      dataSource={dataSource}
      pagination={paginationConfig}
      scroll={scrollY}
      expandable={undefined}
      onRow={() => ({ style: { height: 48 } })}
    />
  );
};
