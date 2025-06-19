// src/components/SliderList.tsx

import React, { useEffect } from "react";
import { DeleteOutlined } from "@ant-design/icons";
import Container from "@components/container";
import useDeleteSlider from "@framework/api/slider/delete";
import { useGetSliders } from "@framework/api/slider/get";
import useTelegramUser from "@hooks/useTelegramUser";
import { Button, message, Popconfirm, Space, Table } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import t from "@/i18n/ru";

interface SliderItem {
  id: string;
  url: string;
  photo_Path: string;
}

const SliderList: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data, isFetching, isLoading, refetch } = useGetSliders();
  const deleteMutation = useDeleteSlider();
  const { id: userId } = useTelegramUser();

  useEffect(() => {
    refetch();
  }, [location, refetch]);

  const handleDeleteSlide = (slideId: string) => {
    deleteMutation.mutate(
      { master_id: slideId, user_id: userId },
      {
        onSuccess: () => {
          message.success(t.sliderDeleted);
          refetch();
        },
        onError: () => {
          message.error(t.sliderDeleteError);
          refetch();
        }
      }
    );
  };

  const dataSource = data?.map((item: SliderItem) => ({
    key: item.id,
    ...item
  })) || [];

  const columns = [
    {
      title: t.image,
      dataIndex: "photo_Path",
      key: "photo",
      render: (_: any, record: SliderItem) => (
        <img
          src={`${import.meta.env.VITE_API_URL}/${record.photo_Path}`}
          alt={t.sliderImageAlt}
          className="h-16 object-cover"
        />
      )
    },
    {
      title: t.actions,
      key: "actions",
      render: (_: any, record: SliderItem) => (
        <Space size="small">
          <Popconfirm
            title={t.confirmDeleteSlide}
            onConfirm={() => handleDeleteSlide(record.id)}
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
      title={t.slider}
      backwardUrl="/admin"
      customButton
      customButtonTitle={t.add}
      customButtonOnClick={() => navigate("add")}
    >
      <Table
        loading={isFetching || isLoading || deleteMutation.isLoading}
        dataSource={dataSource}
        columns={columns}
      />
    </Container>
  );
};

export default SliderList;
