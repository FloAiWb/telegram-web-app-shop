// src/components/CategoriesEdit.tsx

import React from "react";
import Container from "@components/container";
import Discount from "@components/discount";
import { useGetCategories } from "@framework/api/categories/get";
import useUpdateCategory from "@framework/api/categories/update";
import { TypeCategories } from "@framework/types";
import useTelegramUser from "@hooks/useTelegramUser";
import {
  Button,
  Cascader,
  Form,
  Input,
  message,
  Spin
} from "antd";
import {
  useLocation,
  useNavigate,
  useParams
} from "react-router-dom";
import t from "@/i18n/ru";

interface FormValues {
  name: string;
  categories?: number[];
}

const CategoriesEdit: React.FC = () => {
  const { cat_id } = useParams<{ cat_id: string }>();
  const location = useLocation<{ category_Name: string; parent_Id?: number }>();
  const [form] = Form.useForm<FormValues>();
  const { id: userId } = useTelegramUser();
  const navigate = useNavigate();

  const { data: allCategories, isLoading: loadingAll } = useGetCategories({});
  const {
    data: currentCatData,
    isLoading: loadingCurrent
  } = useGetCategories({ category_id: cat_id });
  const isLoading = loadingAll || loadingCurrent;

  const mutation = useUpdateCategory({ category_id: cat_id || "" });

  const removeSelf = (
    categories: TypeCategories[]
  ): TypeCategories[] =>
    categories.map((cat) => {
      if (cat.category_Id.toString() === cat_id) {
        return { ...cat, disabled: true };
      }
      if (cat.children) {
        return { ...cat, children: removeSelf(cat.children) };
      }
      return cat;
    });

  const handleFinish = ({ name, categories }: FormValues) => {
    mutation.mutate(
      {
        user_id: userId.toString(),
        category_name: name,
        parent_id:
          categories?.slice(-1)[0] ?? location.state.parent_Id ?? null
      },
      {
        onSuccess: () => {
          message.success(t.categoryUpdated);
          form.resetFields();
          navigate("/admin/categories");
        },
        onError: () => {
          message.error(t.categoryUpdateError);
        }
      }
    );
  };

  return (
    <Container title={t.editCategory} backwardUrl={-1}>
      <Spin spinning={isLoading} tip={t.loading}>
        {!isLoading && (
          <Form
            form={form}
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 20 }}
            layout="horizontal"
            initialValues={{
              name: location.state.category_Name,
              categories: location.state.parent_Id
                ? [location.state.parent_Id]
                : []
            }}
            className="flex h-full flex-col"
            onFinish={handleFinish}
          >
            <Form.Item
              name="name"
              label={t.categoryName}
              rules={[{ required: true, message: t.requiredField }]}
            >
              <Input placeholder={t.categoryNamePlaceholder} />
            </Form.Item>

            <Form.Item name="categories" label={t.categoryParent}>
              <Cascader
                options={removeSelf(allCategories || [])}
                fieldNames={{
                  label: "category_Name",
                  value: "category_Id",
                  children: "children"
                }}
                changeOnSelect
                disabled={isLoading}
                style={{ width: "100%" }}
              />
            </Form.Item>

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

            <Divider className="my-4" />

            <Discount
              type="category"
              id={cat_id || ""}
              data={currentCatData?.[0]?.discount ?? null}
            />
          </Form>
        )}
      </Spin>
    </Container>
  );
};

export default CategoriesEdit;
