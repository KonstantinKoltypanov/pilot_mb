import React, { useEffect } from "react";
import { Card } from "antd";
import { DocumentsTable } from "./components/DocumentsTable";
import { useDocumentResource } from "../../api/useDocumentResource/useDocumentResource";

interface ContainerProps {
  id?: string;
}

export const DocumentsTab: React.FC<ContainerProps> = ({ id }) => {
  const {
    getPersonDocumentApi: { fetch, data },
  } = useDocumentResource();

  useEffect(() => {
    if (!id) return;
    fetch({ id });
  }, [id]);

  return (
    <Card title="Документы">
      <div
        style={{
          background: "#ffffff",
          padding: 10,
          height: "100%",
          minHeight: "50px",
          width: "100%",
        }}
      >
        <DocumentsTable data={data} />
      </div>
    </Card>
  );
};
