// src/components/ProductNews.tsx

import React from "react";
import Card from "@components/product/card";
import ProductCardSkeleton from "@components/skeleton/product-card";
import { useGetProducts } from "@framework/api/product/get";
import { Divider } from "antd";
import t from "@/i18n/ru";

const ProductNews: React.FC = () => {
  const { data, isLoading, isFetching } = useGetProducts({
    limit: 6,
    sortBy: "Updated_At"
  });

  return (
    <div className="flex flex-col gap-3">
      {/* Заголовок секции */}
      <Divider className="my-0 p-0">{t.newProducts}</Divider>

      {/* Сетка карточек */}
      <div className="grid grid-cols-2 gap-2">
        {(isLoading || isFetching) ? (
          // Показываем скелетоны во время загрузки
          <>
            {[...Array(6)].map((_, idx) => (
              <ProductCardSkeleton key={idx} delay={idx} />
            ))}
          </>
        ) : (
          // Карточки товаров
          data?.products.map((item) => (
            <Card
              key={`p-${item.product_Id}`}
              url={`/products/${item.product_Id}`}
              title={item.product_Name}
              price={item.price}
              discountedPrice={item.discountedPrice}
              quantity={item.quantity}
              imageURL={item.photo_path}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ProductNews;
