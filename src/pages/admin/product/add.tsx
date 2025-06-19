// src/components/AddProduct.tsx

import React, { useEffect, useState } from "react";
import Container from "@components/container";
import { useGetCategories } from "@framework/api/categories/get";
import useAddProduct from "@framework/api/product/add";
import useAddProductImage from "@framework/api/photos-upload/add";
import useTelegramUser from "@hooks/useTelegramUser";
import { TypeProductPost } from "@framework/types";
import {
  Button,
  Form,
  Input,
  InputNumber,
  message,
  Spin,
  TreeSelect
} from "antd";
import ImageUploading from "react-images-uploading";
import { useNavigate } from "react-router-dom";
import t from "@/i18n/ru";

const { TextArea } = Input;

const AddProduct: React.FC = () => {
  const [images, setImages] = useState<any[]>([]);
  const [imageLinks, setImageLinks] = useState<string[]>([]);
  const { data: categories, isLoading: loadingCats, refetch: refetchCats, isFetching: fetchingCats } = useGetCategories({});
  const addProduct = useAddProduct();
  const uploadPhoto = useAddProductImage();
  const { id: userId } = useTelegramUser();
  const [form] = Form.useForm<TypeProductPost>();
  const navigate = useNavigate();

  useEffect(() => {
    refetchCats();
  }, [refetchCats]);

  const onChangeImage = async (imageList: any[]) => {
    setImages(imageList);
    for (const img of imageList) {
      const base64 = img.data_url.split(",")[1];
      uploadPhoto.mutate(
        { photo_base64: base64 },
        {
          onSuccess: (res) => {
            setImageLinks((prev) => [...prev, res.data]);
          },
          onError: () => {
            message.error(t.productImageUploadError);
          }
        }
      );
    }
  };

  const handleRemoveImage = (index: number) => {
    setImageLinks((prev) => prev.filter((_, i) => i !== index));
  };

  const onFinish = (values: TypeProductPost) => {
    addProduct.mutate(
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
          message.success(t.productAdded);
          form.resetFields();
          setImages([]);
          setImageLinks([]);
          navigate("/admin/products");
        },
        onError: () => {
          message.error(t.productAddError);
        }
      }
    );
  };

  return (
    <Container backwardUrl={-1} title={t.addProduct}>
      <Form
        form={form}
        layout="horizontal"
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 20 }}
        onFinish={onFinish}
        className="flex flex-col h-full"
      >
        <Form.Item
          name="product_name"
          label={t.productName}
          rules={[{ required: true, message: t.requiredField }]}
        >
          <Input placeholder={t.productNamePlaceholder} />
        </Form.Item>

        <Form.Item
          name="category_ids"
          label={t.category}
          rules={[{ required: true, message: t.requiredField }]}
        >
          <TreeSelect
            showSearch
            treeData={categories}
            loading={loadingCats || fetchingCats}
            fieldNames={{
              label: "category_Name",
              value: "category_Id",
              children: "children"
            }}
            placeholder={t.categoryPlaceholder}
            style={{ width: "100%" }}
          />
        </Form.Item>

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

        <Form.Item
          name="quantity"
          label={t.quantity}
          rules={[{ required: true, message: t.requiredField }]}
        >
          <InputNumber className="w-1/2" placeholder={t.quantityPlaceholder} />
        </Form.Item>

        <Form.Item
          name="description"
          label={t.description}
          rules={[{ required: true, message: t.requiredField }]}
        >
          <TextArea rows={6} placeholder={t.descriptionPlaceholder} />
        </Form.Item>

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
                <div className="flex flex-col">
                  <div className="flex mb-4 h-[60px] gap-2">
                    <button
                      type="button"
                      style={isDragging ? { color: "red" } : undefined}
                      onClick={onImageUpload}
                      {...dragProps}
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
                          onClick={() => handleRemoveImage(idx)}
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

        <Button
          type="primary"
          htmlType="submit"
          loading={addProduct.isLoading}
          disabled={addProduct.isLoading}
          className="mt-auto w-full"
        >
          {t.save}
        </Button>
      </Form>
    </Container>
  );
};

export default AddProduct;
