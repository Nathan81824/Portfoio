import { useState } from "react";

import AdminTopbar from "../../components/Admin/AdminTopbar";
import AdminSidebar from "../../components/Admin/AdminSidebar";
import AdminChart from "../../components/Admin/AdminChart";



/* =========================================================
   ADMIN CHAT PAGE
========================================================= */

export default function Admin() {

  /* =======================================================
     SELECTED CONVERSATION
  ======================================================= */

  const [
    selectedConversation,
    setSelectedConversation,
  ] = useState(null);


  /* =======================================================
     MOBILE SIDEBAR
  ======================================================= */

  const [
    mobileSidebarOpen,
    setMobileSidebarOpen,
  ] = useState(false);


  /* =======================================================
     SELECT CONVERSATION
  ======================================================= */

  const handleSelectConversation = (
    conversation
  ) => {

    setSelectedConversation(
      conversation
    );

  };


  /* =======================================================
     LOGOUT
  ======================================================= */

  const handleLogout = () => {

    /*
      Replace this with your existing
      admin authentication/logout logic.
    */

    console.log(
      "Admin logout"
    );

  };


  /* =======================================================
     OPEN SIDEBAR
  ======================================================= */

  const handleOpenSidebar = () => {

    setMobileSidebarOpen(true);

  };


  /* =======================================================
     CLOSE SIDEBAR
  ======================================================= */

  const handleCloseSidebar = () => {

    setMobileSidebarOpen(false);

  };


  /* =======================================================
     RENDER
  ======================================================= */

  return (

    <div className="admin-page">


      {/* ===================================================
          TOPBAR
      =================================================== */}

      <AdminTopbar
        title="Dashboard"
        subtitle="Manage your portfolio conversations"
        onMenuToggle={
          handleOpenSidebar
        }
      />


      {/* ===================================================
          SIDEBAR
      =================================================== */}

      <AdminSidebar

        selectedConversation={
          selectedConversation
        }

        onSelectConversation={
          handleSelectConversation
        }

        onLogout={
          handleLogout
        }

        mobileOpen={
          mobileSidebarOpen
        }

        onCloseMobile={
          handleCloseSidebar
        }

      />


      {/* ===================================================
          MAIN COMMUNICATION AREA
      =================================================== */}

      <main className="admin-main">

        <AdminChart
          selectedConversation={
            selectedConversation
          }
        />

      </main>

    </div>

  );

}
