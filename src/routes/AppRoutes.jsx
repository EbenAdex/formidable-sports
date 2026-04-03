import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Football from "../pages/Football";
import Basketball from "../pages/Basketball";
import Volleyball from "../pages/Volleyball";
import Tennis from "../pages/Tennis";
import Fixtures from "../pages/Fixture";
import Results from "../pages/Results";
import News from "../pages/News";
import MatchDetails from "../pages/MatchDetails";
import Register from "../pages/Register";
import Login from "../pages/Login";
import Profile from "../pages/Profile";
import NotFound from "../pages/NotFound";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import AdminRoute from "../components/admin/AdminRoute";
import AdminLogin from "../pages/admin/AdminLogin";
import AdminDashboard from "../pages/admin/AdminDashboard";
import ManageFixtures from "../pages/admin/ManageFixtures";
import ManageResults from "../pages/admin/ManageResults";
import ManageNews from "../pages/admin/ManageNews";
import ManageTeams from "../pages/admin/ManageTeams";
import ManageSports from "../pages/admin/ManageSports";
import LiveMatchControl from "../pages/admin/LiveMatchControl";
import ManageLineups from "../pages/admin/ManageLineups";
import Table from "../pages/Table";
import Teams from "../pages/Teams";
import ResultDetails from "../pages/ResultDetails";
import FixtureCalendar from "../pages/FixtureCalendar";
import ManageFavourites from "../pages/admin/ManageFavourites";
import Favourites from "../pages/Favourites";
import PlayerDetails from "../pages/PlayerDetails";
import Leaderboards from "../pages/Leaderboards";
import TeamDetails from "../pages/TeamDetails";
import ManageTable from "../pages/admin/ManageTable";
import Gallery from "../pages/Gallery";
import Faq from "../pages/Faq";
import Contact from "../pages/Contact";
import ManageContactMessages from "../pages/admin/ManageContactMessages";
import ManageSportRules from "../pages/admin/ManageSportRules";

import FirestoreTest from "../pages/FirestoreTest";
import TeamsMigration from "../pages/TeamsMigration";
import FixturesMigration from "../pages/FixturesMigration";
import ResultsMigration from "../pages/ResultsMigration";
import TableMigration from "../pages/TableMigration";
import Rankings from "../pages/Rankings";
import ManageRankings from "../pages/admin/ManageRankings";
import NewsMigration from "../pages/NewsMigration";
function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/sports/football" element={<Football />} />
      <Route path="/sports/basketball" element={<Basketball />} />
      <Route path="/sports/volleyball" element={<Volleyball />} />
      <Route path="/sports/tennis" element={<Tennis />} />
      <Route path="/fixtures" element={<Fixtures />} />
      <Route path="/results" element={<Results />} />
      <Route path="/news" element={<News />} />
      <Route path="/teams/:id" element={<TeamDetails />} />
      <Route path="/teams" element={<Teams />} />
      <Route path="/table" element={<Table />} /> 
      <Route path="/match/:id" element={<MatchDetails />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/faq" element={<Faq />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/results/:id" element={<ResultDetails />} />
      <Route path="/calendar" element={<FixtureCalendar />} />
      <Route path="/leaderboards" element={<Leaderboards />} />
      <Route path="/players/:id" element={<PlayerDetails />} />
      



      <Route path="/firestore-test" element={<FirestoreTest />} />
      <Route path="/migrate-teams" element={<TeamsMigration />} />
      <Route path="/migrate-fixtures" element={<FixturesMigration />} />
      <Route path="/migrate-results" element={<ResultsMigration />} />
      <Route path="/migrate-tables" element={<TableMigration />} />
      <Route path="/rankings" element={<Rankings />} />
      <Route path="/admin/rankings" element={<ManageRankings />} />
      <Route path="/migrate-news" element={<NewsMigration />} />


      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
     <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/fixtures"
        element={
          <AdminRoute>
            <ManageFixtures />
          </AdminRoute>
        }
      />
      <Route path="/admin/contact-messages" 
      element={
        <AdminRoute>
      <ManageContactMessages />
        </AdminRoute>
      } />
      <Route
        path="/admin/results"
        element={
          <AdminRoute>
            <ManageResults />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/news"
        element={
          <AdminRoute>
            <ManageNews />
          </AdminRoute>
        }
      />

      <Route path="/admin/sport-rules" element={
        <AdminRoute>
          <ManageSportRules />
        </AdminRoute>
        
        
        } />
      <Route
        path="/admin/teams"
        element={
          <AdminRoute>
            <ManageTeams />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/sports"
        element={
          <AdminRoute>
            <ManageSports />
          </AdminRoute>
        }
      />

      <Route
  path="/admin/live"
  element={
    <AdminRoute>
      <LiveMatchControl />
    </AdminRoute>
  }
/>
<Route
  path="/admin/lineups"
  element={
    <AdminRoute>
      <ManageLineups />
    </AdminRoute>
  }
/>
<Route
  path="/admin/table"
  element={
    <AdminRoute>
      <ManageTable />
    </AdminRoute>
  }

/>

<Route path="/favourites" element={<Favourites />} />
<Route
  path="/admin/favourites"
  element={
    <AdminRoute>
      <ManageFavourites />
    </AdminRoute>
  }
/>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;