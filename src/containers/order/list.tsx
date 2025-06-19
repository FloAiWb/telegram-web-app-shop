// src/components/OrderList.tsx

import React, { useEffect } from "react";
import Container from "@components/container";
import { useGetOrderByUser } from "@framework/api/orders/get-by-user";
import { GetOrderStatus } from "@helpers/get-order-status";
import useTelegramUser from "@hooks/useTelegramUser";
import { addCommas } from "@persian-tools/persian-tools";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import moment from "jalali-moment";
import { Link, useLocation } from "react-router-dom";
import t from "@/i18n/ru";

interface DataType {
  key: string;
  code: string;
  name: string;
  price: number;
  status: string;
  time: string;
  tracking_code?: string;
}

interface Props {
  type: "profile" | "user";
}

const OrderList: React.FC<Props> = ({ type }) => {
  const { id: userId } = useTelegramUser();
  const location = useLocation();
  const { data, isLoading, isFetching, refetch } = useGetOrderByUser({
    user_id: userId
  });

  useEffect(() => {
    refetch();
  }, [refetch, location]);

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
          to={`/${type}/orders/${record.key}`}
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
          to={`/${type}/orders/${record.key}`}
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
      render: (text) => addCommas(text || 0)
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
        text
          ? moment(text).locale("fa").format("YYYY/MM/DD")
          : t.notAvailable
    }
  ];

  return (
    <Container backwardUrl={-1} title={t.orderList}>
      <Table
        columns={columns}
        dataSource={dataSource}
        loading={isLoading || isFetching}
        rowKey="key"
        scroll={{ x: 400 }}
      />
    </Container>
  );
};

export default OrderList;
