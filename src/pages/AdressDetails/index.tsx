import React, { useEffect } from "react";
import { ContentLayoutBody, ContentLayoutFooter } from "./ContentLayoutHelpers";
import { Flex, Form, Input, Typography, Button } from "antd";
import { DetailsTable } from "./components/Details";
import { useParams } from "react-router-dom";
import { useAddressResource } from "../AdressContactsTab/api/useAddressResource/useAddressResource";
import HistoryOutlined from "@ant-design/icons/lib/icons/HistoryOutlined";

interface ContentLayoutProps {
  children?: React.ReactNode;
}

export const AdressDetails: React.FC<ContentLayoutProps> = () => {
  const { id } = useParams();
  const [form] = Form.useForm();

  const {
    getAdressCardApi: { fetch, data, loading },
  } = useAddressResource();

  useEffect(() => {
    if (!id) return;
    fetch({ id });
  }, [id]);

  useEffect(() => {
    data && form.setFieldsValue(data);
  }, [form, data]);

  const handleOpenHistory = () => {
    if (id) {
      const historyUrl = `/address/${id}/history`;
      window.open(historyUrl, "_blank", "width=1200,height=800");
    }
  };

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
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography.Title level={3} style={{ margin: 0 }}>
          {data?.cardName || ""}
        </Typography.Title>
        {id && (
          <Button
            type="default"
            icon={<HistoryOutlined />}
            onClick={handleOpenHistory}
          >
            История изменений
          </Button>
        )}
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
              <Input placeholder="Введите текст..." readOnly />
            </Form.Item>
            <Form.Item label="Формат" name="format">
              <Input placeholder="Введите текст..." readOnly />
            </Form.Item>
          </Flex>
          <Form.Item name="detailingMethod" label="Метод детализации">
            <Input placeholder="Введите текст..." readOnly />
          </Form.Item>
          <Form.Item label="Адрес (РУС)" name="addressRu">
            <Input placeholder="Введите текст..." readOnly />
          </Form.Item>
          <Form.Item label="Адрес (END)" name="addressEng">
            <Input placeholder="Введите текст..." readOnly />
          </Form.Item>
          <Flex
            vertical={false}
            wrap="nowrap"
            justify="flex-start"
            align="flex-start"
            gap={8}
          >
            <Form.Item label="Страна (РУС)" name="countryRu">
              <Input placeholder="Введите текст..." readOnly />
            </Form.Item>
            <Form.Item label="Страна (ENG)" name="countryEng">
              <Input placeholder="Введите текст..." readOnly />
            </Form.Item>
          </Flex>
          <Form.Item label="Индекс" name="postalCode">
            <Input placeholder="Введите текст..." readOnly />
          </Form.Item>
          <Form.Item label="Прочее" name="other">
            <Input placeholder="Введите текст..." value="other" readOnly />
          </Form.Item>
          <Form.Item name="details">
            <DetailsTable />
          </Form.Item>
        </Form>
      </ContentLayoutBody>
      <ContentLayoutFooter>{data?.personId}</ContentLayoutFooter>
    </div>
  );
};
