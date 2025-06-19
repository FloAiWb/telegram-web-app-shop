// src/components/AddSlider.tsx

import React, { useState } from "react";
import Container from "@components/container";
import useAddSlider from "@framework/api/slider/add";
import useAddSliderImage from "@framework/api/photos-upload/add-slider";
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

const AddSlider: React.FC = () => {
  const [images, setImages] = useState<any[]>([]);
  const [imageLinks, setImageLinks] = useState<string[]>([]);
  const addSlider = useAddSlider();
  const uploadImage = useAddSliderImage();
  const { id: userId } = useTelegramUser();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onChangeImage = async (imageList: any[]) => {
    setImages(imageList);
    for (const img of imageList) {
      const base64 = img.data_url.split(",")[1];
      uploadImage.mutate(
        { photo_base64: base64 },
        {
          onSuccess: (res) => {
            setImageLinks((prev) => [...prev, res.data]);
          },
          onError: () => {
            message.error(t.imageUploadError);
          }
        }
      );
    }
  };

  const removeImage = (idx: number) => {
    setImageLinks((prev) => prev.filter((_, i) => i !== idx));
  };

  const onFinish = (values: { url: string }) => {
    addSlider.mutate(
      {
        url: values.url || "",
        photo_Path: imageLinks.join(","),
        user_Id: userId.toString()
      },
      {
        onSuccess: () => {
          message.success(t.sliderAdded);
          form.resetFields();
          setImages([]);
          setImageLinks([]);
          navigate(-1);
        },
        onError: () => {
          message.error(t.sliderAddError);
        }
      }
    );
  };

  return (
    <Container backwardUrl={-1} title={t.addSlider}>
      <Form
        form={form}
        layout="horizontal"
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 20 }}
        onFinish={onFinish}
      >
        <Form.Item
          name="url"
          label={t.sliderUrlLabel}
          rules={[{ required: true, message: t.requiredField }]}
        >
          <Input placeholder={t.sliderUrlPlaceholder} />
        </Form.Item>

        <Form.Item
          name="photos"
          label={t.sliderImageLabel}
          valuePropName="photos"
        >
          {uploadImage.isLoading ? (
            <Spin tip={t.loading} />
          ) : (
            <ImageUploading
              value={images}
              onChange={onChangeImage}
              maxNumber={1}
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
                  <div className="grid grid-cols-1 gap-4 overflow-auto h-[240px]">
                    {imageLinks.map((link, idx) => (
                      <div key={idx} className="relative">
                        <img
                          src={`${import.meta.env.VITE_API_URL}/${link}`}
                          alt={t.sliderImageAlt}
                          className="w-full h-36 object-cover rounded"
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
          loading={addSlider.isLoading}
          disabled={addSlider.isLoading}
          className="mt-auto w-full"
        >
          {t.save}
        </Button>
      </Form>
    </Container>
  );
};

export default AddSlider;
