// src/components/BotMastersList.tsx

import React, { useEffect } from "react";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import Container from "@components/container";
import { useGetMasters } from "@framework/api/master/get";
import useDeleteMaster from "@framework/api/master/delete";
import useTelegramUser from "@hooks/useTelegramUser";
import { Table, Space, Popconfirm, Button, message } from "antd";
import { useNavigate, useLocation, Link } from "react-router-dom";
import t from "@/i18n/ru";

interface MasterItem {
  id: string;
  name: string;
  last_Name: string;
}

const BotMastersList: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data, isLoading, isFetching, refetch } = useGetMasters();
  const deleteMaster = useDeleteMaster();
  const { id: userId } = useTelegramUser();

  useEffect(() => {
    refetch();
  }, [location, refetch]);

  const handleDelete = (masterId: string) => {
    deleteMaster.mutate(
      { master_id: masterId, user_id: userId },
      {
        onSuccess: () => {
          message.success(t.deleteMasterSuccess);
          refetch();
        },
        onError: () => {
          message.error(t.deleteMasterError);
          refetch();
        }
      }
    );
  };

  const dataSource = data?.map((item: MasterItem) => ({
    key: item.id,
    ...item,
    title: `${item.name} ${item.last_Name}`
  })) || [];

  const columns = [
    {
      title: t.masterName,
      dataIndex: "title",
      key: "name"
    },
    {
      title: t.actions,
      key: "actions",
      render: (_: any, record: MasterItem) => (
        <Space size="small">
          <Link to={record.id} state={record}>
            <EditOutlined title={t.edit} />
          </Link>
          <Popconfirm
            title={t.confirmDeleteMaster}
            onConfirm={() => handleDelete(record.id)}
            okText={t.delete}
            cancelText={t.cancel}
            okType="danger"
          >
            <Button type="link" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <Container
      title={t.masters}
      backwardUrl="/bot"
      customButton
      customButtonTitle={t.add}
      customButtonOnClick={() => navigate("add")}
    >
      <Table
        loading={isLoading || isFetching || deleteMaster.isLoading}
        dataSource={dataSource}
        columns={columns}
      />
    </Container>
  );
};

export default BotMastersList;
