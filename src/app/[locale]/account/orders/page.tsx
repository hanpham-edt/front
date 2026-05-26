import Footer from "@/components/Footer";
import Header from "@/components/Header";
import React from "react";
import MyOrdersPage from "./MyOrdersPage";

export default function page() {
  return (
    <>
      <Header />
      <MyOrdersPage />
      <Footer />
    </>
  );
}
