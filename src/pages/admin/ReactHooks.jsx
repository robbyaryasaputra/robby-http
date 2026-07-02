import { useState, useEffect, useRef } from "react";
import { Breadcrumb } from "../../components/navigation";
import { PageHeader } from "../../components/section";
import { SlideUp } from "../../components/animation";
import { Heading, Caption } from "../../components/typography";
import { Badge } from "../../components/basic";
import {
  LuCoffee,
  LuTimer,
  LuMousePointer2,
  LuPlus,
  LuMinus,
  LuRotateCcw,
  LuPlay,
  LuPause,
  LuSearch,
  LuInfo,
  LuArrowRight,
  LuZap,
  LuEye,
  LuUsers,
} from "react-icons/lu";

// ============================================================
// Penjelasan 5W + 1H untuk setiap Hook
// ============================================================
const hookExplanations = {
  useState: {
    color: "from-amber-500 to-amber-700",
    bgLight: "bg-amber-50",
    borderColor: "border-amber-200",
    textColor: "text-amber-700",
    dotColor: "bg-amber-500",
    icon: LuCoffee,
    title: "useState",
    subtitle: "Menyimpan dan Mengelola State Lokal",
    items: [
      {
        key: "What",
        label: "Apa fungsi useState yang Anda terapkan?",
        answer:
          "useState digunakan untuk menyimpan data yang bisa berubah secara dinamis, seperti jumlah pesanan kopi, status tombol, dan nilai input pencarian di coffee shop dashboard.",
      },
      {
        key: "Why",
        label: "Mengapa useState diperlukan?",
        answer:
          "Tanpa useState, komponen tidak bisa menyimpan data yang berubah. Misalnya, kita butuh melacak berapa espresso yang dipesan agar UI terupdate otomatis saat pelanggan menambah pesanan.",
      },
      {
        key: "Who",
        label: "Siapa yang menggunakan fitur tersebut?",
        answer:
          "Barista dan admin yang mengoperasikan dashboard coffee shop. Mereka menggunakan counter untuk pesanan, toggle untuk status toko, dan form input untuk pencarian menu.",
      },
      {
        key: "When",
        label: "Kapan state berubah?",
        answer:
          "State berubah setiap kali user berinteraksi: klik tombol tambah/kurang pesanan, toggle status toko buka/tutup, atau mengetik di kolom pencarian. React otomatis me-render ulang komponen.",
      },
      {
        key: "Where",
        label: "Di bagian mana useState digunakan?",
        answer:
          "Di komponen Coffee Order Counter untuk melacak jumlah pesanan, di panel kontrol toko untuk status buka/tutup, dan di search bar untuk filter menu kopi secara real-time.",
      },
      {
        key: "How",
        label: "Bagaimana useState mempengaruhi tampilan aplikasi?",
        answer:
          "Setiap kali setState dipanggil, React akan me-render ulang komponen dengan data baru. Contoh: saat count bertambah, angka di UI langsung berubah tanpa reload halaman.",
      },
    ],
  },
  useEffect: {
    color: "from-emerald-500 to-emerald-700",
    bgLight: "bg-emerald-50",
    borderColor: "border-emerald-200",
    textColor: "text-emerald-700",
    dotColor: "bg-emerald-500",
    icon: LuTimer,
    title: "useEffect",
    subtitle: "Side Effect & Lifecycle Management",
    items: [
      {
        key: "What",
        label: "Apa fungsi useEffect yang Anda terapkan?",
        answer:
          "useEffect digunakan untuk menjalankan side effect seperti timer brewing kopi otomatis, fetch data waktu real-time, dan sinkronisasi status pesanan ke console log.",
      },
      {
        key: "Why",
        label: "Mengapa proses tersebut menggunakan useEffect?",
        answer:
          "Side effect seperti timer dan API call tidak boleh dijalankan langsung di dalam render. useEffect memastikan proses ini berjalan setelah DOM diperbarui dan bisa dibersihkan (cleanup).",
      },
      {
        key: "Who",
        label: "Siapa yang merasakan dampaknya?",
        answer:
          "Semua pengguna dashboard merasakan dampaknya: timer brewing berjalan otomatis, waktu real-time terupdate setiap detik, dan data pesanan tersinkronisasi secara konsisten.",
      },
      {
        key: "When",
        label: "Kapan useEffect dijalankan?",
        answer:
          "useEffect dijalankan setelah komponen di-render. Dengan dependency array kosong [], efek hanya jalan saat mount. Dengan dependency [count], efek jalan setiap kali count berubah.",
      },
      {
        key: "Where",
        label: "Pada halaman atau fitur apa useEffect digunakan?",
        answer:
          "Di panel Real-Time Clock untuk update waktu setiap detik, di Brew Timer untuk countdown otomatis saat brewing kopi, dan di logger yang mencatat setiap perubahan pesanan.",
      },
      {
        key: "How",
        label: "Bagaimana dependency array mempengaruhi proses tersebut?",
        answer:
          "Dependency array mengontrol kapan efek dijalankan ulang. [] = sekali saat mount, [value] = setiap kali value berubah. Cleanup function mencegah memory leak saat komponen unmount.",
      },
    ],
  },
  useRef: {
    color: "from-blue-500 to-blue-700",
    bgLight: "bg-blue-50",
    borderColor: "border-blue-200",
    textColor: "text-blue-700",
    dotColor: "bg-blue-500",
    icon: LuMousePointer2,
    title: "useRef",
    subtitle: "Referensi DOM & Persistent Value",
    items: [
      {
        key: "What",
        label: "Apa fungsi useRef yang Anda terapkan?",
        answer:
          "useRef digunakan untuk mengakses elemen DOM secara langsung (focus pada input pencarian) dan menyimpan nilai yang persisten tanpa trigger re-render (render count tracker).",
      },
      {
        key: "Why",
        label: "Mengapa tidak menggunakan useState?",
        answer:
          "useState menyebabkan re-render setiap kali nilainya berubah. useRef menyimpan nilai tanpa re-render, cocok untuk render counter, previous value, dan referensi DOM langsung.",
      },
      {
        key: "Who",
        label: "Siapa yang terbantu dengan fitur tersebut?",
        answer:
          "Developer yang perlu mengontrol DOM secara imperatif (auto-focus input) dan yang butuh menyimpan data antar render tanpa overhead re-render (tracking render count).",
      },
      {
        key: "When",
        label: "Kapan useRef digunakan?",
        answer:
          "Saat perlu auto-focus input setelah komponen mount, saat melacak berapa kali komponen re-render, dan saat perlu menyimpan nilai sebelumnya (previous state) tanpa re-render.",
      },
      {
        key: "Where",
        label: "Di bagian mana useRef diterapkan?",
        answer:
          "Di input field pencarian menu kopi (auto-focus saat halaman dibuka), di render counter yang menghitung jumlah render, dan di section yang menampilkan previous value dari state.",
      },
      {
        key: "How",
        label: "Bagaimana useRef bekerja pada implementasi tersebut?",
        answer:
          "useRef mengembalikan objek { current: value } yang persisten di seluruh lifecycle komponen. ref.current bisa diubah tanpa trigger re-render, berbeda dengan useState.",
      },
    ],
  },
};

