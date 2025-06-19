// src/components/EditProduct.tsx

import React, { useEffect, useState } from "react";
import Container from "@components/container";
import Discount from "@components/discount";
import { useGetCategories } from "@framework/api/categories/get";
import { useGetProductsById } from "@framework/api/product/get-by-id";
import useUpdateProduct from "@framework/api/product/update";
import useDeleteProduct from "@framework/api/product/delete";
import useAddProductImage from "@framework/api/photos-upload/add";
import useTelegramUser from "@hooks/useTelegramUser";
import {
  Button,
  Form,
  Input,
  InputNumber,
  message,
  Popconfirm,
  Spin,
  TreeSelect
} from "antd";
import ImageUploading from "react-images-uploading";
import { useNavigate, useParams } from "react-router-dom";
import t from "@/i18n/ru";

const { TextArea } = Input;

const EditProduct: React.FC = () => {
  const { product_id } = useParams<{ product_id: string }>();
  const navigate = useNavigate();
  const { id: userId } = useTelegramUser();

  // Категории
  const {
    data: categories,
    isLoading: loadingCats,
    refetch: refetchCats,
    isFetching: fetchingCats
  } = useGetCategories({});

  // Товар
  const {
    data: productData,
    isLoading: loadingProduct,
    isFetching: fetchingProduct,
    refetch: refetchProduct
  } = useGetProductsById({ product_id });

  // Мутации
  const updateProduct = useUpdateProduct({ product_id });
  const deleteProduct = useDeleteProduct();
  const uploadPhoto = useAddProductImage();

  // Форма и стейты
  const [form] = Form.useForm();
  const [images, setImages] = useState<any[]>([]);
  const [imageLinks, setImageLinks] = useState<string[]>([]);
  const [disabled, setDisabled] = useState<boolean>(true);

  useEffect(() => {
    refetchCats();
    refetchProduct();
  }, [refetchCats, refetchProduct]);

  // Блокируем ui пока товар загружается
  useEffect(() => {
    setDisabled(loadingProduct || fetchingProduct);
  }, [loadingProduct, fetchingProduct]);

  // После загрузки товара заполняем изображения
  useEffect(() => {
    if (!disabled) {
      setImageLinks(productData?.photos || []);
    }
  }, [disabled, productData]);

  // Обработка загрузки новых фото
  const onChangeImage = async (list: any[]) => {
    setImages(list);
    for (const img of list) {
      const base64 = img.data_url.split(",")[1];
      uploadPhoto.mutate(
        { photo_base64: base64 },
        {
          onSuccess: (res) => setImageLinks((prev) => [...prev, res.data]),
          onError: () => message.error(t.productImageUploadError)
        }
      );
    }
  };

  const removeImage = (idx: number) => {
    setImageLinks((prev) => prev.filter((_, i) => i !== idx));
  };

  // Сохранение изменений
  const onFinish = (values: any) => {
    updateProduct.mutate(
      {
        user_id: userId.toString(),
        product_name: values.product_name,
        category_ids: Array.isArray(values.category_ids)
          ? values.category_ids
          : values.category_ids
          ? [values.category_ids]
          : [],
        price: values.price,
        quantity: values.quantity,
        description: values.description,
        photos: imageLinks
      },
      {
        onSuccess: () => {
          message.success(t.productUpdated);
          form.resetFields();
          navigate("/admin/products");
        },
        onError: () => message.error(t.productUpdateError)
      }
    );
  };

  // Удаление товара
  const handleDelete = () => {
    deleteProduct.mutate(
      { product_id, user_id: userId.toString() },
      {
        onSuccess: () => {
          message.success(t.productDeleted);
          navigate("/admin/products");
        },
        onError: () => message.error(t.productDeleteError)
      }
    );
  };

  return (
    <Container backwardUrl="/admin/products" title={t.editProduct}>
      <Spin spinning={disabled} tip={t.loading}>
        {!disabled && (
          <>
            <Form
              form={form}
              layout="horizontal"
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 20 }}
              initialValues={{
                product_name: productData?.product_Name,
                category_ids: productData?.categoryIds,
                price: productData?.price,
                quantity: productData?.quantity,
                description: productData?.description
              }}
              disabled={disabled}
              onFinish={onFinish}
            >
              {/* Название */}
              <Form.Item
                name="product_name"
                label={t.productName}
                rules={[{ required: true, message: t.requiredField }]}
              >
                <Input placeholder={t.productNamePlaceholder} />
              </Form.Item>

              {/* Категория */}
              <Form.Item
                name="category_ids"
                label={t.category}
                rules={[{ required: true, message: t.requiredField }]}
              >
                <TreeSelect
                  showSearch
                  treeData={categories}
                  loading={loadingCats || fetchingCats}
                  placeholder={t.categoryPlaceholder}
                  fieldNames={{
                    label: "category_Name",
                    value: "category_Id",
                    children: "children"
                  }}
                  style={{ width: "100%" }}
                />
              </Form.Item>

              {/* Цена */}
              <Form.Item
                name="price"
                label={`${t.price} (${t.currency})`}
                rules={[{ required: true, message: t.requiredField }]}
              >
                <InputNumber
                  className="w-1/2"
                  formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  parser={(v) => v.replace(/,*/g, "")}
                  placeholder={t.pricePlaceholder}
                />
              </Form.Item>

              {/* Количество */}
              <Form.Item
                name="quantity"
                label={t.quantity}
                rules={[{ required: true, message: t.requiredField }]}
              >
                <InputNumber
                  className="w-1/2"
                  placeholder={t.quantityPlaceholder}
                />
              </Form.Item>

              {/* Описание */}
              <Form.Item
                name="description"
                label={t.description}
                rules={[{ required: true, message: t.requiredField }]}
              >
                <TextArea rows={6} placeholder={t.descriptionPlaceholder} />
              </Form.Item>

              {/* Фото */}
              <Form.Item
                name="photos"
                label={t.productImages}
                valuePropName="photos"
              >
                {uploadPhoto.isLoading ? (
                  <Spin tip={t.loading} />
                ) : (
                  <ImageUploading
                    value={images}
                    onChange={onChangeImage}
                    maxNumber={4}
                    dataURLKey="data_url"
                  >
                    {({
                      onImageUpload,
                      onImageRemoveAll,
                      isDragging,
                      dragProps
                    }) => (
                      <div className="flex flex-col gap-4">
                        <div className="flex gap-2 mb-4 h-[60px]">
                          <button
                            type="button"
                            onClick={onImageUpload}
                            {...dragProps}
                            style={isDragging ? { color: "red" } : undefined}
                            className="flex-1 border border-dashed p-2"
                          >
                            {t.addImages}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              onImageRemoveAll();
                              setImageLinks([]);
                            }}
                            className="w-32 bg-red-600 text-white"
                          >
                            {t.removeAllImages}
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-4 overflow-auto h-[240px]">
                          {imageLinks.map((link, idx) => (
                            <div key={idx} className="relative">
                              <img
                                src={`${import.meta.env.VITE_API_URL}/${link}`}
                                alt={t.productImageAlt}
                                className="w-full h-24 object-cover rounded"
                              />
                              <Button
                                danger
                                block
                                size="small"
                                onClick={() => removeImage(idx)}
                                className="mt-2"
                              >
                                {t.removeImage}
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </ImageUploading>
                )}
              </Form.Item>

              {/* Действия */}
              <div className="flex gap-3">
                <Popconfirm
                  title={t.confirmDeleteProduct}
                  onConfirm={handleDelete}
                  okText={t.delete}
                  cancelText={t.cancel}
                  okType="danger"
                >
                  <Button danger block>
                    {t.deleteProduct}
                  </Button>
                </Popconfirm>
                <Button type="primary" ghost htmlType="submit" block>
                  {t.save}
                </Button>
              </div>
            </Form>

            {/* Скидки */}
            <Discount
              type="product"
              id={product_id || ""}
              data={productData?.discount ?? null}
            />
          </>
        )}
      </Spin>
    </Container>
  );
};

export default EditProduct;
