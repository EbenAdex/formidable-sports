// import { NavLink } from "react-router-dom";

// function AdminSidebar() {
//   return (
//     <aside className="admin-sidebar">
//       <h2 className="admin-sidebar__title">Admin Panel</h2>

//       <nav className="admin-sidebar__nav">
//         <NavLink to="/admin" end className="admin-sidebar__link">
//           Dashboard
//         </NavLink>
//         <NavLink to="/admin/fixtures" className="admin-sidebar__link">
//           Manage Fixtures
//         </NavLink>
//         <NavLink to="/admin/live" className="admin-sidebar__link">
//           Live Match Control
//         </NavLink>
//         <NavLink to="/admin/lineups" className="admin-sidebar__link">
//           Manage Lineups
//         </NavLink>
//         <NavLink to="/admin/results" className="admin-sidebar__link">
//           Manage Results
//         </NavLink>
//         <NavLink to="/admin/news" className="admin-sidebar__link">
//           Manage News
//         </NavLink>
//         <NavLink to="/admin/table" className="admin-sidebar__link">
//           Manage Table
//         </NavLink>
//         <NavLink to="/admin/rankings" className="admin-sidebar__link">
//           Manage Rankings
//         </NavLink>
//         <NavLink to="/admin/teams" className="admin-sidebar__link">
//           Manage Teams
//         </NavLink>
//         <NavLink to="/admin/sport-rules" className="admin-sidebar__link">
//           Manage Sport Rules
//         </NavLink>
//         <NavLink to="/admin/sports" className="admin-sidebar__link">
//           Manage Sports
//         </NavLink>
//         <NavLink to="/admin/contact-messages" className="admin-sidebar__link">
//           Contact Messages
//         </NavLink>
//       </nav>
//     </aside>
//   );
// }

// export default AdminSidebar;


import { NavLink } from "react-router-dom";

function AdminSidebar({ isOpen, onClose }) {
  return (
    <aside className={`admin-sidebar ${isOpen ? "open" : ""}`}>
      <h2 className="admin-sidebar__title">Admin Panel</h2>

      <nav className="admin-sidebar__nav">
        <NavLink to="/admin" end className="admin-sidebar__link" onClick={onClose}>
          Dashboard
        </NavLink>

        <NavLink to="/admin/fixtures" className="admin-sidebar__link" onClick={onClose}>
          Manage Fixtures
        </NavLink>

        <NavLink to="/admin/live" className="admin-sidebar__link" onClick={onClose}>
          Live Match Control
        </NavLink>

        <NavLink to="/admin/lineups" className="admin-sidebar__link" onClick={onClose}>
          Manage Lineups
        </NavLink>

        <NavLink to="/admin/results" className="admin-sidebar__link" onClick={onClose}>
          Manage Results
        </NavLink>

        <NavLink to="/admin/news" className="admin-sidebar__link" onClick={onClose}>
          Manage News
        </NavLink>

        <NavLink to="/admin/table" className="admin-sidebar__link" onClick={onClose}>
          Manage Table
        </NavLink>

        <NavLink to="/admin/rankings" className="admin-sidebar__link" onClick={onClose}>
          Manage Rankings
        </NavLink>

        <NavLink to="/admin/teams" className="admin-sidebar__link" onClick={onClose}>
          Manage Teams
        </NavLink>

        <NavLink to="/admin/sport-rules" className="admin-sidebar__link" onClick={onClose}>
          Manage Sport Rules
        </NavLink>

        <NavLink to="/admin/sports" className="admin-sidebar__link" onClick={onClose}>
          Manage Sports
        </NavLink>

        <NavLink to="/admin/contact-messages" className="admin-sidebar__link" onClick={onClose}>
          Contact Messages
        </NavLink>
      </nav>
    </aside>
  );
}

export default AdminSidebar;