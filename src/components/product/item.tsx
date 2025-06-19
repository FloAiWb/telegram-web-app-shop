// src/components/ProductItem.tsx

import React from "react";
import { addCommas } from "@persian-tools/persian-tools";
import { useNavigate } from "react-router-dom";
import t from "@/i18n/ru";

interface Props {
  url: string;
  title: string;
  price: number;
  quantity: number;
  imageURL: string | Array<string>;
  pageType: "admin" | "user";
  discountedPrice: number;
}

function ProductItem({
  url,
  title,
  price,
  quantity,
  imageURL,
  pageType,
  discountedPrice
}: Props) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(url);
  };

  // вычисляем процент скидки, если он есть
  const discountPercent =
    discountedPrice !== price
      ? Math.round(100 - (discountedPrice * 100) / price)
      : 0;

  return (
    <div
      onClick={handleClick}
      className={`flex h-[120px] w-full overflow-hidden rounded-lg border-2
        border-[var(--tg-theme-secondary-bg-color)]
        ${discountPercent ? "border-red-700/70" : ""}`}
      role="button"
      tabIndex={0}
      onKeyPress={handleClick}
    >
      {/* Левая часть: информация о товаре */}
      <div className="flex w-2/3 flex-col justify-between p-2">
        {/* Название */}
        <p className="select-none text-right font-medium">{title}</p>

        {/* Цены и количество */}
        <div className="flex flex-col gap-1">
          {/* Обычная цена */}
          <div
            className={`flex justify-end gap-1 text-right
              ${discountPercent ? "text-sm text-gray-500 line-through" : ""}`}
          >
            <span>{t.currency}</span>
            <span>{addCommas(price)}</span>
          </div>

          {/* Цена со скидкой */}
          {discountPercent > 0 && (
            <div className="flex justify-end gap-1 text-right font-semibold">
              <span>{t.currency}</span>
              <span>{addCommas(discountedPrice)}</span>
            </div>
          )}

          {/* Процент скидки */}
          {discountPercent > 0 && (
            <div className="flex justify-end gap-1 text-right text-sm text-red-600">
              {discountPercent}% {t.discountPercent}
            </div>
          )}

          {/* Количество (для админа) */}
          {pageType === "admin" && (
            <div className="flex justify-end gap-1 text-right text-sm text-gray-600">
              <span>{t.qty}</span>
              <span>{quantity}</span>
            </div>
          )}
        </div>
      </div>

      {/* Правая часть: изображение */}
      <div
        className="relative w-1/3 bg-[var(--tg-theme-secondary-bg-color)] bg-cover bg-center"
        style={{
          backgroundImage: `url('${import.meta.env.VITE_API_URL}/${imageURL}')`
        }}
      >
        {/* В рамке показываем процент */}
        {discountPercent > 0 && (
          <span className="absolute right-0 top-0 rounded-bl-lg bg-red-700 p-2 text-white text-sm">
            {discountPercent}% 
          </span>
        )}
      </div>
    </div>
  );
}

export default ProductItem;
