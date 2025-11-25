import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Select } from "antd";
import type { ContactDTO } from "../../api/useContactResource/interfaces";
import { useReferenceResource } from "../../../../api/useReferenceResource/useReferenceResource";

interface PhoneModalProps {
  open: boolean;
  onClose: () => void;
  data?: ContactDTO;
}

interface ReferenceItem {
  mnemocode: string;
  nameRu: string;
}

export const PhoneModal: React.FC<PhoneModalProps> = ({
  open,
  onClose,
  data,
}) => {
  const [form] = Form.useForm();
  const { getCountryApi } = useReferenceResource();
  const [countryCodes, setCountryCodes] = useState<ReferenceItem[]>([]);

  useEffect(() => {
    const loadCountryCodes = async () => {
      try {
        const countriesData = await getCountryApi.fetch();
        setCountryCodes(
          Array.isArray(countriesData)
            ? countriesData
            : countriesData?.data || []
        );
      } catch (error) {
        console.error("Ошибка загрузки справочника кодов стран:", error);
      }
    };

    if (open) {
      loadCountryCodes();
    }
  }, [open, getCountryApi.fetch]);

  useEffect(() => {
    if (data && open) {
      let fullPhone = "";
      if (data.countryCode) {
        fullPhone += `+${data.countryCode}`;
      }
      if (data.code) {
        fullPhone += `(${data.code})`;
      }
      if (data.phoneNumber) {
        fullPhone += ` ${data.phoneNumber}`;
      }
      if (data.extension) {
        fullPhone += ` доб. ${data.extension}`;
      }

      form.setFieldsValue({
        phone: fullPhone.trim() || "",
        countryCode: data.countryCode || "",
        code: data.code || "",
        phoneNumber: data.phoneNumber || "",
        extension: data.extension || "",
        comment: data.comment || "",
        organization: data.organization || "",
      });
    }
  }, [data, open, form]);

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title="Телефон"
      open={open}
      onCancel={handleClose}
      footer={
        <button
          onClick={handleClose}
          style={{
            backgroundColor: "#1890ff",
            color: "white",
            border: "none",
            padding: "4px 15px",
            borderRadius: "2px",
            cursor: "pointer",
          }}
        >
          Закрыть
        </button>
      }
      width={600}
    >
      <Form form={form} layout="vertical">
        <Form.Item label="Телефон" name="phone">
          <Input placeholder="Полный номер телефона" disabled />
        </Form.Item>
        <Form.Item label="Код страны" name="countryCode">
          <Select
            placeholder="Выберите код страны..."
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
            {countryCodes.map((item) => {
              if (!item.mnemocode) return null;
              return (
                <Select.Option key={item.mnemocode} value={item.mnemocode}>
                  {item.nameRu || item.mnemocode}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item label="Код" name="code">
          <Input placeholder="Введите код города или оператора..." />
        </Form.Item>
        <Form.Item label="Номер" name="phoneNumber">
          <Input placeholder="Введите номер телефона..." />
        </Form.Item>
        <Form.Item label="Добавочный" name="extension">
          <Input placeholder="Введите добавочный номер..." />
        </Form.Item>
        <Form.Item label="Комментарий" name="comment">
          <Input placeholder="Введите комментарий..." />
        </Form.Item>
        <Form.Item label="Организация" name="organization">
          <Select
            placeholder="Выберите организацию..."
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
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

