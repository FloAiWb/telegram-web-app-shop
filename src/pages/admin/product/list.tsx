// src/pages/admin/products.tsx

import React from "react";
import Container from "@components/container";
import ProductLists from "@components/product/list";
import { useNavigate } from "react-router-dom";
import t from "@/i18n/ru";

const ProductList: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container
      title={t.products}
      backwardUrl="/admin"
      customButton
      customButtonTitle={t.add}
      customButtonOnClick={() => navigate("/admin/products/add")}
    >
      <ProductLists pageType="admin" />
    </Container>
  );
};

export default ProductList;
