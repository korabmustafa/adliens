import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./admin/ProtectedRoute";
import { AppLayout } from "./layout/AppLayout";
import { AdminLayout } from "./layout/AdminLayout";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";
import { HomePage } from "./pages/HomePage";
import { ServicesPage } from "./pages/ServicesPage";
import { ClientWorldPage } from "./pages/ClientWorldPage";
import { WorkPage } from "./pages/WorkPage";
import { AdminLoginPage } from "./pages/admin/AdminLoginPage";
import { CaseStudiesAdminPage } from "./pages/admin/CaseStudiesAdminPage";
import { CompaniesAdminPage } from "./pages/admin/CompaniesAdminPage";

import { UniversePage } from "./pages/UniversePage";

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="universe" element={<UniversePage />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="work" element={<WorkPage />} />
        <Route path="work/:clientId" element={<ClientWorldPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
      </Route>

      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="companies" replace />} />
        <Route path="companies" element={<CompaniesAdminPage />} />
        <Route path="work" element={<CaseStudiesAdminPage />} />
      </Route>
    </Routes>
  );
}
