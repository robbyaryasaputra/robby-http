import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { FadeIn } from "../components/15-animation";
import { FooterSection } from "../components/6-section";

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
          <FadeIn duration={0.4}>
            <Outlet context={{ search, setSearch }} />
          </FadeIn>
        </main>

        {/* Footer */}
        <FooterSection />
      </div>
    </div>
  );
}
