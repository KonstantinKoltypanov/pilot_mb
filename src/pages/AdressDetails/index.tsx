import React, { useEffect } from "react";
import { ContentLayoutBody, ContentLayoutFooter } from "./ContentLayoutHelpers";
import { Flex, Form, Input, Typography } from "antd";
import { Table1 } from "./components/Table1";
import { useAddressDetailResource } from "./api/useAddressDetailResource/useAddressDetailResource";
import { useParams } from "react-router-dom";

interface ContentLayoutProps {
  title?: string;
  hideFooter?: boolean;
  children?: React.ReactNode;
}

export const AdressDetails: React.FC<ContentLayoutProps> = (props) => {
  const { id } = useParams();
  const [form] = Form.useForm();

  const {
    getAddressDetailApi: { fetch, data, loading },
  } = useAddressDetailResource();
  useEffect(() => {
    if (!id) return;
    fetch({ id });
  }, [id]);

  useEffect(() => {
    data && form.setFieldsValue(data);
  }, [form, data]);
  const { title = "Заголовок", hideFooter = false } = props || {};

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
          {title}
        </Typography.Title>
      </div>
      <ContentLayoutBody>
        <Form form={form} layout="horizontal" disabled={loading}>
          <Flex
            vertical={false}
            wrap="nowrap"
            justify="flex-start"
            align="flex-start"
            gap={8}
          >
            <Form.Item label="Тип адреса" name="addressType">
              <Input placeholder="Введите текст..." value="" disabled={false} />
            </Form.Item>
            <Form.Item label="Формат" name="format">
              <Input placeholder="Введите текст..." value="" disabled={false} />
            </Form.Item>
          </Flex>
          <Form.Item label="Label">
            <Input placeholder="Введите текст..." value="" disabled={false} />
          </Form.Item>
          <Form.Item label="Адрес (РУС)" name="country">
            <Input placeholder="Введите текст..." value="" disabled={false} />
          </Form.Item>
          <Form.Item label="Адрес (END)" name="country">
            <Input placeholder="Введите текст..." value="" disabled={false} />
          </Form.Item>
          <Flex
            vertical={false}
            wrap="nowrap"
            justify="flex-start"
            align="flex-start"
            gap={8}
          >
            <Form.Item label="Страна (РУС)" name="country">
              <Input placeholder="Введите текст..." value="" disabled={false} />
            </Form.Item>
            <Form.Item label="Страна (ENG)" name="country">
              <Input placeholder="Введите текст..." value="" disabled={false} />
            </Form.Item>
          </Flex>
          <Form.Item label="Индекс" name="postalCode">
            <Input placeholder="Введите текст..." value="" disabled={false} />
          </Form.Item>
          <Form.Item label="Прочее" name="other">
            <Input
              placeholder="Введите текст..."
              value="other"
              disabled={false}
            />
          </Form.Item>
        </Form>
        <Table1 />
      </ContentLayoutBody>
      {!hideFooter && <ContentLayoutFooter></ContentLayoutFooter>}
    </div>
  );
};
