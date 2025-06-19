// src/components/Card.tsx
import React from "react";
import { addCommas } from "@persian-tools/persian-tools";
import { Button, Divider } from "antd";
import { Link } from "react-router-dom";
import t from "@/i18n/ru";

interface Props {
  url: string;
  title: string;
  price: number;
  quantity: number;
  imageURL: string | [];
  discountedPrice: number;
}

function Card({
  url,
  title,
  price,
  quantity,
  imageURL,
  discountedPrice
}: Props) {
  // Вычисляем процент скидки, если он есть
  const discountPercent =
    discountedPrice !== price
      ? Math.round(100 - (discountedPrice * 100) / price)
      : 0;

  return (
    <Link
      to={url}
      className={`flex h-[300px] w-full flex-col overflow-hidden rounded-lg border-2
        border-[var(--tg-theme-secondary-bg-color)]
        ${discountPercent ? "border-red-700/70" : ""}`}
    >
      <div
        className="relative ml-auto h-[280px] w-full bg-[var(--tg-theme-secondary-bg-color)]
          bg-cover bg-no-repeat"
        style={{
          backgroundImage: `url('${import.meta.env.VITE_API_URL}/${imageURL}')`
        }}
      >
        {discountPercent > 0 && (
          <span className="absolute right-0 top-0 rounded-bl-lg bg-red-700 p-2 text-white text-sm">
            {discountPercent}% 
          </span>
        )}
      </div>

      <div className="flex h-full w-full flex-col justify-between gap-3 p-2">
        {/* Заголовок товара */}
        <div className="select-none text-right font-medium">{title}</div>

        {/* Цена и количество */}
        <div className="flex flex-col gap-1">
          <Divider className="my-0 py-0" />

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

          {/* Количество */}
          <div className="flex justify-end gap-1 text-right text-sm text-gray-600">
            <span>{t.qty}</span>
            <span>{quantity}</span>
          </div>
        </div>

        {/* Кнопка добавить в корзину */}
        <Button type="primary" block>
          {t.addToCart}
        </Button>
      </div>
    </Link>
  );
}

export default Card;
