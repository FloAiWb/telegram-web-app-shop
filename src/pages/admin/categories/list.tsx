// src/components/CategoriesList.tsx

import React, { useEffect } from "react";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import Container from "@components/container";
import useDeleteCategories from "@framework/api/categories/delete";
import { useGetCategories } from "@framework/api/categories/get";
import { TypeCategories } from "@framework/types";
import useTelegramUser from "@hooks/useTelegramUser";
import { Button, message, Modal, Space, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import t from "@/i18n/ru";

const { confirm } = Modal;

const CategoriesList: React.FC = () => {
  const { data, isLoading, isFetching, refetch } = useGetCategories({});
  const deleteMutation = useDeleteCategories();
  const { id: userId } = useTelegramUser();
  const navigate = useNavigate();

  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleDelete = (categoryId: number) => {
    deleteMutation.mutate(
      { category_id: categoryId, user_id: userId },
      {
        onSuccess: () => {
          message.success(t.categoryDeleted);
          refetch();
        },
        onError: (err: any) => {
          if (err.response?.status !== 404) {
            message.error(t.categoryDeleteError);
            refetch();
          } else {
            window.location.reload();
          }
        }
      }
    );
  };

  const showDeleteConfirm = (categoryId: number) => {
    confirm({
      title: t.confirmDeleteCategory,
      okType: "danger",
      okText: t.delete,
      cancelText: t.cancel,
      onOk() {
        handleDelete(categoryId);
      }
    });
  };

  const buildTree = (categories: TypeCategories[]): TypeCategories[] =>
    categories.map((cat) => ({
      ...cat,
      key: cat.category_Id,
      children:
        cat.children && cat.children.length > 0
          ? buildTree(cat.children)
          : undefined
    }));

  const dataSource = data ? buildTree(data) : [];

  const columns: ColumnsType<TypeCategories> = [
    {
      title: t.name,
      dataIndex: "category_Name",
      key: "name",
      render: (text) => <span>{text}</span>
    },
    {
      title: t.actions,
      key: "action",
      render: (_, record) => (
        <Space size="small">
          <Link
            state={record}
            to={`/admin/categories/edit/${record.category_Id}`}
          >
            <EditOutlined />
          </Link>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => showDeleteConfirm(record.category_Id)}
          />
          <Link to={`/admin/categories/${record.category_Id}`}>
            {t.addSubcategory}
          </Link>
        </Space>
      )
    }
  ];

  return (
    <Container
      backwardUrl="/admin"
      customButton
      customButtonTitle={t.add}
      customButtonOnClick={() => navigate("/admin/categories/null")}
      title={t.categories}
    >
      <Table
        columns={columns}
        loading={isLoading || isFetching}
        dataSource={dataSource}
      />
    </Container>
  );
};

export default CategoriesList;
