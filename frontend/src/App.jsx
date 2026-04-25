import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Members from "./pages/Members";
import Trainers from "./pages/Trainers";
import MembershipPlans from "./pages/MembershipPlans";
import Attendance from "./pages/Attendance";
import Payments from "./pages/Payments";
import Classes from "./pages/Classes";
import Settings from "./pages/Settings";
import ScrollToTop from "./website/components/ScrollToTop";
import Inquiries from './pages/Inquiries';
import Expenses from "./pages/Expenses";

import PublicLayout from "./website/layout/PublicLayout";
import Home from "./website/pages/Home";
import About from "./website/pages/About";
import TrainersPage from "./website/pages/TrainersPage";
import PlansPage from "./website/pages/PlansPage";
import ClassesPage from "./website/pages/ClassesPage";
import Contact from "./website/pages/Contact";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-dark-50">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main
          id="main-scroll-container"
          className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8"
        >
          <Routes>
            <Route index element={<Dashboard />} />
            <Route path="members" element={<Members />} />
            <Route path="trainers" element={<Trainers />} />
            <Route path="plans" element={<MembershipPlans />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="payments" element={<Payments />} />
            <Route path="classes" element={<Classes />} />
            <Route path="inquiries" element={<Inquiries />} />
            <Route path="expenses" element={<Expenses />} />
            <Route path="settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <>
      <ScrollToTop />

      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/trainers" element={<TrainersPage />} />
          <Route path="/plans" element={<PlansPage />} />
          <Route path="/classes" element={<ClassesPage />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        <Route path="/admin" element={<Login />} />

        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;