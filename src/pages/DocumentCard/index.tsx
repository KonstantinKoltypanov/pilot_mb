import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { ContentLayoutBody, ContentLayoutFooter } from "./ContentLayoutHelpers";
import {
  Flex,
  Form,
  Input,
  Typography,
  Spin,
  notification,
  DatePicker,
  Button,
} from "antd";
import { PeriodTable } from "./components/PeriodTable";
import { useDocumentResource } from "../../api/useDocumentResource/useDocumentResource";
import CheckCircleOutlined from "@ant-design/icons/lib/icons/CheckCircleOutlined";
import SyncOutlined from "@ant-design/icons/lib/icons/SyncOutlined";
import HistoryOutlined from "@ant-design/icons/lib/icons/HistoryOutlined";
import dayjs from "dayjs";

interface ContentLayoutProps {
  title?: string;
  hideFooter?: boolean;
  children?: React.ReactNode;
}

export const DocumentCard: React.FC<ContentLayoutProps> = (props) => {
  const { id } = useParams();
  const [form] = Form.useForm();

  const {
    getDocumentCardApi: { fetch, data, loading },
  } = useDocumentResource();

  useEffect(() => {
    if (id) {
      fetch({ id });
    }
  }, [id]);

  useEffect(() => {
    if (data) {
      form.setFieldsValue(data);
    }
  }, [data, form]);

  const { title = "Карточка документа", hideFooter = false } = props || {};

  const handleRefresh = () => {
    fetch({ id });
  };

  const handleOpenHistory = () => {
    if (id) {
      const historyUrl = `/document/${id}/history`;
      window.open(historyUrl, "_blank", "width=1200,height=800");
    }
  };


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
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography.Title level={3} style={{ margin: 0 }}>
          {data?.cardName && (
              <Typography.Title level={3} style={{ margin: 0 }}>
                {data?.cardName}
              </Typography.Title>
            )}
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
        <Form form={form} layout="horizontal">
          <Form.Item noStyle name="id"></Form.Item>
          <Form.Item label="Тип документа" name="documentType">
            <Input placeholder="Введите текст..." readOnly />
          </Form.Item>
          <Flex
            vertical={false}
            wrap="nowrap"
            justify="flex-start"
            align="flex-start"
            gap={8}
          >
            <Form.Item label="Серия" name="series">
              <Input placeholder="Введите текст..." readOnly />
            </Form.Item>
            <Form.Item label="Номер" name="number">
              <Input placeholder="Введите текст..." readOnly />
            </Form.Item>
          </Flex>
          <Form.Item label="Кем выдан" name="issuingAuthority">
            <Input placeholder="Введите текст..." readOnly />
          </Form.Item>
          <Flex
            vertical={false}
            wrap="nowrap"
            justify="flex-start"
            align="flex-start"
            gap={8}
          >
            <Form.Item label="Код подразделения" name="departmentCode">
              <Input placeholder="Введите текст..." readOnly />
            </Form.Item>
            <Form.Item label="Пол" name="gender">
              <Input placeholder="Введите текст..." readOnly />
            </Form.Item>
          </Flex>
          <Flex
            vertical={false}
            wrap="nowrap"
            justify="flex-start"
            align="flex-start"
            gap={8}
          >
            <Form.Item label="Страна рождения" name="birthCountry">
              <Input placeholder="Введите текст..." readOnly />
            </Form.Item>
            <Form.Item label="Место рождения" name="birthPlace">
              <Input placeholder="Введите текст..." readOnly />
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
              label="Дата выдачи"
              name="issueDate"
              getValueProps={(value) => {
                if (!value)return { value: dayjs('12.02.2023').format('DD.MM.YYYY') };
                if (dayjs.isDayjs(value)) {
                  return { value };
                }
                  return { value: dayjs(value).format('DD.MM.YYYY') };
              }}
            >
               <Input readOnly />
            </Form.Item>
            <Form.Item
              label="Дата окончания"
              name="expirationDate"
              getValueProps={(value) => {
                if (!value)return { value: dayjs('12.02.2023').format('DD.MM.YYYY') };
                if (dayjs.isDayjs(value)) {
                  return { value };
                }
                  return { value: dayjs(value).format('DD.MM.YYYY') };
              }}
            >
               <Input readOnly />
            </Form.Item>
          </Flex>
          <Flex
            vertical={false}
            wrap="nowrap"
            justify="flex-start"
            align="flex-start"
            gap={8}
          >
            <Form.Item label="Статус документа" name="documentStatus">
              <Input placeholder="Введите текст..." readOnly />
            </Form.Item>
             <Form.Item
              label="Дата отмены"
              name="cancellationDate"
              getValueProps={(value) => {
                if (!value)return { value: dayjs('12.02.2023').format('DD.MM.YYYY') };
                if (dayjs.isDayjs(value)) {
                  return { value };
                }
                  return { value: dayjs(value).format('DD.MM.YYYY') };
              }}
            >
               <Input readOnly />
            </Form.Item>
          </Flex>
          <Flex
            vertical={false}
            wrap="nowrap"
            justify="flex-start"
            align="flex-start"
            gap={12}
          >
            <SyncOutlined
            spin={loading}
              style={{ fontSize: 24, color: "blue" }}
              onClick={handleRefresh}
            />
          </Flex>
          <Form.Item label="Комментарий" name="comment">
            <Input placeholder="Введите текст..." readOnly />
          </Form.Item>
        </Form>

        <PeriodTable
          data={data && [{ validFrom: data.validFrom, validTo: data.validTo }]}
          loading={loading}
        />
      </ContentLayoutBody>
      {!hideFooter && (
        <ContentLayoutFooter>
          {data ? <Typography.Text>{data.personId}</Typography.Text> : null}
        </ContentLayoutFooter>
      )}
    </div>
  );
};
