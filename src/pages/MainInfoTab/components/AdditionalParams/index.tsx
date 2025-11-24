import React, { useMemo, useState, useCallback } from "react";
import { Table, Button } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import type { TablePaginationConfig } from "antd/es/table";
import type { PersonDTO } from "../../../../api/usePersonResource/interfaces";
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
  data: PersonDTO | null;
  references: References;
}

const getTranslatedValue = (
  value: string | undefined,
  reference: ReferenceItem[]
): string | undefined => {
  if (!value) return undefined;
  const item = reference.find((ref) => ref.mnemocode === value);
  return item?.nameRu || value;
};

const buildHierarchicalData = (
  personData: PersonDTO | null,
  references: References
): AdditionalParamsRow[] => {
  if (!personData) return [];

  const rows: AdditionalParamsRow[] = [];

  const residencyRows: AdditionalParamsRow[] = [];
  const residencyTypeValue = getTranslatedValue(
    personData.residencyType,
    references.roles
  ) || personData.residencyType;
  
  if (personData.residencyType) {
    residencyRows.push({
      key: "residency-type",
      name: "Тип резидентства",
      value: residencyTypeValue,
      hasValue: true,
    });
  } else {
    residencyRows.push({
      key: "residency-type",
      name: "Тип резидентства",
      hasValue: false,
    });
  }

  if (residencyRows.length > 0) {
    rows.push({
      key: "residency",
      name: "Резидентство",
      children: [
        {
          key: "residency-russia",
          name: "Россия",
          children: residencyRows,
          hasValue: residencyRows.some((r) => r.hasValue),
        },
      ],
      hasValue: residencyRows.some((r) => r.hasValue),
    });
  }

  const taxRows: AdditionalParamsRow[] = [];
  
  const russiaTaxRows: AdditionalParamsRow[] = [];
  if (personData.inn) {
    russiaTaxRows.push({
      key: "inn",
      name: "ИНН",
      value: personData.inn,
      hasValue: true,
    });
  } else {
    russiaTaxRows.push({
      key: "inn",
      name: "ИНН",
      hasValue: false,
    });
  }

  if (russiaTaxRows.length > 0) {
    taxRows.push({
      key: "tax-russia",
      name: "Россия",
      children: russiaTaxRows,
      hasValue: russiaTaxRows.some((r) => r.hasValue),
    });
  }

  const foreignTinRows: AdditionalParamsRow[] = [];
  const foreignTinCountryValue = getTranslatedValue(
    personData.foreignTinCountry,
    references.countries
  ) || personData.foreignTinCountry;
  
  if (personData.foreignTinCountry) {
    foreignTinRows.push({
      key: "foreign-tin-country",
      name: "Страна",
      value: foreignTinCountryValue,
      hasValue: true,
    });
  } else {
    foreignTinRows.push({
      key: "foreign-tin-country",
      name: "Страна",
      hasValue: false,
    });
  }

  if (personData.foreignTin) {
    foreignTinRows.push({
      key: "foreign-tin",
      name: "TIN",
      value: personData.foreignTin,
      hasValue: true,
    });
  } else {
    foreignTinRows.push({
      key: "foreign-tin",
      name: "TIN",
      hasValue: false,
    });
  }

  if (foreignTinRows.length > 0) {
    taxRows.push({
      key: "foreign-tin-category",
      name: "Иностранный идентификационный номер налогоплательщика",
      children: foreignTinRows,
      hasValue: foreignTinRows.some((r) => r.hasValue),
    });
  }

  if (taxRows.length > 0) {
    rows.push({
      key: "tax-identifiers",
      name: "Налоговые идентификаторы",
      children: taxRows,
      hasValue: taxRows.some((r) => r.hasValue),
    });
  }

  const classifierRows: AdditionalParamsRow[] = [];
  const russiaClassifierRows: AdditionalParamsRow[] = [];

  if (personData.okpo) {
    russiaClassifierRows.push({
      key: "okpo",
      name: "ОКПО",
      value: personData.okpo,
      hasValue: true,
    });
  } else {
    russiaClassifierRows.push({
      key: "okpo",
      name: "ОКПО",
      hasValue: false,
    });
  }

  if (personData.okved) {
    russiaClassifierRows.push({
      key: "okved",
      name: "ОКВЭД",
      value: personData.okved,
      hasValue: true,
    });
  } else {
    russiaClassifierRows.push({
      key: "okved",
      name: "ОКВЭД",
      hasValue: false,
    });
  }

  if (personData.additionalOkved) {
    russiaClassifierRows.push({
      key: "additional-okved",
      name: "ОКВЭД (доп.)",
      value: personData.additionalOkved,
      hasValue: true,
    });
  } else {
    russiaClassifierRows.push({
      key: "additional-okved",
      name: "ОКВЭД (доп.)",
      hasValue: false,
    });
  }

  if (personData.okato) {
    russiaClassifierRows.push({
      key: "okato",
      name: "ОКАТО",
      value: personData.okato,
      hasValue: true,
    });
  } else {
    russiaClassifierRows.push({
      key: "okato",
      name: "ОКАТО",
      hasValue: false,
    });
  }

  if (personData.okfs) {
    russiaClassifierRows.push({
      key: "okfs",
      name: "ОКФС",
      value: personData.okfs,
      hasValue: true,
    });
  } else {
    russiaClassifierRows.push({
      key: "okfs",
      name: "ОКФС",
      hasValue: false,
    });
  }

  if (russiaClassifierRows.length > 0) {
    classifierRows.push({
      key: "classifier-russia",
      name: "Россия",
      children: russiaClassifierRows,
      hasValue: russiaClassifierRows.some((r) => r.hasValue),
    });
  }

  if (classifierRows.length > 0) {
    rows.push({
      key: "classifiers",
      name: "Классификаторы",
      children: classifierRows,
      hasValue: classifierRows.some((r) => r.hasValue),
    });
  }

  const otherIdRows: AdditionalParamsRow[] = [];
  const russiaOtherIdRows: AdditionalParamsRow[] = [];

  if (personData.snils) {
    russiaOtherIdRows.push({
      key: "snils",
      name: "СНИЛС",
      value: personData.snils,
      hasValue: true,
    });
  } else {
    russiaOtherIdRows.push({
      key: "snils",
      name: "СНИЛС",
      hasValue: false,
    });
  }

  if (russiaOtherIdRows.length > 0) {
    otherIdRows.push({
      key: "other-id-russia",
      name: "Россия",
      children: russiaOtherIdRows,
      hasValue: russiaOtherIdRows.some((r) => r.hasValue),
    });
  }

  if (otherIdRows.length > 0) {
    rows.push({
      key: "other-identifiers",
      name: "Прочие идентификаторы",
      children: otherIdRows,
      hasValue: otherIdRows.some((r) => r.hasValue),
    });
  }

  const otherDataRows: AdditionalParamsRow[] = [];

  if (personData.lawyerRegistryNumber) {
    otherDataRows.push({
      key: "lawyer-registry",
      name: "Регистрационный номер реестра адвокатов",
      value: personData.lawyerRegistryNumber,
      hasValue: true,
    });
  } else {
    otherDataRows.push({
      key: "lawyer-registry",
      name: "Регистрационный номер реестра адвокатов",
      hasValue: false,
    });
  }

  if (personData.notaryRegistryNumber) {
    otherDataRows.push({
      key: "notary-registry",
      name: "Регистрационный номер реестра нотариусов",
      value: personData.notaryRegistryNumber,
      hasValue: true,
    });
  } else {
    otherDataRows.push({
      key: "notary-registry",
      name: "Регистрационный номер реестра нотариусов",
      hasValue: false,
    });
  }

  if (otherDataRows.length > 0) {
    rows.push({
      key: "other-data",
      name: "Прочие данные",
      children: otherDataRows,
      hasValue: otherDataRows.some((r) => r.hasValue),
    });
  }

  return rows;
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
