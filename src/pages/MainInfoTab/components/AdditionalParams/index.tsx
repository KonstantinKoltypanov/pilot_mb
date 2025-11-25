import React, { useMemo, useState, useCallback } from "react";
import { Table, Button } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import type { TablePaginationConfig } from "antd/es/table";
import type { PersonCardResponse, AdditionalPropertyNode } from "../../../../api/usePersonResource/interfaces";
import { colDefs } from "./colDefs";

interface AdditionalParamsRow {
  key: string;
  name: string;
  value?: string;
  dateTo?: string;
  children?: AdditionalParamsRow[];
  hasValue: boolean;
}

interface ReferenceItem {
  mnemocode: string;
  nameRu: string;
}

interface References {
  legalForms: ReferenceItem[];
  roles: ReferenceItem[];
  countries: ReferenceItem[];
}

interface AdditionalParamsProps {
  data: PersonCardResponse | null;
  references: References;
}

const convertNodeToRow = (
  node: AdditionalPropertyNode,
  keyPrefix: string = ""
): AdditionalParamsRow => {
  const key = keyPrefix || node.nodeName || "root";
  const hasValue = !!node.nodeValue;
  
  const children = node.children
    ? node.children.map((child, index) =>
        convertNodeToRow(child, `${key}-${index}`)
      )
    : undefined;

  return {
    key,
    name: node.nodeName || "",
    value: node.nodeValue || undefined,
    hasValue: hasValue || (children?.some((c) => c.hasValue) ?? false),
    children,
  };
};

const buildHierarchicalData = (
  personData: PersonCardResponse | null,
  references: References
): AdditionalParamsRow[] => {
  if (!personData?.additionalProperties) return [];
  
  const rootNode = personData.additionalProperties;
  
  if (rootNode.children && rootNode.children.length > 0) {
    return rootNode.children.map((child, index) =>
      convertNodeToRow(child, `root-${index}`)
    );
  }
  
  return [];
};

const filterRowsByValue = (rows: AdditionalParamsRow[]): AdditionalParamsRow[] => {
  return rows
    .map((row) => {
      if (row.children) {
        const filteredChildren = filterRowsByValue(row.children);
        if (filteredChildren.length > 0 || row.hasValue) {
          return {
            ...row,
            children: filteredChildren.length > 0 ? filteredChildren : undefined,
          };
        }
        return null;
      }
      return row.hasValue ? row : null;
    })
    .filter((row): row is AdditionalParamsRow => row !== null);
};

export const AdditionalParams: React.FC<AdditionalParamsProps> = ({ data, references }) => {
  const [showAll, setShowAll] = useState(false);
  const scrollY = useMemo(() => ({ y: 360 }), []);

  const paginationConfig: false | TablePaginationConfig | undefined = false;

  const allData = useMemo(() => buildHierarchicalData(data, references), [data, references]);
  
  const displayedData = useMemo(() => {
    if (showAll) {
      return allData;
    }
    return filterRowsByValue(allData);
  }, [allData, showAll]);

  const handleToggleShowAll = useCallback(() => {
    setShowAll((prev) => !prev);
  }, []);

  return (
    <div>
      <div style={{ marginBottom: 16, textAlign: "right" }}>
        <Button
          type="default"
          icon={<EyeOutlined />}
          onClick={handleToggleShowAll}
        >
          {showAll ? "Скрыть пустые" : "Показывать все"}
        </Button>
      </div>
      <Table
        size="middle"
        bordered
        columns={colDefs}
        dataSource={displayedData}
        pagination={paginationConfig}
        scroll={scrollY}
        expandable={{
          defaultExpandAllRows: true,
        }}
        onRow={() => ({ style: { height: 48 } })}
      />
    </div>
  );
};
