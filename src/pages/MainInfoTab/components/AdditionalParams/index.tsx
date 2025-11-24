import React, { useMemo } from "react";
import { Table } from "antd";
import type { TablePaginationConfig } from "antd/es/table";
import { colDefs } from "./colDefs";

interface AdditionalParamsProps {
  data: any;
}

export const AdditionalParams: React.FC<AdditionalParamsProps> = ({ data }) => {
  const scrollY = useMemo(() => ({ y: 360 }), []);

  const paginationConfig: false | TablePaginationConfig | undefined = false;

  return (
    <Table
      size="middle"
      bordered
      columns={colDefs}
      dataSource={data || []}
      pagination={paginationConfig}
      scroll={scrollY}
      expandable={undefined}
      onRow={() => ({ style: { height: 48 } })}
    />
  );
};
