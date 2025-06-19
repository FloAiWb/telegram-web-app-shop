// src/components/CustomerDetail.tsx

import React from "react";
import { List } from "antd";
import moment from "moment";
import "moment/locale/ru";
import t from "@/i18n/ru";

moment.locale("ru");

interface Props {
  orders: {
    receipt_Photo?: string;
    user_Full_Name?: string;
    full_Address?: string;
    tracking_Code?: string;
    order_Date?: string;
  } | null;
}

const CustomerDetail: React.FC<Props> = ({ orders }) => {
  const photoUrl = orders?.receipt_Photo
    ? `${import.meta.env.VITE_API_URL}/${orders.receipt_Photo}`
    : "";

  return (
    <List className="w-full" bordered>
      {/* Фото чека */}
      <List.Item>
        <List.Item.Meta
          title={t.receiptPhotoTitle}
          description={
            <div className="flex w-full items-center justify-center">
              {photoUrl ? (
                <img
                  className="h-[120px] object-contain"
                  src={photoUrl}
                  alt={t.receiptPhotoAlt}
                />
              ) : (
                <span>{t.notAvailable}</span>
              )}
            </div>
          }
        />
      </List.Item>

      {/* Имя пользователя */}
      <List.Item>
        <List.Item.Meta
          title={t.userNameTitle}
          description={orders?.user_Full_Name || t.notAvailable}
        />
      </List.Item>

      {/* Адрес */}
      <List.Item>
        <List.Item.Meta
          title={t.addressTitle}
          description={orders?.full_Address || t.notAvailable}
        />
      </List.Item>

      {/* Код отслеживания */}
      <List.Item>
        <List.Item.Meta
          title={t.trackingCodeTitle}
          description={orders?.tracking_Code || t.notAvailable}
        />
      </List.Item>

      {/* Дата заказа */}
      <List.Item>
        <List.Item.Meta
          title={t.orderDateTitle}
          description={
            orders?.order_Date ? (
              moment(orders.order_Date).format("DD.MM.YYYY")
            ) : (
              t.notAvailable
            )
          }
        />
      </List.Item>
    </List>
  );
};

export default CustomerDetail;
