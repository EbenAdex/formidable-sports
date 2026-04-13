import { Routes, Route } from "react-router-dom";
import Welcome from "../pages/Welcome";
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
import ProtectedRoute from "../components/common/ProtectedRoute";
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
import GalleryDetails from "../pages/GalleryDetails";
import NewsDetails from "../pages/NewsDetails";
import ManageGallery from "../pages/admin/ManageGallery";
import AboutFasa from "../pages/AboutFasa";

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
      <Route path="/" element={<Welcome />} />
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      <Route
        path="/sports/football"
        element={
          <ProtectedRoute>
            <Football />
          </ProtectedRoute>
        }
      />
      <Route
        path="/sports/basketball"
        element={
          <ProtectedRoute>
            <Basketball />
          </ProtectedRoute>
        }
      />
      <Route
        path="/sports/volleyball"
        element={
          <ProtectedRoute>
            <Volleyball />
          </ProtectedRoute>
        }
      />
      <Route
        path="/sports/tennis"
        element={
          <ProtectedRoute>
            <Tennis />
          </ProtectedRoute>
        }
      />

      <Route
        path="/fixtures"
        element={
          <ProtectedRoute>
            <Fixtures />
          </ProtectedRoute>
        }
      />
      <Route
        path="/results"
        element={
          <ProtectedRoute>
            <Results />
          </ProtectedRoute>
        }
      />
      <Route
        path="/results/:id"
        element={
          <ProtectedRoute>
            <ResultDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/news"
        element={
          <ProtectedRoute>
            <News />
          </ProtectedRoute>
        }
      />
      <Route
        path="/news/:id"
        element={
          <ProtectedRoute>
            <NewsDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/teams"
        element={
          <ProtectedRoute>
            <Teams />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teams/:id"
        element={
          <ProtectedRoute>
            <TeamDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/players/:teamId/:playerId"
        element={
          <ProtectedRoute>
            <PlayerDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/table"
        element={
          <ProtectedRoute>
            <Table />
          </ProtectedRoute>
        }
      />
      <Route
        path="/match/:id"
        element={
          <ProtectedRoute>
            <MatchDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/gallery"
        element={
          <ProtectedRoute>
            <Gallery />
          </ProtectedRoute>
        }
      />
      <Route
        path="/gallery/:id"
        element={
          <ProtectedRoute>
            <GalleryDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/faq"
        element={
          <ProtectedRoute>
            <Faq />
          </ProtectedRoute>
        }
      />
      <Route
        path="/contact"
        element={
          <ProtectedRoute>
            <Contact />
          </ProtectedRoute>
        }
      />
      <Route
        path="/about-fasa"
        element={
          <ProtectedRoute>
            <AboutFasa />
          </ProtectedRoute>
        }
      />
      <Route
        path="/calendar"
        element={
          <ProtectedRoute>
            <FixtureCalendar />
          </ProtectedRoute>
        }
      />
      <Route
        path="/leaderboards"
        element={
          <ProtectedRoute>
            <Leaderboards />
          </ProtectedRoute>
        }
      />
      <Route
        path="/rankings"
        element={
          <ProtectedRoute>
            <Rankings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/favourites"
        element={
          <ProtectedRoute>
            <Favourites />
          </ProtectedRoute>
        }
      />
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
      <Route
        path="/admin/manage-gallery"
        element={
          <AdminRoute>
            <ManageGallery />
          </AdminRoute>
        }
      />
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
      <Route
        path="/admin/favourites"
        element={
          <AdminRoute>
            <ManageFavourites />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/contact-messages"
        element={
          <AdminRoute>
            <ManageContactMessages />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/sport-rules"
        element={
          <AdminRoute>
            <ManageSportRules />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/rankings"
        element={
          <AdminRoute>
            <ManageRankings />
          </AdminRoute>
        }
      />

      <Route path="/firestore-test" element={<FirestoreTest />} />
      <Route path="/migrate-teams" element={<TeamsMigration />} />
      <Route path="/migrate-fixtures" element={<FixturesMigration />} />
      <Route path="/migrate-results" element={<ResultsMigration />} />
      <Route path="/migrate-tables" element={<TableMigration />} />
      <Route path="/migrate-news" element={<NewsMigration />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;