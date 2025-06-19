// src/components/NotFoundPage.tsx

import React from "react";
import { Button, Divider } from "antd";
import { useNavigate } from "react-router-dom";
import t from "@/i18n/ru";

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      className="flex h-[88vh] flex-col justify-center gap-10 rounded-lg
                 border border-[var(--tg-theme-button-color)] p-6 text-center"
    >
      {/* Код ошибки */}
      <div className="text-[50px] font-bold">{t.notFoundTitle}</div>

      <Divider />

      {/* Описание */}
      <div className="text-base">{t.notFoundDescription}</div>

      {/* Кнопка возврата */}
      <Button type="primary" onClick={() => navigate("/")}>
        {t.back}
      </Button>
    </div>
  );
};

export default NotFoundPage;
