// src/components/AppHeader.tsx

import React from "react";
import { ShoppingCartOutlined, UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import t from "@/i18n/ru";

const AppHeader: React.FC = () => {
  return (
    <div className="flex w-full items-center justify-between rounded-lg">
      <Link
        to="/cart"
        className="flex items-center gap-2 rounded-lg bg-[var(--tg-theme-secondary-bg-color)] p-3"
      >
        <ShoppingCartOutlined style={{ fontSize: 22 }} />
        <span>{t.myCart}</span>
      </Link>

      <Link
        to="/profile/home"
        className="flex items-center gap-2 rounded-lg bg-[var(--tg-theme-secondary-bg-color)] p-3"
      >
        <span>{t.userAccount}</span>
        <UserOutlined style={{ fontSize: 22 }} />
      </Link>
    </div>
  );
};

export default AppHeader;
