// src/components/Discount.tsx

import React, { useState } from "react";
import useTelegramUser from "@hooks/useTelegramUser";
import useAddDiscounts from "@framework/api/discount/add";
import useDeleteDiscount from "@framework/api/discount/delete";
import useUpdateDiscount from "@framework/api/discount/update";
import { TypeDiscount } from "@framework/types";

import {
  Alert,
  Button,
  Divider,
  Form,
  InputNumber,
  message,
  Popconfirm
} from "antd";
import { DatePicker } from "antd";
// и убедитесь, что ConfigProvider.locale={ru_RU} охватывает все DatePicker’ы

import type { RangePickerProps } from "antd/es/date-picker";

import dayjs from "dayjs";
import moment from "jalali-moment";

import t from "@/i18n/ru";

interface Props {
  type: "product" | "category";
  id: string;
  data: TypeDiscount | null;
}

function Discount({ type, id, data }: Props) {
  const { id: userId } = useTelegramUser();
  const addMutation = useAddDiscounts();
  const updateMutation = useUpdateDiscount({
    discount_id: data?.discount_Id || ""
  });
  const deleteMutation = useDeleteDiscount();

  const [checked, setChecked] = useState(false);

  useJalaliLocaleListener();

  const disabledDate: RangePickerProps["disabledDate"] = (current) =>
    current && current < dayjs().endOf("day");

  const handleDeleteDiscount = () => {
    deleteMutation.mutate(
      {
        discount_id: data?.discount_Id || "",
        user_id: userId.toString()
      },
      {
        onSuccess: () => {
          message.success(t.deleteSuccess);
          window.location.reload();
        },
        onError: () => {
          message.error(t.deleteError);
        }
      }
    );
  };

  const onFinish = ({
    percent,
    discount_start_date,
    discount_end_date
  }: {
    percent: number;
    discount_start_date: any;
    discount_end_date: any;
  }) => {
    const payload = {
      category_id: type === "category" ? parseInt(id, 10) : null,
      product_id: type === "product" ? parseInt(id, 10) : null,
      discount_type: "percent",
      discount_value: percent,
      discount_start_date: moment(discount_start_date.$d).format(),
      discount_end_date: moment(discount_end_date.$d).format(),
      user_id: userId.toString()
    };

    const mutation = data ? updateMutation : addMutation;
    mutation.mutate(payload, {
      onSuccess: () => {
        message.success(t.saveSuccess);
      },
      onError: () => {
        message.error(t.saveError);
      }
    });
  };

  return (
    <div>
      <Divider>{t.discounts}</Divider>

      <Form
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 20 }}
        initialValues={{
          percent: data?.discount_Value,
          discount_start_date: data
            ? dayjs(data.discount_Start_Date)
            : null,
          discount_end_date: data ? dayjs(data.discount_End_Date) : null
        }}
        layout="horizontal"
        className="flex w-full flex-col justify-center gap-4"
        onFinish={onFinish}
      >
        <Alert
          type="info"
          message={t.discountInfo}
          showIcon
        />

        <Form.Item name="percent" required label={t.percent}>
          <InputNumber min={1} max={100} addonAfter="%" required />
        </Form.Item>

        <Form.Item
          name="discount_start_date"
          required
          label={t.fromDate}
        >
          <DatePicker />
        </Form.Item>

        <Form.Item
          name="discount_end_date"
          required
          label={t.toDate}
        >
          <DatePicker disabledDate={disabledDate} />
        </Form.Item>

        <div className="flex gap-3">
          {data && (
            <Popconfirm
              placement="top"
              title={t.deleteDiscountConfirm}
              onConfirm={handleDeleteDiscount}
              okText={t.delete}
              cancelText={t.cancel}
            >
              <Button
                danger
                loading={deleteMutation.isLoading}
                block
              >
                {t.delete}
              </Button>
            </Popconfirm>
          )}

          <Button
            type="primary"
            ghost
            htmlType="submit"
            loading={addMutation.isLoading || updateMutation.isLoading}
            block
          >
            {t.save}
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default Discount;
