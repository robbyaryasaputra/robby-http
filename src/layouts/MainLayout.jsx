import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function MainLayout({ search, setSearch }) {
  return (
    <div className="flex min-h-screen bg-[#F9F5EE]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 ml-72 flex flex-col">
        {/* Header */}
        <Header search={search} setSearch={setSearch} />

        {/* Page Content */}
        <main className="flex-1 p-6">
          <Outlet context={{ search, setSearch }} />
        </main>
      </div>
    </div>
  );
}
