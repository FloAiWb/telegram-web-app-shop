// src/components/CategoriesAdd.tsx

import React from "react";
import Container from "@components/container";
import useAddCategories from "@framework/api/categories/add";
import useTelegramUser from "@hooks/useTelegramUser";
import { Button, Form, Input, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import t from "@/i18n/ru";

interface FormValues {
  name: string;
  description?: string;
}

const CategoriesAdd: React.FC = () => {
  const [form] = Form.useForm<FormValues>();
  const mutation = useAddCategories();
  const { id: userId } = useTelegramUser();
  const { parentId } = useParams<{ parentId?: string }>();
  const navigate = useNavigate();

  const handleFinish = ({ name }: FormValues) => {
    mutation.mutate(
      {
        user_id: `${userId}`,
        category_name: name,
        parent_id: parentId ? parseInt(parentId, 10) : null
      },
      {
        onSuccess: () => {
          message.success(t.categoryAdded);
          form.resetFields();
          navigate("/admin/categories");
        },
        onError: () => {
          message.error(t.categoryAddError);
        }
      }
    );
  };

  return (
    <Container title={t.addCategory} backwardUrl={-1}>
      <Form
        form={form}
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 20 }}
        layout="horizontal"
        className="flex h-full flex-col"
        onFinish={handleFinish}
      >
        <Form.Item name="name" label={t.categoryName} rules={[{ required: true }]}>
          <Input placeholder={t.categoryNamePlaceholder} />
        </Form.Item>

        {/* Если нужно — раскомментируйте для описания */}
        {/* <Form.Item name="description" label={t.categoryDescription}>
          <Input.TextArea placeholder={t.categoryDescriptionPlaceholder} />
        </Form.Item> */}

        <Button
          type="primary"
          ghost
          size="large"
          htmlType="submit"
          loading={mutation.isLoading}
          disabled={mutation.isLoading}
          className="mt-auto w-full"
        >
          {t.save}
        </Button>
      </Form>
    </Container>
  );
};

export default CategoriesAdd;
