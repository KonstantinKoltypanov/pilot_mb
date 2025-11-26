import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Spin } from "antd";
import type { ContactDTO } from "../../api/useContactResource/interfaces";
import { useReferenceResource } from "../../../../api/useReferenceResource/useReferenceResource";
import { useContactResource } from "../../api/useContactResource/useContactResource";

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
  const { getContactCardApi } = useContactResource();
  const [countryCodes, setCountryCodes] = useState<ReferenceItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadCountryCodes = async () => {
      try {
        const countriesData = await getCountryApi.fetch();
        setCountryCodes(
          Array.isArray(countriesData)
            ? countriesData
            : countriesData?.data || [],
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
    const loadContactCard = async () => {
      if (!data?.id || !open) return;

      setLoading(true);
      try {
        const contactCard = await getContactCardApi.fetch({
          id: data.id,
        });

        if (contactCard) {
          let fullPhone = "";
          if (contactCard.countryCode) {
            fullPhone += `+${contactCard.countryCode}`;
          }
          if (contactCard.telephone) {
            fullPhone += ` ${contactCard.telephone}`;
          }
          if (contactCard.extension) {
            fullPhone += ` доб. ${contactCard.extension}`;
          }

          form.setFieldsValue({
            phone: fullPhone.trim() || contactCard.telephone || "",
            countryCode: contactCard.countryCode || "",
            phoneNumber: contactCard.phoneNumber || "",
            extension: contactCard.extension || "",
            comment: contactCard.comment || "",
            organization: contactCard.organization || "",
          });
        }
      } catch (error) {
        console.error("Ошибка загрузки карточки контакта:", error);
        // Fallback на данные из props, если запрос не удался
        if (data) {
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
      <Spin spinning={loading}>
        <Form form={form} layout="vertical">
          <Form.Item label="Телефон" name="phone">
            <Input placeholder="Полный номер телефона" readOnly />
          </Form.Item>
          <Form.Item label="Код страны" name="countryCode">
            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) =>
                prevValues?.countryCode !== currentValues?.countryCode
              }
            >
              {({ getFieldValue }) => {
                const countryCode = getFieldValue("countryCode");
                const countryName = countryCode
                  ? countryCodes.find((item) => item.mnemocode === countryCode)
                      ?.nameRu || countryCode
                  : "";
                return (
                  <Input
                    placeholder="Код страны не указан"
                    readOnly
                    value={countryName}
                  />
                );
              }}
            </Form.Item>
          </Form.Item>
          <Form.Item label="Код" name="code">
            <Input placeholder="Введите код города или оператора..." readOnly />
          </Form.Item>
          <Form.Item label="Номер" name="phoneNumber">
            <Input placeholder="Введите номер телефона..." readOnly />
          </Form.Item>
          <Form.Item label="Добавочный" name="extension">
            <Input placeholder="Введите добавочный номер..." readOnly />
          </Form.Item>
          <Form.Item label="Комментарий" name="comment">
            <Input placeholder="Введите комментарий..." readOnly />
          </Form.Item>
          <Form.Item label="Организация" name="organization">
            <Input placeholder="Организация не указана" readOnly />
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};
