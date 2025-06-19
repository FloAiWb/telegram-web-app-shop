// src/components/AdminMenu.tsx

import React from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import t from "@/i18n/ru";

const AdminMenu: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">{t.adminMenu}</h2>
      <Button block onClick={() => navigate("/admin/products")}>
        {t.products}
      </Button>
      <Button block onClick={() => navigate("/admin/categories")}>
        {t.categories}
      </Button>
      <Button block onClick={() => navigate("/admin/orders")}>
        {t.userOrders}
      </Button>
      <Button block onClick={() => navigate("/admin/slider")}>
        {t.slider}
      </Button>
    </div>
  );
};

export default AdminMenu;
