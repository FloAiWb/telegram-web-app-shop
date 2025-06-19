// src/components/OrderSetting.tsx
import React, { useState } from "react";
import { Order } from "@framework/types";
import useUpdateOrder from "@framework/api/orders/update";
import useTelegramUser from "@hooks/useTelegramUser";
import { Button, Divider, Input, message, Radio } from "antd";
import type { RadioChangeEvent } from "antd/es/radio";
import t from "@/i18n/ru";

interface Props {
  orders: Order | undefined;
}

const OrderSetting: React.FC<Props> = ({ orders }) => {
  const mutation = useUpdateOrder({ order_id: orders?.order_Id || "" });
  const { id: userId } = useTelegramUser();

  const [status, setStatus] = useState<string>(orders?.order_Status || "");
  const [trackingCode, setTrackingCode] = useState<string>(
    orders?.tracking_Code || ""
  );

  const onChange = (e: RadioChangeEvent) => {
    setStatus(e.target.value);
  };

  const handleSubmitStatus = () => {
    mutation.mutate(
      {
        order_Status: status,
        tracking_Code: trackingCode,
        user_Id: userId.toString()
      },
      {
        onSuccess: () => {
          message.success(t.statusUpdated);
        },
        onError: () => {
          message.error(t.error);
        }
      }
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <Divider>{t.setOrderStatus}</Divider>

      <Radio.Group onChange={onChange} value={status}>
        <Radio.Button value="Pending">{t.pending}</Radio.Button>
        <Radio.Button value="Processing">{t.processing}</Radio.Button>
        <Radio.Button value="Packing">{t.packing}</Radio.Button>
        <Radio.Button value="CancelledByCustomer">
          {t.cancelledByCustomer}
        </Radio.Button>
        <Radio.Button value="CancelledDueToUnavailability">
          {t.cancelledDueToUnavailability}
        </Radio.Button>
        <Radio.Button value="CancelledByAdmin">
          {t.cancelledByAdmin}
        </Radio.Button>
        <Radio.Button value="Shipped">{t.shipped}</Radio.Button>
      </Radio.Group>

      <div className="flex flex-col">
        <label className="mb-1 text-right">{t.trackingCodeTitle}</label>
        <Input
          value={trackingCode}
          onChange={(e) => setTrackingCode(e.target.value)}
          placeholder={t.trackingCodePlaceholder}
        />
      </div>

      <Button
        type="primary"
        ghost
        size="large"
        loading={mutation.isLoading}
        onClick={handleSubmitStatus}
      >
        {t.save}
      </Button>
    </div>
  );
};

export default OrderSetting;
