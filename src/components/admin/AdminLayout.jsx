// import Navbar from "../common/Navbar";
// import Footer from "../common/Footer";
// import AdminSidebar from "./AdminSidebar";
// import AdminHeader from "./AdminHeader";

// function AdminLayout({ children }) {
//   return (
//     <>
//       <Navbar />
//       <main className="admin-page">
//         <div className="container admin-page__wrapper">
//           <AdminSidebar />

//           <section className="admin-content">
//             <AdminHeader />
//             {children}
//           </section>
//         </div>
//       </main>
//       <Footer />
//     </>
//   );
// }

// export default AdminLayout;

import { useState } from "react";
import { Menu } from "lucide-react";
import Navbar from "../common/Navbar";
import Footer from "../common/Footer";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <Navbar />

      <div className="navbar-spacer" />

      {/* Toggle button (mobile only via CSS) */}
      <button
        className="admin-sidebar__toggle"
        onClick={() => setIsSidebarOpen(true)}
      >
        <Menu size={20} />
      </button>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="admin-overlay"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <main className="admin-page">
        <div className="container admin-page__wrapper">

          {/* Sidebar */}
          <AdminSidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />

          {/* Content */}
          <section className="admin-content">
            <AdminHeader />
            {children}
          </section>

        </div>
      </main>

      <Footer />
    </>
  );
}

export default AdminLayout;