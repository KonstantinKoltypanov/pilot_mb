import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  ContentLayoutBody,
  ContentLayoutFooter,
} from "../AdressDetails/ContentLayoutHelpers";
import { Table, Typography, Spin } from "antd";
import type { TablePaginationConfig } from "antd/es/table";
import { useAddressResource } from "../AdressContactsTab/api/useAddressResource/useAddressResource";
import type { AddressRevision } from "../AdressContactsTab/api/useAddressResource/interfaces";
import { colDefs } from "./colDefs";

export const AddressHistory: React.FC = () => {
  const { id } = useParams();
  const {
    getAddressHistoryApi: { fetch, data, loading },
  } = useAddressResource();

  useEffect(() => {
    if (id) {
      fetch({ id });
    }
  }, [id]);

  const paginationConfig: false | TablePaginationConfig | undefined = false;

  if (loading) {
    return (
      <div
        style={{
          height: "100%",
          minHeight: 200,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        minHeight: 200,
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#FFFFFF",
      }}
    >
      <div
        style={{
          padding: "16px 24px",
          borderBottom: "1px solid #f0f0f0",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
        }}
      >
        <Typography.Title level={3} style={{ margin: 0 }}>
          История изменений адреса
        </Typography.Title>
      </div>
      <ContentLayoutBody>
        <Table
          size="middle"
          bordered
          rowKey={(record) => record.revisionId.toString()}
          loading={loading}
          columns={colDefs}
          dataSource={data || []}
          pagination={paginationConfig}
          onRow={() => ({ style: { height: 48 } })}
        />
      </ContentLayoutBody>
      <ContentLayoutFooter>
        {id && <Typography.Text>ID адреса: {id}</Typography.Text>}
      </ContentLayoutFooter>
    </div>
  );
};
