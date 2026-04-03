import Navbar from "../common/Navbar";
import Footer from "../common/Footer";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

function AdminLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="admin-page">
        <div className="container admin-page__wrapper">
          <AdminSidebar />

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