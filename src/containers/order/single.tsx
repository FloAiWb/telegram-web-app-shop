// src/components/OrdersSingle.tsx

import React from "react";
import Container from "@components/container";
import { useGetOrderById } from "@framework/api/orders/getById";
import { Tabs } from "antd";
import { useParams } from "react-router-dom";
import t from "@/i18n/ru";

import CustomerDetail from "./components/CustomerDetail";
import OrderList from "./components/OrderList";
import OrderSetting from "./components/OrderSetting";

interface Props {
  type: "admin" | "user";
}

const OrdersSingle: React.FC<Props> = ({ type }) => {
  const { order_id } = useParams<{ order_id: string }>();
  const { data, isLoading } = useGetOrderById({ order_Id: order_id || "" });
  const order = data?.order;

  const tabs = [
    {
      label: t.tabOrderItems,
      key: "1",
      children: <OrderList orders={order} loading={isLoading} />
    },
    {
      label: t.tabCustomerInfo,
      key: "2",
      children: <CustomerDetail orders={order} />
    },
    {
      label: t.tabOrderSettings,
      key: "3",
      children: <OrderSetting orders={order} />
    }
  ];

  return (
    <Container title={t.order} backwardUrl={-1}>
      <Tabs
        items={type === "user" ? tabs.slice(0, 2) : tabs}
        defaultActiveKey="1"
      />
    </Container>
  );
};

export default OrdersSingle;
