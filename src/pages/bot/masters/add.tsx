// src/components/AddMaster.tsx

import React, { useState } from "react";
import Container from "@components/container";
import useAddMaster from "@framework/api/master/add";
import useAddMasterImage from "@framework/api/photos-upload/add-master";
import useTelegramUser from "@hooks/useTelegramUser";
import {
  Button,
  Form,
  Input,
  message,
  Spin
} from "antd";
import ImageUploading from "react-images-uploading";
import { useNavigate } from "react-router-dom";
import t from "@/i18n/ru";

const { TextArea } = Input;

const AddMaster: React.FC = () => {
  const [form] = Form.useForm();
  const [images, setImages] = useState<any[]>([]);
  const [imageLinks, setImageLinks] = useState<string[]>([]);
  const addMaster = useAddMaster();
  const uploadPhoto = useAddMasterImage();
  const { id: userId } = useTelegramUser();
  const navigate = useNavigate();

  const onChangeImage = async (imageList: any[]) => {
    setImages(imageList);
    for (const img of imageList) {
      const base64 = img.data_url.split(",")[1];
      uploadPhoto.mutate(
        { photo_base64: base64 },
        {
          onSuccess: (res) => setImageLinks((prev) => [...prev, res.data]),
          onError: () => message.error(t.imageUploadError)
        }
      );
    }
  };

  const removeImage = (idx: number) => {
    setImageLinks((prev) => prev.filter((_, i) => i !== idx));
  };

  const onFinish = (values: { name: string; last_Name: string; description: string }) => {
    addMaster.mutate(
      {
        name: values.name,
        last_Name: values.last_Name,
        description: values.description,
        photo_Path: imageLinks.join(","),
        user_Id: userId.toString()
      },
      {
        onSuccess: () => {
          message.success(t.masterAdded);
          form.resetFields();
          setImages([]);
          setImageLinks([]);
          navigate(-1);
        },
        onError: () => {
          message.error(t.masterAddError);
        }
      }
    );
  };

  return (
    <Container backwardUrl={-1} title={t.addMaster}>
      <Form
        form={form}
        layout="horizontal"
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 20 }}
        onFinish={onFinish}
        className="flex flex-col h-full"
      >
        <Form.Item
          name="name"
          label={t.firstName}
          rules={[{ required: true, message: t.requiredField }]}
        >
          <Input placeholder={t.firstNamePlaceholder} />
        </Form.Item>

        <Form.Item
          name="last_Name"
          label={t.lastName}
          rules={[{ required: true, message: t.requiredField }]}
        >
          <Input placeholder={t.lastNamePlaceholder} />
        </Form.Item>

        <Form.Item
          name="description"
          label={t.description}
          rules={[{ required: true, message: t.requiredField }]}
        >
          <TextArea rows={4} placeholder={t.descriptionPlaceholder} />
        </Form.Item>

        <Form.Item
          name="photos"
          label={t.masterPhoto}
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
                      {t.addImage}
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
                          alt={t.masterPhotoAlt}
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

        <Button
          type="primary"
          htmlType="submit"
          loading={addMaster.isLoading}
          disabled={addMaster.isLoading}
          className="mt-auto w-full"
        >
          {t.save}
        </Button>
      </Form>
    </Container>
  );
};

export default AddMaster;