// ============================================================
// Komponen: 5W1H Explanation Card
// ============================================================
function ExplanationCard({ hookKey }) {
  const [expandedItem, setExpandedItem] = useState(null);
  const data = hookExplanations[hookKey];
  const IconComp = data.icon;

  return (
    <div
      className={`bg-white rounded-2xl border ${data.borderColor} shadow-sm overflow-hidden`}
    >
      {/* Card Header */}
      <div
        className={`bg-gradient-to-r ${data.color} px-6 py-4 flex items-center gap-3`}
      >
        <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
          <IconComp className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-white font-bold text-lg">{data.title}</h3>
          <p className="text-white/80 text-xs font-medium">{data.subtitle}</p>
        </div>
        <Badge variant="new" size="sm" className="ml-auto !bg-white/20 !text-white">
          5W+1H
        </Badge>
      </div>

      {/* Explanation Items */}
      <div className="divide-y divide-gray-50">
        {data.items.map((item, idx) => (
          <div
            key={idx}
            className="group cursor-pointer hover:bg-gray-50/50 transition-colors duration-200"
            onClick={() =>
              setExpandedItem(expandedItem === idx ? null : idx)
            }
          >
            <div className="px-6 py-3.5 flex items-start gap-3">
              <span
                className={`mt-0.5 w-6 h-6 rounded-lg ${data.bgLight} ${data.textColor} flex items-center justify-center text-[10px] font-extrabold shrink-0`}
              >
                {item.key[0]}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#2C1A0E] flex items-center gap-2">
                  <span className={`${data.textColor} font-bold`}>
                    {item.key}
                  </span>
                  <span className="text-gray-400 font-normal">:</span>
                  <span className="truncate">{item.label}</span>
                </p>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    expandedItem === idx
                      ? "max-h-40 opacity-100 mt-2"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="text-xs text-gray-500 leading-relaxed bg-gray-50 rounded-xl p-3 border border-gray-100">
                    {item.answer}
                  </p>
                </div>
              </div>
              <LuArrowRight
                className={`w-4 h-4 text-gray-300 shrink-0 mt-1 transition-transform duration-300 ${
                  expandedItem === idx ? "rotate-90" : ""
                } group-hover:text-gray-500`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// Demo A: useState — Coffee Order Counter
// ============================================================
function UseStateDemo() {
  // useState #1: Jumlah pesanan kopi
  const [espressoCount, setEspressoCount] = useState(0);
  const [latteCount, setLatteCount] = useState(0);
  const [mochaCount, setMochaCount] = useState(0);

  // useState #2: Toggle status toko
  const [isShopOpen, setIsShopOpen] = useState(true);

  // useState #3: Input pencarian menu
  const [searchQuery, setSearchQuery] = useState("");

  const coffeeItems = [
    {
      name: "Espresso",
      price: 3.5,
      count: espressoCount,
      setCount: setEspressoCount,
      emoji: "☕",
    },
    {
      name: "Vanilla Latte",
      price: 4.75,
      count: latteCount,
      setCount: setLatteCount,
      emoji: "🥛",
    },
    {
      name: "Mocha Delight",
      price: 5.0,
      count: mochaCount,
      setCount: setMochaCount,
      emoji: "🍫",
    },
  ];

  const filteredItems = coffeeItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalItems =
    espressoCount + latteCount + mochaCount;
  const totalPrice =
    espressoCount * 3.5 + latteCount * 4.75 + mochaCount * 5.0;

  const resetAll = () => {
    setEspressoCount(0);
    setLatteCount(0);
    setMochaCount(0);
    setSearchQuery("");
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-sm">
            <LuCoffee className="w-5 h-5 text-white" />
          </div>
          <div>
            <Heading level={4}>Coffee Order Counter</Heading>
            <Caption>Demo interaktif useState</Caption>
          </div>
        </div>
        <Badge variant="hot" size="sm">
          useState
        </Badge>
      </div>

      {/* Shop Status Toggle */}
      <div
        className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-300 ${
          isShopOpen
            ? "bg-emerald-50 border-emerald-200"
            : "bg-red-50 border-red-200"
        }`}
      >
        <div className="flex items-center gap-2">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              isShopOpen ? "bg-emerald-500 animate-pulse" : "bg-red-400"
            }`}
          />
          <span className="text-sm font-semibold text-[#2C1A0E]">
            Status Toko:{" "}
            <span className={isShopOpen ? "text-emerald-600" : "text-red-500"}>
              {isShopOpen ? "Buka" : "Tutup"}
            </span>
          </span>
        </div>
        <button
          onClick={() => setIsShopOpen(!isShopOpen)}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer ${
            isShopOpen
              ? "bg-emerald-500 text-white hover:bg-emerald-600"
              : "bg-red-400 text-white hover:bg-red-500"
          }`}
        >
          {isShopOpen ? "Tutup Toko" : "Buka Toko"}
        </button>
      </div>

      {/* Search Filter */}
      <div className="relative">
        <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari menu kopi..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all duration-200 bg-gray-50/50"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs cursor-pointer"
          >
            ✕
          </button>
        )}
      </div>

      {/* Coffee Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {filteredItems.map((item) => (
          <div
            key={item.name}
            className={`rounded-xl border p-4 text-center transition-all duration-300 ${
              isShopOpen
                ? "border-gray-100 bg-white hover:border-amber-200 hover:shadow-md"
                : "border-gray-100 bg-gray-50 opacity-50"
            }`}
          >
            <span className="text-3xl">{item.emoji}</span>
            <p className="text-sm font-bold text-[#2C1A0E] mt-2">
              {item.name}
            </p>
            <p className="text-xs text-gray-400 font-semibold">
              ${item.price.toFixed(2)}
            </p>
            <div className="flex items-center justify-center gap-2 mt-3">
              <button
                disabled={!isShopOpen || item.count <= 0}
                onClick={() => item.setCount(Math.max(0, item.count - 1))}
                className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:bg-red-100 hover:text-red-500 flex items-center justify-center transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                <LuMinus className="w-3.5 h-3.5" />
              </button>
              <span className="text-xl font-extrabold text-[#2C1A0E] w-8 text-center tabular-nums">
                {item.count}
              </span>
              <button
                disabled={!isShopOpen}
                onClick={() => item.setCount(item.count + 1)}
                className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 hover:bg-amber-200 flex items-center justify-center transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                <LuPlus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
        {filteredItems.length === 0 && (
          <div className="col-span-3 text-center py-8 text-gray-400 text-sm">
            Tidak ada menu yang cocok dengan "{searchQuery}"
          </div>
        )}
      </div>

      {/* Order Summary */}
      <div className="bg-gradient-to-r from-[#F9F5EE] to-amber-50 rounded-xl p-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
            Total Pesanan
          </p>
          <p className="text-2xl font-extrabold text-[#2C1A0E]">
            {totalItems} item{totalItems !== 1 && "s"} —{" "}
            <span className="text-amber-700">
              ${totalPrice.toFixed(2)}
            </span>
          </p>
        </div>
        <button
          onClick={resetAll}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-gray-200 text-xs font-bold text-gray-500 hover:text-red-500 hover:border-red-200 transition-all duration-200 cursor-pointer"
        >
          <LuRotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>
      </div>

      {/* Code Snippet */}
      <div className="bg-[#1E1E1E] rounded-xl p-4 overflow-x-auto">
        <pre className="text-xs leading-relaxed">
          <code>
            <span className="text-purple-400">const</span>{" "}
            <span className="text-blue-300">[espressoCount, setEspressoCount]</span>{" "}
            <span className="text-purple-400">=</span>{" "}
            <span className="text-yellow-300">useState</span>
            <span className="text-gray-300">(</span>
            <span className="text-orange-300">0</span>
            <span className="text-gray-300">);</span>
            {"\n"}
            <span className="text-purple-400">const</span>{" "}
            <span className="text-blue-300">[isShopOpen, setIsShopOpen]</span>{" "}
            <span className="text-purple-400">=</span>{" "}
            <span className="text-yellow-300">useState</span>
            <span className="text-gray-300">(</span>
            <span className="text-orange-300">true</span>
            <span className="text-gray-300">);</span>
            {"\n"}
            <span className="text-purple-400">const</span>{" "}
            <span className="text-blue-300">[searchQuery, setSearchQuery]</span>{" "}
            <span className="text-purple-400">=</span>{" "}
            <span className="text-yellow-300">useState</span>
            <span className="text-gray-300">(</span>
            <span className="text-emerald-300">""</span>
            <span className="text-gray-300">);</span>
            {"\n\n"}
            <span className="text-gray-500">
              {"// Klik tombol → setState → React re-render UI"}
            </span>
            {"\n"}
            <span className="text-yellow-300">setEspressoCount</span>
            <span className="text-gray-300">(espressoCount + </span>
            <span className="text-orange-300">1</span>
            <span className="text-gray-300">);</span>
          </code>
        </pre>
      </div>
    </div>
  );
}

// ============================================================
// Demo B: useEffect — Real-Time Clock & Brew Timer
// ============================================================
function UseEffectDemo() {
  // useEffect #1: Real-time clock
  const [currentTime, setCurrentTime] = useState(new Date());

  // useEffect #2: Brew timer
  const [brewTime, setBrewTime] = useState(30);
  const [isBrewing, setIsBrewing] = useState(false);
  const [brewComplete, setBrewComplete] = useState(false);

  // useEffect #3: Order log tracking
  const [orderLog, setOrderLog] = useState([]);
  const [orderCount, setOrderCount] = useState(0);

  // Effect 1: Clock — update setiap detik
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Cleanup: hapus interval saat komponen unmount
    return () => clearInterval(timer);
  }, []); // [] = hanya saat mount

  // Effect 2: Brew countdown
  useEffect(() => {
    if (!isBrewing || brewTime <= 0) {
      if (brewTime <= 0 && isBrewing) {
        setIsBrewing(false);
        setBrewComplete(true);
      }
      return;
    }

    const countdown = setInterval(() => {
      setBrewTime((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(countdown);
  }, [isBrewing, brewTime]); // Dependency: isBrewing & brewTime

  // Effect 3: Log setiap kali orderCount berubah
  useEffect(() => {
    if (orderCount > 0) {
      const timestamp = new Date().toLocaleTimeString("id-ID");
      setOrderLog((prev) => [
        { time: timestamp, count: orderCount },
        ...prev.slice(0, 4),
      ]);
    }
  }, [orderCount]); // Dependency: orderCount

  const startBrew = () => {
    setBrewTime(30);
    setBrewComplete(false);
    setIsBrewing(true);
  };

  const toggleBrew = () => {
    if (brewComplete) {
      startBrew();
    } else {
      setIsBrewing(!isBrewing);
    }
  };

  const brewPercentage = ((30 - brewTime) / 30) * 100;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-sm">
            <LuTimer className="w-5 h-5 text-white" />
          </div>
          <div>
            <Heading level={4}>Side Effects & Lifecycle</Heading>
            <Caption>Demo interaktif useEffect</Caption>
          </div>
        </div>
        <Badge variant="new" size="sm">
          useEffect
        </Badge>
      </div>

      {/* Grid of Effects */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Effect 1: Real-Time Clock */}
        <div className="rounded-xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-5 text-center">
          <Caption className="!text-emerald-600">
            ⏰ Real-Time Clock
          </Caption>
          <p className="text-sm text-gray-400 mt-1 mb-3">
            useEffect + setInterval
          </p>
          <div className="bg-[#1a2e1a] rounded-xl py-4 px-3">
            <p className="text-3xl font-mono font-extrabold text-emerald-400 tracking-wider tabular-nums">
              {currentTime.toLocaleTimeString("id-ID")}
            </p>
            <p className="text-[10px] text-emerald-600 mt-1 font-medium">
              {currentTime.toLocaleDateString("id-ID", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <p className="text-[10px] text-gray-400 mt-2 leading-relaxed">
            Dependency: <code className="text-emerald-600 bg-emerald-50 px-1 rounded">[]</code> — jalan sekali saat mount
          </p>
        </div>

        {/* Effect 2: Brew Timer */}
        <div className="rounded-xl border border-amber-100 bg-gradient-to-br from-amber-50 to-white p-5 text-center">
          <Caption className="!text-amber-600">
            ☕ Brew Timer
          </Caption>
          <p className="text-sm text-gray-400 mt-1 mb-3">
            useEffect + countdown
          </p>
          <div className="relative w-28 h-28 mx-auto mb-3">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke="#f3f4f6"
                strokeWidth="8"
              />
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke={brewComplete ? "#22c55e" : "#d97706"}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 52}`}
                strokeDashoffset={`${2 * Math.PI * 52 * (1 - brewPercentage / 100)}`}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-extrabold text-[#2C1A0E] tabular-nums">
                {brewTime}s
              </span>
              <span className="text-[9px] text-gray-400 font-semibold">
                {brewComplete ? "SELESAI!" : isBrewing ? "BREWING..." : "SIAP"}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={toggleBrew}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                brewComplete
                  ? "bg-emerald-500 text-white hover:bg-emerald-600"
                  : isBrewing
                  ? "bg-red-100 text-red-600 hover:bg-red-200"
                  : "bg-amber-500 text-white hover:bg-amber-600"
              }`}
            >
              {brewComplete ? (
                <LuRotateCcw className="w-3.5 h-3.5" />
              ) : isBrewing ? (
                <LuPause className="w-3.5 h-3.5" />
              ) : (
                <LuPlay className="w-3.5 h-3.5" />
              )}
              {brewComplete ? "Ulang" : isBrewing ? "Pause" : "Brew!"}
            </button>
            {!brewComplete && isBrewing && (
              <button
                onClick={() => {
                  setIsBrewing(false);
                  setBrewTime(30);
                }}
                className="px-3 py-2 rounded-full bg-gray-100 text-gray-500 text-xs font-bold hover:bg-gray-200 transition-all cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>
          <p className="text-[10px] text-gray-400 mt-2 leading-relaxed">
            Dependency:{" "}
            <code className="text-amber-600 bg-amber-50 px-1 rounded">
              [isBrewing, brewTime]
            </code>
          </p>
        </div>

        {/* Effect 3: Order Event Logger */}
        <div className="rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-5">
          <div className="text-center">
            <Caption className="!text-blue-600">
              📋 Order Logger
            </Caption>
            <p className="text-sm text-gray-400 mt-1 mb-3">
              useEffect + dependency
            </p>
          </div>
          <button
            onClick={() => setOrderCount((prev) => prev + 1)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-500 text-white text-sm font-bold hover:bg-blue-600 transition-all duration-200 cursor-pointer mb-3"
          >
            <LuPlus className="w-4 h-4" />
            Tambah Order #{orderCount + 1}
          </button>
          <div className="space-y-1.5 max-h-32 overflow-y-auto">
            {orderLog.length === 0 ? (
              <p className="text-center text-xs text-gray-300 py-4">
                Belum ada order...
              </p>
            ) : (
              orderLog.map((log, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all duration-300 ${
                    idx === 0
                      ? "bg-blue-100 text-blue-700 font-bold"
                      : "bg-gray-50 text-gray-500"
                  }`}
                >
                  <span>Order #{log.count}</span>
                  <span className="font-mono text-[10px]">{log.time}</span>
                </div>
              ))
            )}
          </div>
          <p className="text-[10px] text-gray-400 mt-2 text-center leading-relaxed">
            Dependency:{" "}
            <code className="text-blue-600 bg-blue-50 px-1 rounded">
              [orderCount]
            </code>
          </p>
        </div>
      </div>

      {/* Code Snippet */}
      <div className="bg-[#1E1E1E] rounded-xl p-4 overflow-x-auto">
        <pre className="text-xs leading-relaxed">
          <code>
            <span className="text-gray-500">{"// Effect 1: Clock (mount only)"}</span>
            {"\n"}
            <span className="text-yellow-300">useEffect</span>
            <span className="text-gray-300">{"(() => {"}</span>
            {"\n"}
            {"  "}
            <span className="text-purple-400">const</span>{" "}
            <span className="text-blue-300">timer</span>{" "}
            <span className="text-gray-300">= </span>
            <span className="text-yellow-300">setInterval</span>
            <span className="text-gray-300">{"(() => setCurrentTime("}</span>
            <span className="text-purple-400">new</span>
            <span className="text-emerald-300"> Date</span>
            <span className="text-gray-300">{"()), 1000);"}</span>
            {"\n"}
            {"  "}
            <span className="text-purple-400">return</span>
            <span className="text-gray-300">{" () => "}</span>
            <span className="text-yellow-300">clearInterval</span>
            <span className="text-gray-300">{"(timer);"}</span>
            <span className="text-gray-500"> {"// cleanup!"}</span>
            {"\n"}
            <span className="text-gray-300">{"}, "}</span>
            <span className="text-orange-300">{"[]"}</span>
            <span className="text-gray-300">{");"}</span>
            <span className="text-gray-500">
              {" // [] = hanya sekali saat mount"}
            </span>
          </code>
        </pre>
      </div>
    </div>
  );
}

