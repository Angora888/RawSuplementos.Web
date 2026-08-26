import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

function Layout() {
  const [menuAbierto, setMenuAbierto] =
    useState(false);

  return (
    <div className="app-layout">

      <Sidebar
        menuAbierto={menuAbierto}
        cerrarMenu={() =>
          setMenuAbierto(false)
        }
      />

      {menuAbierto && (
        <div
          className="mobile-sidebar-overlay"
          onClick={() =>
            setMenuAbierto(false)
          }
        />
      )}

      <main className="app-content">

        <button
          type="button"
          className="mobile-menu-button"
          onClick={() =>
            setMenuAbierto(true)
          }
        >
          ☰
        </button>

        <Outlet />

      </main>

    </div>
  );
}

export default Layout;