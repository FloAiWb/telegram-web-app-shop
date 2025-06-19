// src/components/UserProfileButtonMenu.tsx

import React from "react";
import { UnorderedListOutlined, UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import t from "@/i18n/ru";

const UserProfileButtonMenu: React.FC = () => (
  <div
    style={{ boxShadow: "0 0 10px -6px" }}
    className="mx-auto flex h-16 w-full max-w-[450px] justify-between rounded-t-lg border-b-2 border-[var(--tg-theme-button-color)] bg-[var(--tg-theme-bg-color)] p-2 shadow-lg"
  >
    <Link
      to="/bot"
      className="flex w-1/2 flex-col items-center justify-center gap-1"
    >
      <UserOutlined /> {t.botSettings}
    </Link>
    <Link
      to="/bot/masters"
      className="flex w-1/2 flex-col items-center justify-center gap-1"
    >
      <UnorderedListOutlined /> {t.masters}
    </Link>
  </div>
);

export default UserProfileButtonMenu;
