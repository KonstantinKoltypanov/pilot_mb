import React, { useState } from "react";
import { Table } from "antd";
import { colDefs } from "./colDefs";
import type { ContactDTO } from "../../api/useContactResource/interfaces";
import { EmailModal } from "./EmailModal";
import { PhoneModal } from "./PhoneModal";

interface ContactsTableProps {
  data: ContactDTO[];
  loading: boolean;
}

export const ContactsTable: React.FC<ContactsTableProps> = ({
  data,
  loading,
}) => {
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [phoneModalOpen, setPhoneModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<ContactDTO | undefined>(
    undefined
  );

  const handleRowDoubleClick = (record: any) => {
    const fullContactData = data.find((item) => item.id === record.id) || record;
    
    if (!fullContactData) return;

    setSelectedContact(fullContactData);

    const contactType = record.type || fullContactData.contactType || fullContactData.type;
    
    if (contactType === "E-mail" || contactType === "Email" || contactType === "e-mail") {
      setEmailModalOpen(true);
    } else if (contactType === "Телефон" || contactType === "Phone" || contactType === "телефон") {
      setPhoneModalOpen(true);
    }
  };

  return (
    <>
      <Table
        size="middle"
        bordered
        rowKey={(record) => record.id || Math.random().toString()}
        loading={loading}
        columns={colDefs}
        dataSource={data}
        pagination={false}
        onRow={(record) => ({
          onDoubleClick: () => handleRowDoubleClick(record),
          style: { height: 48, cursor: "pointer" },
        })}
      />
      <EmailModal
        open={emailModalOpen}
        onClose={() => {
          setEmailModalOpen(false);
          setSelectedContact(undefined);
        }}
        data={selectedContact}
      />
      <PhoneModal
        open={phoneModalOpen}
        onClose={() => {
          setPhoneModalOpen(false);
          setSelectedContact(undefined);
        }}
        data={selectedContact}
      />
    </>
  );
};
