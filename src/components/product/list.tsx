// src/components/ProductList.tsx

import React, { useState } from "react";
import {
  FileDoneOutlined,
  ReloadOutlined,
  SlidersOutlined
} from "@ant-design/icons";
import { Button, Divider, Drawer, Empty, Input, Pagination, Select, Tree } from "antd";
import ProductsSkeleton from "@components/skeleton/products";
import ProductItem from "./item";
import { useGetCategories } from "@framework/api/categories/get";
import { useGetProducts } from "@framework/api/product/get";
import t from "@/i18n/ru";

interface Props {
  pageType: "admin" | "user";
}

export default function ProductList({ pageType }: Props) {
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryFilterId, setCategoryFilterId] = useState<number | undefined>(undefined);
  const [search, setSearch] = useState<string>();
  const [order, setOrder] = useState<"asc" | "desc">("desc");

  const {
    data,
    error,
    isLoading,
    isFetching,
    refetch
  } = useGetProducts({
    limit: 10,
    page: currentPage,
    categoryId: categoryFilterId,
    name: search,
    order
  });

  const {
    data: catData,
    isLoading: isCatLoading,
    isFetching: isCatFetching
  } = useGetCategories({});

  return (
    <div className="flex flex-col">
      {/* Поиск и фильтры */}
      <div className="flex flex-col items-end gap-2">
        <Input.Search
          loading={isLoading || isFetching}
          allowClear
          onSearch={(value) => {
            setSearch(value);
            refetch();
          }}
          placeholder={t.searchPlaceholder}
        />

        <div className="flex w-full items-center justify-between">
          <Select
            value={order}
            onChange={(val) => {
              setOrder(val);
              refetch();
            }}
            style={{ width: "200px" }}
            options={[
              { value: "asc", label: t.priceAsc },
              { value: "desc", label: t.priceDesc }
            ]}
          />

          <Button icon={<SlidersOutlined />} onClick={() => setOpen(true)}>
            {t.filters}
          </Button>
        </div>

        <Drawer
          title={t.filters}
          placement="bottom"
          height="90%"
          className="rounded-t-3xl"
          open={open}
          onClose={() => setOpen(false)}
          extra={
            <div className="flex gap-3">
              <Button
                danger
                block
                size="large"
                onClick={() => {
                  setCategoryFilterId(undefined);
                  refetch();
                  setOpen(false);
                }}
              >
                {t.reset}
              </Button>
              <Button
                type="primary"
                icon={<FileDoneOutlined />}
                block
                size="large"
                onClick={() => {
                  refetch();
                  setOpen(false);
                }}
              >
                {t.apply}
              </Button>
            </div>
          }
        >
          <Tree
            loading={isCatLoading || isCatFetching}
            checkable
            multiple
            selectable={false}
            defaultExpandAll
            fieldNames={{
              title: "category_Name",
              key: "category_Id",
              children: "children"
            }}
            treeData={catData}
            onCheck={(checkedKeys) => setCategoryFilterId(checkedKeys as number)}
            style={{ width: "100%" }}
          />
        </Drawer>
      </div>

      <Divider />

      {/* Список товаров */}
      <div className="flex flex-wrap gap-3 mb-10">
        {isLoading || isFetching ? (
          <ProductsSkeleton />
        ) : error ? (
          <div className="flex flex-col items-center gap-3 w-full">
            <span>{t.error}</span>
            <Button icon={<ReloadOutlined />} onClick={() => refetch()}>
              {t.retry}
            </Button>
          </div>
        ) : data?.products.length === 0 ? (
          <div className="flex justify-center w-full">
            <Empty description={t.noData} />
          </div>
        ) : (
          data.products.map((item) => (
            <ProductItem
              key={item.product_Id}
              url={
                pageType === "admin"
                  ? `/admin/products/${item.product_Id}`
                  : `/products/${item.product_Id}`
              }
              title={item.product_Name}
              price={item.price}
              discountedPrice={item.discountedPrice}
              quantity={item.quantity}
              imageURL={item.photo_path}
              pageType={pageType}
            />
          ))
        )}
      </div>

      {/* Пагинация */}
      <Pagination
        current={currentPage}
        pageSize={10}
        total={data?.totalRows}
        onChange={(page) => {
          setCurrentPage(page);
          refetch();
        }}
        showSizeChanger={false}
      />
    </div>
  );
}
