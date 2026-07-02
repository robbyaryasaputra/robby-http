import { useState } from "react";
import {
  LuLifeBuoy,
  LuMessageCircle,
  LuBookOpen,
  LuCoffee,
  LuShieldCheck,
  LuCreditCard,
  LuTruck,
  LuUsers,
  LuSettings,
  LuSend,
} from "react-icons/lu";
import { Breadcrumb } from "../../components/navigation";
import { PageHeader } from "../../components/section";
import { SlideUp } from "../../components/animation";

// ═══════════════════════════════════════════════
// Shadcn UI Components
// ═══════════════════════════════════════════════
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// ═══════════════════════════════════════════════
// Data
// ═══════════════════════════════════════════════
const faqGeneral = [
  {
    q: "Bagaimana cara membuat akun baru?",
    a: 'Klik tombol "Register" pada halaman login, lalu isi data diri Anda. Setelah email terverifikasi, akun Anda akan langsung aktif dan bisa digunakan.',
  },
  {
    q: "Apakah saya bisa mengubah email setelah mendaftar?",
    a: "Ya, Anda bisa mengubah email di halaman Settings > Profile. Perubahan akan memerlukan verifikasi ulang melalui email baru.",
  },
  {
    q: "Bagaimana cara mengatur notifikasi?",
    a: "Buka halaman Settings > General, lalu aktifkan atau nonaktifkan toggle notification sesuai preferensi Anda.",
  },
  {
    q: "Apakah data saya aman?",
    a: "Tentu. Kami menggunakan enkripsi end-to-end dan two-factor authentication (2FA) untuk menjaga keamanan data Anda.",
  },
];

const faqOrders = [
  {
    q: "Bagaimana cara melacak status pesanan?",
    a: 'Buka halaman Orders, lalu klik ikon mata (👁) pada pesanan yang ingin dilacak. Status pesanan akan ditampilkan secara real-time.',
  },
  {
    q: "Bisakah saya membatalkan pesanan?",
    a: 'Pesanan dapat dibatalkan selama status masih "Pending". Setelah masuk tahap "Processing", pembatalan tidak dapat dilakukan.',
  },
  {
    q: "Metode pembayaran apa saja yang tersedia?",
    a: "Kami menerima pembayaran melalui Cash, Credit Card, Debit Card, dan E-Wallet (GoPay, OVO, Dana).",
  },
];

const faqMenu = [
  {
    q: "Bagaimana cara menambah item ke favorit?",
    a: "Pada halaman Menu, klik ikon hati (❤) di sudut kanan atas gambar menu. Item akan otomatis masuk ke halaman Favorites.",
  },
  {
    q: "Apakah menu berubah setiap hari?",
    a: "Menu utama bersifat tetap, namun kami memiliki Special Menu yang diperbarui setiap minggu dengan variasi seasonal.",
  },
  {
    q: "Bagaimana cara melihat detail nutrisi?",
    a: "Hover atau tap pada nama menu untuk melihat tooltip deskripsi. Informasi nutrisi lengkap tersedia di halaman Detail.",
  },
];

const guides = [
  {
    icon: LuCoffee,
    title: "Mulai Menggunakan CRM",
    desc: "Panduan lengkap untuk mulai menggunakan dashboard Coffee Shop CRM.",
    steps: [
      "Login dengan akun admin Anda",
      "Buka Dashboard untuk melihat overview",
      "Kelola Menu, Orders, dan Users",
      "Atur preferensi di Settings",
    ],
  },
  {
    icon: LuTruck,
    title: "Mengelola Pesanan",
    desc: "Cara memproses dan melacak pesanan pelanggan dengan efisien.",
    steps: [
      "Buka halaman Orders dari sidebar",
      "Filter pesanan berdasarkan status",
      "Klik pesanan untuk melihat detail",
      "Update status sesuai progres",
    ],
  },
  {
    icon: LuUsers,
    title: "Manajemen User",
    desc: "Tips untuk mengelola data user dan membangun loyalitas.",
    steps: [
      "Lihat daftar user di halaman Users",
      "Cek riwayat pembelian pelanggan",
      "Pantau pelanggan aktif dan tidak aktif",
      "Gunakan data untuk promo targeted",
    ],
  },
  {
    icon: LuSettings,
    title: "Konfigurasi Sistem",
    desc: "Atur profil, keamanan, dan preferensi aplikasi.",
    steps: [
      "Buka Settings dari sidebar",
      "Edit profil dan email di bagian Profile",
      "Aktifkan Dark Mode dan notifikasi",
      "Setup 2FA untuk keamanan ekstra",
    ],
  },
];

