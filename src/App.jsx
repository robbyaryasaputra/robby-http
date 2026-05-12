import { lazy, Suspense, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

const MainLayout = lazy(() => import("./layouts/MainLayout"));
const AuthLayout = lazy(() => import("./layouts/AuthLayout"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Details = lazy(() => import("./pages/Details"));
const Service = lazy(() => import("./pages/Service"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Customers = lazy(() => import("./pages/Customers"));
const Orders = lazy(() => import("./pages/Orders"));
const ErrorPage = lazy(() => import("./pages/ErrorPage"));
const Login = lazy(() => import("./pages/Login"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));

export default function App() {
  const [search, setSearch] = useState("");

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-slate-600">
          Loading...
        </div>
      }
    >
      <Routes>
        <Route
          path="/"
          element={<MainLayout search={search} setSearch={setSearch} />}
        >
          <Route index element={<Dashboard search={search} />} />
          <Route path="details" element={<Details search={search} />} />
          <Route path="services" element={<Service search={search} />} />
          <Route path="customers" element={<Customers />} />
          <Route path="orders" element={<Orders />} />
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
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
        </Route>

        <Route path="/login" element={<Navigate replace to="/auth/login" />} />
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
