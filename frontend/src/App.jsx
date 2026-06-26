import { Route, Routes } from "react-router-dom";

import SiteHeader from "@/components/site/Header";
import SiteFooter from "@/components/site/SiteFooter";
import { RadarCursor } from "@/components/site/shared";
import LandingPage from "@/pages/LandingPage";
import ProfilePage from "@/pages/ProfilePage";
import CheckoutPage from "@/pages/CheckoutPage";
import AuthPage from "@/pages/AuthPage";
import AdminLoginPage from "@/pages/AdminLoginPage";
import AdminDashboardPage from "@/pages/AdminDashboardPage";

function App() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-void text-chalk">
      <RadarCursor />
      <SiteHeader />

      <main>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
        </Routes>
      </main>

      <SiteFooter />
    </div>
  );
}

export default App;
