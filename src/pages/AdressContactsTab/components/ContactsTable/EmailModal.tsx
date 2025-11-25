import React, { useEffect } from "react";
import { Modal, Form, Input, Select } from "antd";
import type { ContactDTO } from "../../api/useContactResource/interfaces";

interface EmailModalProps {
  open: boolean;
  onClose: () => void;
  data?: ContactDTO;
}

export const EmailModal: React.FC<EmailModalProps> = ({
  open,
  onClose,
  data,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (data && open) {
      form.setFieldsValue({
        email: data.email || "",
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
      title="E-mail"
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
        <Form.Item label="E-mail" name="email">
          <Input placeholder="Введите e-mail..." />
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

