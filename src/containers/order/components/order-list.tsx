// src/components/OrderList.tsx

import React from "react";
import { Order } from "@framework/types";
import { addCommas } from "@persian-tools/persian-tools";
import { Divider, List } from "antd";
import { Link } from "react-router-dom";
import t from "@/i18n/ru.json";

interface Props {
  loading: boolean;
  orders: Order | undefined;
}

const OrderList: React.FC<Props> = ({ loading, orders }) => {
  return (
    <>
      <List
        loading={loading}
        itemLayout="horizontal"
        dataSource={orders?.order_Items}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              title={
                <Link to={`/products/${item.product_Id}`}>
                  {t.productTitle}
                  <br />
                  {item.product_Name}
                </Link>
              }
            />

            <div className="flex flex-col gap-3">
              {/* Цена за единицу */}
              <div className="flex justify-end gap-1">
                <span>{addCommas(item.final_Price)}</span>
                <span>{t.currency}</span>
                <span>{t.unitPrice}</span>
              </div>

              {/* Количество */}
              <div className="flex justify-end gap-1">
                <span>{item.quantity}</span>
                <span>{t.qty}</span>
              </div>

              {/* Сумма по позиции */}
              <div className="flex justify-end gap-1">
                <span>{addCommas(item.final_Price * item.quantity)}</span>
                <span>{t.currency}</span>
                <span>{t.totalPriceLabel}</span>
              </div>
            </div>
          </List.Item>
        )}
      />

      {/* Итого по всем позициям */}
      <Divider>{t.total}</Divider>
      <div className="flex justify-end gap-1">
        <span>{addCommas(orders?.total_Price || 0)}</span>
        <span>{t.currency}</span>
      </div>
    </>
  );
};

export default OrderList;
