// src/components/OrderListAdmin.tsx

import React from "react";
import Container from "@components/container";
import { useGetOrders } from "@framework/api/orders/get";
import { GetOrderStatus } from "@helpers/get-order-status";
import { addCommas } from "@persian-tools/persian-tools";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import moment from "moment";
import "moment/locale/ru";
import { Link } from "react-router-dom";
import t from "@/i18n/ru";

moment.locale("ru");

interface DataType {
  key: string;
  code: string;
  name: string;
  price: number;
  status: string;
  time: string;
  tracking_code?: string;
}

const OrderListAdmin: React.FC = () => {
  const { data, isLoading, isFetching } = useGetOrders();
  const orders = data?.orders || [];

  const dataSource: DataType[] = orders.map((item) => ({
    key: item.order_Id.toString(),
    code: item.order_Id.toString(),
    name: item.user_Full_Name,
    price: item.total_Price,
    status: item.order_Status,
    time: item.order_Date,
    tracking_code: item.tracking_Code
  }));

  const columns: ColumnsType<DataType> = [
    {
      title: t.orderNumber,
      dataIndex: "code",
      key: "code",
      width: "fit-content",
      render: (text, record) => (
        <Link
          to={`/admin/orders/${record.key}`}
          className="text-blue-[var(--tg-theme-button-color)]"
        >
          {text}#
        </Link>
      )
    },
    {
      title: t.userName,
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <Link
          to={`/admin/orders/${record.key}`}
          className="text-blue-[var(--tg-theme-button-color)]"
        >
          {text}
        </Link>
      )
    },
    {
      title: t.amount,
      dataIndex: "price",
      key: "price",
      render: (text, record) => (
        <Link
          to={`/admin/orders/${record.key}`}
          className="text-blue-[var(--tg-theme-button-color)]"
        >
          {addCommas(text || 0)}
        </Link>
      )
    },
    {
      title: t.status,
      dataIndex: "status",
      key: "status",
      render: (text) => <span>{GetOrderStatus(text)}</span>
    },
    {
      title: t.orderDate,
      dataIndex: "time",
      key: "time",
      render: (text) =>
        text ? (
          <span>{moment(text).format("DD.MM.YYYY")}</span>
        ) : (
          <span>{t.notAvailable}</span>
        )
    }
  ];

  return (
    <Container backwardUrl={-1} title={t.orderList}>
      <Table
        columns={columns}
        dataSource={dataSource}
        loading={isLoading || isFetching}
        scroll={{ x: 400 }}
        rowKey="key"
      />
    </Container>
  );
};

export default OrderListAdmin;
