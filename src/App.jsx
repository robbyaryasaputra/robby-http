import { lazy, Suspense, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Loading from "./components/layout/Loading";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const MainLayout = lazy(() => import("./layouts/MainLayout"));
const AuthLayout = lazy(() => import("./layouts/AuthLayout"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const Details = lazy(() => import("./pages/admin/Details"));
const Menu = lazy(() => import("./pages/admin/Menu"));
const Settings = lazy(() => import("./pages/admin/Settings"));
const NotFound = lazy(() => import("./pages/admin/NotFound"));
const Users = lazy(() => import("./pages/admin/Users"));
const Orders = lazy(() => import("./pages/admin/Orders"));
const ErrorPage = lazy(() => import("./pages/admin/ErrorPage"));
const HelpCenter = lazy(() => import("./pages/admin/HelpCenter"));
const ReactHooks = lazy(() => import("./pages/admin/ReactHooks"));
const Promotions = lazy(() => import("./pages/admin/Promotions"));
const Payments = lazy(() => import("./pages/admin/Payments"));
const Reviews = lazy(() => import("./pages/admin/Reviews"));

const ActivityLogs = lazy(() => import("./pages/admin/ActivityLogs"));
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword"));
const GuestShop = lazy(() => import("./pages/guest/GuestShop"));
const MemberShop = lazy(() => import("./pages/member/MemberShop"));
const Members = lazy(() => import("./pages/admin/Members"));

export default function App() {
  const [search, setSearch] = useState("");

  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* Halaman utama bagi pengunjung/guest — public access */}
        <Route path="/" element={<GuestShop />} />

        {/* Member area — hanya customer yang sudah login */}
        <Route
          path="/member"
          element={<MemberShop />}
        />

        {/* Dashboard admin/cashier — protected access */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin", "cashier"]}>
              <MainLayout search={search} setSearch={setSearch} />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard search={search} />} />
          <Route path="details" element={<Details />} />
          <Route path="menu" element={<Menu />} />
          <Route path="users" element={<Users />} />
          <Route path="members" element={<Members />} />
          <Route path="orders" element={<Orders />} />
          <Route path="promotions" element={<Promotions />} />
          <Route path="payments" element={<Payments />} />
          <Route path="settings" element={<Settings />} />

          <Route path="reviews" element={<Reviews />} />
          <Route path="activity-logs" element={<ActivityLogs />} />
          <Route path="help-center" element={<HelpCenter />} />
          <Route path="react-hooks" element={<ReactHooks />} />
          <Route
            path="error-400"
            element={
              <ErrorPage
                errorCode="400"
                errorDescription="Permintaan tidak valid. Harap periksa kembali parameter yang Anda kirim."
                errorImage="https://http.cat/400"
              />
            }
          />
          <Route
            path="error-401"
            element={
              <ErrorPage
                errorCode="401"
                errorDescription="Anda tidak terautentikasi. Silakan login terlebih dahulu untuk mengakses halaman ini."
                errorImage="https://http.cat/401"
              />
            }
          />
          <Route
            path="error-403"
            element={
              <ErrorPage
                errorCode="403"
                errorDescription="Anda tidak memiliki izin untuk mengakses halaman ini. Akses ditolak."
                errorImage="https://http.cat/403"
              />
            }
          />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route path="/auth" element={<AuthLayout />}>
          <Route index element={<Navigate replace to="login" />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route path="/login" element={<Navigate replace to="/auth/login" />} />
        <Route
          path="/register"
          element={<Navigate replace to="/auth/register" />}
        />
        <Route
          path="/forgot-password"
          element={<Navigate replace to="/auth/forgot-password" />}
        />
        <Route
          path="/reset-password"
          element={<Navigate replace to="/auth/reset-password" />}
        />
      </Routes>
    </Suspense>
  );
}
