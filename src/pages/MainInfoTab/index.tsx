import React, { useEffect } from "react";
import { Card, Flex, Form, Input, Select } from "antd";
import { AdditionalParams } from "./components/AdditionalParams";
import type { PersonDTO } from "../../api/usePersonResource/interfaces";

interface ReferenceItem {
  mnemocode: string;
  nameRu: string;
}

interface References {
  legalForms: ReferenceItem[];
  roles: ReferenceItem[];
  countries: ReferenceItem[];
}

interface ContainerProps {
  data: PersonDTO | null;
  references: References;
  children?: React.ReactNode;
}

export const MainInfoTab: React.FC<ContainerProps> = ({ data, references }) => {
  const [form] = Form.useForm();

  // Установка значений формы при получении данных
  useEffect(() => {
    form.setFieldsValue(data);
  }, [data, form]);

  return (
    <>
      <Card title="Основные параметры">
        <div
          style={{
            background: "#ffffff",
            padding: 10,
            height: "100%",
            minHeight: "50px",
            width: "100%",
          }}
        >
          <Form form={form} layout="vertical" style={{ maxWidth: 700 }}>
            <Flex
              vertical={false}
              wrap="nowrap"
              justify="flex-start"
              align="flex-start"
              gap={8}
            >
              <Form.Item label="Фамилия" name="lastName" style={{ flex: 1 }}>
                <Input placeholder="Введите текст..." disabled={false} />
              </Form.Item>
              <Form.Item label="Имя" name="firstName" style={{ flex: 1 }}>
                <Input placeholder="Введите текст..." disabled={false} />
              </Form.Item>
              <Form.Item label="Отчество" name="middleName" style={{ flex: 1 }}>
                <Input placeholder="Введите текст..." disabled={false} />
              </Form.Item>
            </Flex>
            <Form.Item label="Дата рождения" name="birthDate">
              <Input placeholder="Введите текст..." disabled={false} />
            </Form.Item>
            <Form.Item label="Организационно-правовая форма" name="legalForm">
              <Select
                placeholder="Выберите ОПФ..."
                allowClear
                showSearch
                filterOption={(input, option) => {
                  const label =
                    typeof option?.label === "string"
                      ? option.label
                      : String(option?.children || "");
                  return label.toLowerCase().includes(input.toLowerCase());
                }}
              >
                {references.legalForms.map((item) => {
                  if (!item.mnemocode) return null;
                  return (
                    <Select.Option key={item.mnemocode} value={item.mnemocode}>
                      {item.nameRu || item.mnemocode}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
            <Form.Item label="Роли" name="roles">
              <Select
                mode="multiple"
                placeholder="Выберите роли..."
                allowClear
                showSearch
                filterOption={(input, option) => {
                  const label =
                    typeof option?.label === "string"
                      ? option.label
                      : String(option?.children || "");
                  return label.toLowerCase().includes(input.toLowerCase());
                }}
                maxTagCount="responsive"
              >
                {references.roles.map((item) => {
                  if (!item.mnemocode) return null;
                  return (
                    <Select.Option key={item.mnemocode} value={item.mnemocode}>
                      {item.nameRu || item.mnemocode}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
            <Flex
              vertical={false}
              wrap="nowrap"
              justify="flex-start"
              align="flex-start"
              gap={8}
            >
              <Form.Item
                label="Фамилия (на латинице)"
                name="lastNameLatin"
                style={{ flex: 1 }}
              >
                <Input placeholder="Введите текст..." disabled={false} />
              </Form.Item>
              <Form.Item
                label="Имя (на латинице)"
                name="firstNameLatin"
                style={{ flex: 1 }}
              >
                <Input placeholder="Введите текст..." disabled={false} />
              </Form.Item>
              <Form.Item
                label="Отчество (на латинице)"
                name="middleNameLatin"
                style={{ flex: 1 }}
              >
                <Input placeholder="Введите текст..." disabled={false} />
              </Form.Item>
            </Flex>
            <Flex
              vertical={false}
              wrap="nowrap"
              justify="flex-start"
              align="flex-start"
              gap={8}
            >
              <Form.Item
                label="Гражданство"
                name="citizenship"
                style={{ flex: 1 }}
              >
                <Select
                  placeholder="Выберите гражданство..."
                  allowClear
                  showSearch
                  filterOption={(input, option) => {
                    const label =
                      typeof option?.label === "string"
                        ? option.label
                        : String(option?.children || "");
                    return label.toLowerCase().includes(input.toLowerCase());
                  }}
                >
                  {references.countries.map((item) => {
                    if (!item.mnemocode) return null;
                    return (
                      <Select.Option
                        key={item.mnemocode}
                        value={item.mnemocode}
                      >
                        {item.nameRu || item.mnemocode}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
              <Form.Item
                label="Тип гражданства"
                name="residencyType"
                style={{ flex: 1 }}
              >
                <Input placeholder="Введите текст..." disabled={false} />
              </Form.Item>
              <Form.Item label="Код" name="code" style={{ flex: 1 }}>
                <Input placeholder="Введите текст..." disabled={false} />
              </Form.Item>
            </Flex>
          </Form>
        </div>
      </Card>
      <Card title="Дополнительные параметры">
        <div
          style={{
            background: "#ffffff",
            padding: 10,
            height: "100%",
            minHeight: "50px",
            width: "100%",
          }}
        >
          <AdditionalParams data={undefined} />
        </div>
      </Card>
    </>
  );
};