// ============================================================
// Demo C: useRef — DOM Reference & Render Tracker
// ============================================================
function UseRefDemo() {
  // useRef #1: Referensi ke input DOM
  const searchInputRef = useRef(null);

  // useRef #2: Render counter (tanpa re-render)
  const renderCount = useRef(0);

  // useRef #3: Previous value tracker
  const prevNameRef = useRef("");

  // State untuk trigger render
  const [customerName, setCustomerName] = useState("");
  const [highlightSearch, setHighlightSearch] = useState(false);

  // Track renders
  renderCount.current += 1;

  // Track previous value
  useEffect(() => {
    prevNameRef.current = customerName;
  }, [customerName]);

  // Auto-focus pada search input
  const focusSearchInput = () => {
    searchInputRef.current?.focus();
    setHighlightSearch(true);
    setTimeout(() => setHighlightSearch(false), 1500);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-sm">
            <LuMousePointer2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <Heading level={4}>DOM Reference & Tracker</Heading>
            <Caption>Demo interaktif useRef</Caption>
          </div>
        </div>
        <Badge variant="iced" size="sm">
          useRef
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Ref 1: DOM Focus */}
        <div className="rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-5 space-y-3">
          <div className="text-center">
            <Caption className="!text-blue-600">🔍 Auto-Focus Input</Caption>
            <p className="text-sm text-gray-400 mt-1">
              useRef + DOM element
            </p>
          </div>
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Ketik nama kopi di sini..."
            className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all duration-300 focus:outline-none ${
              highlightSearch
                ? "border-blue-400 ring-4 ring-blue-100 bg-blue-50"
                : "border-gray-200 bg-white focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
            }`}
          />
          <button
            onClick={focusSearchInput}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-500 text-white text-sm font-bold hover:bg-blue-600 transition-all duration-200 cursor-pointer"
          >
            <LuSearch className="w-4 h-4" />
            Focus Input (useRef)
          </button>
          <p className="text-[10px] text-gray-400 text-center leading-relaxed">
            <code className="text-blue-600 bg-blue-50 px-1 rounded">
              searchInputRef.current.focus()
            </code>
          </p>
        </div>

        {/* Ref 2: Render Count Tracker */}
        <div className="rounded-xl border border-purple-100 bg-gradient-to-br from-purple-50 to-white p-5 space-y-3">
          <div className="text-center">
            <Caption className="!text-purple-600">
              🔢 Render Counter
            </Caption>
            <p className="text-sm text-gray-400 mt-1">
              useRef tanpa re-render
            </p>
          </div>
          <div className="bg-[#2d1f3d] rounded-xl py-5 text-center">
            <p className="text-5xl font-extrabold text-purple-400 font-mono tabular-nums">
              {renderCount.current}
            </p>
            <p className="text-[10px] text-purple-300 mt-1 font-semibold uppercase tracking-wider">
              Total Renders
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCustomerName(Date.now().toString().slice(-4))}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-purple-500 text-white text-xs font-bold hover:bg-purple-600 transition-all cursor-pointer"
            >
              <LuZap className="w-3.5 h-3.5" />
              Trigger Render
            </button>
          </div>
          <p className="text-[10px] text-gray-400 text-center leading-relaxed">
            <code className="text-purple-600 bg-purple-50 px-1 rounded">
              renderCount.current
            </code>{" "}
            tidak trigger re-render
          </p>
        </div>

        {/* Ref 3: Previous Value Tracker */}
        <div className="rounded-xl border border-teal-100 bg-gradient-to-br from-teal-50 to-white p-5 space-y-3">
          <div className="text-center">
            <Caption className="!text-teal-600">
              📝 Previous Value
            </Caption>
            <p className="text-sm text-gray-400 mt-1">
              useRef + useEffect
            </p>
          </div>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Ketik nama pelanggan..."
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-teal-300 focus:ring-2 focus:ring-teal-100 bg-white transition-all duration-200"
          />
          <div className="space-y-2">
            <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-teal-100">
              <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider">
                Current
              </span>
              <span className="text-sm font-bold text-teal-800 font-mono truncate max-w-[120px]">
                {customerName || "—"}
              </span>
            </div>
            <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-100">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                Previous
              </span>
              <span className="text-sm font-medium text-gray-600 font-mono truncate max-w-[120px]">
                {prevNameRef.current || "—"}
              </span>
            </div>
          </div>
          <p className="text-[10px] text-gray-400 text-center leading-relaxed">
            <code className="text-teal-600 bg-teal-50 px-1 rounded">
              prevNameRef.current
            </code>{" "}
            = nilai sebelumnya
          </p>
        </div>
      </div>

      {/* Code Snippet */}
      <div className="bg-[#1E1E1E] rounded-xl p-4 overflow-x-auto">
        <pre className="text-xs leading-relaxed">
          <code>
            <span className="text-gray-500">
              {"// useRef: akses DOM langsung"}
            </span>
            {"\n"}
            <span className="text-purple-400">const</span>{" "}
            <span className="text-blue-300">searchInputRef</span>{" "}
            <span className="text-purple-400">=</span>{" "}
            <span className="text-yellow-300">useRef</span>
            <span className="text-gray-300">(</span>
            <span className="text-orange-300">null</span>
            <span className="text-gray-300">);</span>
            {"\n"}
            <span className="text-purple-400">const</span>{" "}
            <span className="text-blue-300">renderCount</span>{" "}
            <span className="text-purple-400">=</span>{" "}
            <span className="text-yellow-300">useRef</span>
            <span className="text-gray-300">(</span>
            <span className="text-orange-300">0</span>
            <span className="text-gray-300">);</span>
            {"\n\n"}
            <span className="text-gray-500">
              {"// Akses DOM element tanpa re-render"}
            </span>
            {"\n"}
            <span className="text-blue-300">searchInputRef</span>
            <span className="text-gray-300">.current.</span>
            <span className="text-yellow-300">focus</span>
            <span className="text-gray-300">();</span>
            {"\n"}
            <span className="text-blue-300">renderCount</span>
            <span className="text-gray-300">.current += </span>
            <span className="text-orange-300">1</span>
            <span className="text-gray-300">;</span>
            <span className="text-gray-500">
              {" // tidak trigger re-render!"}
            </span>
          </code>
        </pre>
      </div>
    </div>
  );
}

// ============================================================
// Halaman Utama: React Hooks
// ============================================================
export default function ReactHooks() {
  return (
    <div className="space-y-8 animate-[fadeIn_0.5s_ease-out]">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: "Dashboard", to: "/dashboard" },
          { label: "React Hooks" },
        ]}
      />

      {/* Page Header */}
      <PageHeader
        title="React Hooks"
        subtitle="Implementasi useState, useEffect, dan useRef dengan tema Coffee Shop"
      />

      {/* Info Banner */}
      <SlideUp duration={0.4}>
        <div className="bg-gradient-to-r from-[#8B5F3C] to-[#6B4226] rounded-2xl p-6 flex items-start gap-4 text-white shadow-lg shadow-amber-900/10">
          <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center shrink-0">
            <LuInfo className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Penjelasan 5W + 1H</h3>
            <p className="text-white/80 text-sm mt-1 leading-relaxed">
              Silahkan cari penjelasan online boleh di YouTube, Medium, atau web tutorial lainnya lalu buat penjelasan dalam format 5W+1H terkait penggunaan masing-masing hook berikut. Klik setiap item di bawah untuk melihat jawaban.
            </p>
          </div>
        </div>
      </SlideUp>

      {/* 5W+1H Explanation Cards */}
      <SlideUp duration={0.4} delay={0.1}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <ExplanationCard hookKey="useState" />
          <ExplanationCard hookKey="useEffect" />
          <ExplanationCard hookKey="useRef" />
        </div>
      </SlideUp>

      {/* Section Divider */}
      <div className="flex items-center gap-4 py-2">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-200 to-transparent" />
        <span className="text-sm font-bold text-[#8B5F3C] flex items-center gap-2">
          <LuEye className="w-4 h-4" />
          Demo Interaktif
        </span>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-200 to-transparent" />
      </div>

      {/* Demo A: useState */}
      <SlideUp duration={0.4} delay={0.15}>
        <UseStateDemo />
      </SlideUp>

      {/* Demo B: useEffect */}
      <SlideUp duration={0.4} delay={0.2}>
        <UseEffectDemo />
      </SlideUp>

      {/* Demo C: useRef */}
      <SlideUp duration={0.4} delay={0.25}>
        <UseRefDemo />
      </SlideUp>
    </div>
  );
}
