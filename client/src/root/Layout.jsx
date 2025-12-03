import React from "react";
import { Outlet } from "react-router-dom";
import SessionChecker from "../hook/SessionChecker";

const Layout = () => {
  return (
    <div>
      <main>
        <SessionChecker />
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