export default function HelpCenter() {
  const [contactName, setContactName] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitContact = () => {
    if (contactName.trim() && contactMessage.trim()) {
      setSubmitted(true);
      setContactName("");
      setContactMessage("");
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: "Dashboard", to: "/dashboard" },
          { label: "Help Center" },
        ]}
      />

      {/* Header */}
      <PageHeader
        title="Help Center"
        subtitle="Temukan jawaban, panduan, dan bantuan untuk menggunakan Coffee Shop CRM."
        action={
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="default"
                className="bg-[#4E3423] hover:bg-[#3a2518] text-white cursor-pointer"
              >
                <LuMessageCircle className="w-4 h-4 mr-2" />
                Hubungi Kami
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Hubungi Tim Support</DialogTitle>
                <DialogDescription>
                  Kirim pesan kepada tim kami dan kami akan merespons dalam 24
                  jam.
                </DialogDescription>
              </DialogHeader>

              {submitted ? (
                <div className="flex flex-col items-center gap-3 py-6">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center">
                    <LuShieldCheck className="w-7 h-7 text-emerald-600" />
                  </div>
                  <p className="font-semibold text-emerald-700">
                    Pesan Terkirim!
                  </p>
                  <p className="text-sm text-gray-500 text-center">
                    Terima kasih, tim kami akan menghubungi Anda segera.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 py-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Nama
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Masukkan nama Anda"
                      className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#BF834F] focus:border-[#BF834F] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Pesan
                    </label>
                    <textarea
                      id="contact-message"
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder="Jelaskan kendala atau pertanyaan Anda..."
                      rows={4}
                      className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#BF834F] focus:border-[#BF834F] transition-all resize-none"
                    />
                  </div>
                </div>
              )}

              {!submitted && (
                <DialogFooter>
                  <Button
                    onClick={handleSubmitContact}
                    className="bg-[#4E3423] hover:bg-[#3a2518] text-white cursor-pointer"
                  >
                    <LuSend className="w-4 h-4 mr-2" />
                    Kirim Pesan
                  </Button>
                </DialogFooter>
              )}
            </DialogContent>
          </Dialog>
        }
      />

      {/* ═══════════════════════════════════════════ */}
      {/* SHADCN TABS — Mengorganisir konten FAQ & Guides */}
      {/* ═══════════════════════════════════════════ */}
      <SlideUp duration={0.4}>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50">
          <Tabs defaultValue="faq">
            <TabsList className="mb-6">
              <TabsTrigger value="faq" className="cursor-pointer">
                <LuLifeBuoy className="w-4 h-4" />
                FAQ
              </TabsTrigger>
              <TabsTrigger value="guides" className="cursor-pointer">
                <LuBookOpen className="w-4 h-4" />
                Panduan
              </TabsTrigger>
            </TabsList>

            {/* ═══════════════════════════════════════════ */}
            {/* TAB 1: FAQ — menggunakan SHADCN ACCORDION */}
            {/* ═══════════════════════════════════════════ */}
            <TabsContent value="faq">
              <div className="space-y-8">
                {/* FAQ - General */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center">
                      <LuShieldCheck className="w-4.5 h-4.5 text-amber-700" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#2C1A0E]">
                        Umum & Akun
                      </h3>
                      <p className="text-xs text-gray-400">
                        Pertanyaan seputar akun dan pengaturan
                      </p>
                    </div>
                  </div>
                  <Accordion>
                    {faqGeneral.map((faq, i) => (
                      <AccordionItem key={`general-${i}`} value={`general-${i}`}>
                        <AccordionTrigger className="text-[#2C1A0E] hover:text-[#8B5F3C] hover:no-underline">
                          {faq.q}
                        </AccordionTrigger>
                        <AccordionContent>
                          <p className="text-gray-600 leading-relaxed">
                            {faq.a}
                          </p>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>

                {/* FAQ - Orders */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center">
                      <LuCreditCard className="w-4.5 h-4.5 text-emerald-700" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#2C1A0E]">
                        Pesanan & Pembayaran
                      </h3>
                      <p className="text-xs text-gray-400">
                        Pertanyaan seputar order dan payment
                      </p>
                    </div>
                  </div>
                  <Accordion>
                    {faqOrders.map((faq, i) => (
                      <AccordionItem key={`order-${i}`} value={`order-${i}`}>
                        <AccordionTrigger className="text-[#2C1A0E] hover:text-[#8B5F3C] hover:no-underline">
                          {faq.q}
                        </AccordionTrigger>
                        <AccordionContent>
                          <p className="text-gray-600 leading-relaxed">
                            {faq.a}
                          </p>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>

                {/* FAQ - Menu */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center">
                      <LuCoffee className="w-4.5 h-4.5 text-blue-700" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#2C1A0E]">
                        Menu & Favorit
                      </h3>
                      <p className="text-xs text-gray-400">
                        Pertanyaan seputar menu kopi dan fitur favorit
                      </p>
                    </div>
                  </div>
                  <Accordion>
                    {faqMenu.map((faq, i) => (
                      <AccordionItem key={`menu-${i}`} value={`menu-${i}`}>
                        <AccordionTrigger className="text-[#2C1A0E] hover:text-[#8B5F3C] hover:no-underline">
                          {faq.q}
                        </AccordionTrigger>
                        <AccordionContent>
                          <p className="text-gray-600 leading-relaxed">
                            {faq.a}
                          </p>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </div>
            </TabsContent>

            {/* ═══════════════════════════════════════════ */}
            {/* TAB 2: Panduan — card grid */}
            {/* ═══════════════════════════════════════════ */}
            <TabsContent value="guides">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {guides.map((guide, idx) => {
                  const Icon = guide.icon;
                  return (
                    <SlideUp key={idx} duration={0.4} delay={idx * 0.05}>
                      {/* ═══════════════════════════════════════ */}
                      {/* SHADCN DIALOG — Detail panduan */}
                      {/* ═══════════════════════════════════════ */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <div className="group p-5 rounded-2xl border border-gray-100 hover:border-amber-200 bg-gray-50/50 hover:bg-amber-50/30 transition-all duration-300 cursor-pointer hover:shadow-md">
                            <div className="flex items-start gap-4">
                              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#8B5F3C] to-[#BF834F] flex items-center justify-center shrink-0 shadow-md shadow-amber-900/10 group-hover:scale-105 transition-transform duration-300">
                                <Icon className="w-5 h-5 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-bold text-[#2C1A0E] mb-1 group-hover:text-[#8B5F3C] transition-colors">
                                  {guide.title}
                                </h4>
                                <p className="text-xs text-gray-500 leading-relaxed">
                                  {guide.desc}
                                </p>
                                <span className="inline-block mt-3 text-[11px] font-semibold text-[#8B5F3C] uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                  Klik untuk detail →
                                </span>
                              </div>
                            </div>
                          </div>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <div className="flex items-center gap-3 mb-1">
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B5F3C] to-[#BF834F] flex items-center justify-center shadow-md">
                                <Icon className="w-5 h-5 text-white" />
                              </div>
                              <DialogTitle className="text-base">
                                {guide.title}
                              </DialogTitle>
                            </div>
                            <DialogDescription>{guide.desc}</DialogDescription>
                          </DialogHeader>
                          <div className="py-2">
                            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
                              Langkah-langkah
                            </p>
                            <ol className="space-y-3">
                              {guide.steps.map((step, sIdx) => (
                                <li
                                  key={sIdx}
                                  className="flex items-start gap-3"
                                >
                                  <span className="w-7 h-7 rounded-full bg-amber-100 text-[#8B5F3C] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                                    {sIdx + 1}
                                  </span>
                                  <span className="text-sm text-gray-700 leading-relaxed pt-1">
                                    {step}
                                  </span>
                                </li>
                              ))}
                            </ol>
                          </div>
                          <DialogFooter showCloseButton>
                            <Button
                              variant="default"
                              className="bg-[#4E3423] hover:bg-[#3a2518] text-white cursor-pointer"
                            >
                              Mengerti
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </SlideUp>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </SlideUp>

      {/* Quick Info Cards */}
      <SlideUp duration={0.4} delay={0.1}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-gray-50 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
              <LuMessageCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#2C1A0E]">Live Chat</p>
              <p className="text-xs text-gray-400">Senin - Jumat, 09:00 - 17:00</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-gray-50 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
              <LuLifeBuoy className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#2C1A0E]">Email Support</p>
              <p className="text-xs text-gray-400">support@coffeeshop.com</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-gray-50 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center shrink-0">
              <LuBookOpen className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#2C1A0E]">Dokumentasi</p>
              <p className="text-xs text-gray-400">docs.coffeeshop.com</p>
            </div>
          </div>
        </div>
      </SlideUp>
    </div>
  );
}
