import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Spin } from "antd";
import type { ContactDTO } from "../../api/useContactResource/interfaces";
import { useContactResource } from "../../api/useContactResource/useContactResource";

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
  const { getContactCardApi } = useContactResource();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadContactCard = async () => {
      if (!data?.id || !open) return;

      setLoading(true);
      try {
        const contactCard = await getContactCardApi.fetch({
          id: data.id,
        });

        if (contactCard) {
          form.setFieldsValue({
            email: contactCard.email || "",
            comment: contactCard.comment || "",
            organization: contactCard.organization || "",
          });
        }
      } catch (error) {
        console.error("Ошибка загрузки карточки контакта:", error);
        // Fallback на данные из props, если запрос не удался
        if (data) {
          form.setFieldsValue({
            email: data.email || "",
            comment: data.comment || "",
            organization: data.organization || "",
          });
        }
      } finally {
        setLoading(false);
      }
    };

    loadContactCard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.id, open]);

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
      <Spin spinning={loading}>
        <Form form={form} layout="vertical">
          <Form.Item label="E-mail" name="email">
            <Input placeholder="E-mail не указан" readOnly />
          </Form.Item>
          <Form.Item label="Комментарий" name="comment">
            <Input placeholder="Комментарий не указан" readOnly />
          </Form.Item>
          <Form.Item label="Организация" name="organization">
            <Input placeholder="Организация не указана" readOnly />
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};
