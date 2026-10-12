import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router";
import { PublicLayout } from "./layouts/PublicLayout";
import Home from "./pages/Home";
import BookingPage from "./pages/booking/BookingPage";
import MyAppointments from "./pages/MyAppointments";
import NotFound from "./pages/NotFound";
import { PageLoader } from "./components/PageLoader";

const AdminLayout = lazy(() => import("./layouts/AdminLayout"));
const Login = lazy(() => import("./pages/admin/Login"));
const Calendar = lazy(() => import("./pages/admin/Calendar"));
const Services = lazy(() => import("./pages/admin/Services"));
const Staff = lazy(() => import("./pages/admin/Staff"));
const Settings = lazy(() => import("./pages/admin/Settings"));

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="book" element={<BookingPage />} />
          <Route path="my" element={<MyAppointments />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="admin/login" element={<Login />} />
        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<Calendar />} />
          <Route path="services" element={<Services />} />
          <Route path="staff" element={<Staff />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
