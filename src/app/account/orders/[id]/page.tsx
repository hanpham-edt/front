import Header from "@/components/Header";
import React from "react";
import OrderDetailPage from "./OrderDetailPage";
import Footer from "@/components/Footer";

export default function page() {
  return (
    <>
      <Header />
      <OrderDetailPage />
      <Footer />
    </>
  );
}
