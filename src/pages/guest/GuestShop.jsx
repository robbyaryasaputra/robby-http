import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LuShoppingCart, LuSearch } from "react-icons/lu";
import { supabase } from "../../lib/supabase";
import {
  getMenuItems,
  getCategories,
  createOrder as createOrderDb,
  toggleFavorite as toggleFavDb,
} from "../../lib/db";
import { CoffeeBeanIcon } from "../../components/media";
import { SlideUp } from "../../components/animation";

// Import modular sub-components
import GuestHero from "./components/GuestHero";
import CategorySlider from "./components/CategorySlider";
import MenuGrid from "./components/MenuGrid";
import CartDrawer from "./components/CartDrawer";
import CheckoutSuccessModal from "./components/CheckoutSuccessModal";
import OrderTracking from "./components/OrderTracking";
import ReviewSection from "./components/ReviewSection";
import ContactWidget from "./components/ContactWidget";

export default function GuestShop() {
  const navigate = useNavigate();

  // Shop States
  const [cart, setCart] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState([]);

  // Cart/Checkout States
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(null);
  const [checkoutForm, setCheckoutForm] = useState({
    name: "",
    deliveryType: "table",
    tableNumber: "",
    paymentMethod: "Cash",
    notes: "",
  });

  // Track Order States
  const [trackIdInput, setTrackIdInput] = useState("");
  const [trackedOrder, setTrackedOrder] = useState(null);
  const [trackError, setTrackError] = useState(null);

  // Promo Code States
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState("");

  // Menu items from DB
  const [menuItems, setMenuItems] = useState([]);
  const [categoriesList, setCategoriesList] = useState(["All"]);

  // Subtotal & Total Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const tax = subtotal * 0.1; // 10% tax/service charge
  const calculatePromoDiscount = () => {
    if (!appliedPromo) return 0;
    const discountVal = Number(appliedPromo.discount_value || 0);
    if (appliedPromo.discount_type === "percentage") {
      return (subtotal * discountVal) / 100;
    } else {
      return discountVal;
    }
  };
  const promoDiscount = calculatePromoDiscount();
  const total = Math.max(0, subtotal + tax - promoDiscount);

  const handleApplyPromo = async (codeStr) => {
    setPromoError("");
    if (!codeStr) {
      setAppliedPromo(null);
      return;
    }
    try {
      const { data, error } = await supabase
        .from("promotions")
        .select("*")
        .eq("code", codeStr.toUpperCase())
        .eq("is_active", true)
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        setPromoError("Kode voucher tidak valid.");
        setAppliedPromo(null);
        return;
      }

      const now = new Date();
      const startDate = new Date(data.start_date);
      const endDate = new Date(data.end_date);
      if (now < startDate || now > endDate) {
        setPromoError("Voucher ini sudah kedaluwarsa atau belum dimulai.");
        setAppliedPromo(null);
        return;
      }

      if (subtotal < Number(data.min_order_amount || 0)) {
        setPromoError(
          `Minimal belanja untuk voucher ini adalah IDR ${Number(data.min_order_amount).toLocaleString("id-ID")}.`,
        );
        setAppliedPromo(null);
        return;
      }

      if (data.max_uses && data.current_uses >= data.max_uses) {
        setPromoError("Kuota voucher ini sudah habis.");
        setAppliedPromo(null);
        return;
      }

      if (data.member_only) {
        setPromoError("Voucher ini khusus untuk loyalty member.");
        setAppliedPromo(null);
        return;
      }

      setAppliedPromo(data);
    } catch (err) {
      console.error(err);
      setPromoError("Gagal memvalidasi kode voucher.");
    }
  };

  // Review & Feedback States
  const [reviews, setReviews] = useState(() => {
    const stored = localStorage.getItem("customer_reviews");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error(e);
      }
    }
    const defaultReviews = [
      {
        id: "REV-001",
        name: "Budi Santoso",
        category: "Pelayanan",
        rating: 5,
        comment:
          "Baristanya sangat ramah dan penyajian kopinya cepat sekali! Tempatnya bersih dan nyaman.",
        date: "2026-06-24",
      },
      {
        id: "REV-002",
        name: "Siti Rahayu",
        category: "Rasa Menu",
        rating: 4,
        comment:
          "Caramel Macchiato-nya pas manisnya, espresso-nya harum. Sangat direkomendasikan!",
        date: "2026-06-23",
      },
    ];
    localStorage.setItem("customer_reviews", JSON.stringify(defaultReviews));
    return defaultReviews;
  });

  const handleAddReview = (reviewData) => {
    const reviewObject = {
      id: "REV-" + Math.floor(100 + Math.random() * 900),
      name: reviewData.name,
      category: reviewData.category,
      rating: reviewData.rating,
      comment: reviewData.comment,
      date: new Date().toISOString().split("T")[0],
    };
    const updated = [reviewObject, ...reviews];
    setReviews(updated);
    localStorage.setItem("customer_reviews", JSON.stringify(updated));
    alert("Terima kasih atas ulasan Anda!");
  };

  // Load favorites
  useEffect(() => {
    const init = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        const user = storedUser ? JSON.parse(storedUser) : null;
        if (user) {
          const { data: favs } = await supabase
            .from("favorites")
            .select("menu_item_id")
            .eq("customer_id", user.id);
          setFavorites((favs || []).map((r) => r.menu_item_id));
          return;
        }
      } catch (e) {
        console.error(e);
      }

      const favs = localStorage.getItem("guest_favorites");
      if (favs) {
        try {
          setFavorites(JSON.parse(favs));
        } catch (e) {
          console.error(e);
        }
      }
    };
    init();
  }, []);

  const toggleFavorite = (id) => {
    (async () => {
      try {
        const storedUser = localStorage.getItem("user");
        const user = storedUser ? JSON.parse(storedUser) : null;
        if (user) {
          await toggleFavDb(user.id, id);
          const { data: favs } = await supabase
            .from("favorites")
            .select("menu_item_id")
            .eq("customer_id", user.id);
          setFavorites((favs || []).map((r) => r.menu_item_id));
          return;
        }
      } catch (e) {
        console.error(e);
      }

      let updated;
      if (favorites.includes(id)) {
        updated = favorites.filter((fid) => fid !== id);
      } else {
        updated = [...favorites, id];
      }
      setFavorites(updated);
      localStorage.setItem("guest_favorites", JSON.stringify(updated));
    })();
  };

  // Add to Cart
  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, qty: i.qty + 1 } : i,
        );
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  // Update Cart Qty
  const updateQty = (id, change) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.qty + change;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean),
    );
  };

  // Remove from Cart
  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  // Handle Order Submit
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    if (!checkoutForm.name.trim()) {
      alert("Harap masukkan nama Anda!");
      return;
    }
    if (
      checkoutForm.deliveryType === "table" &&
      !checkoutForm.tableNumber.trim()
    ) {
      alert("Harap masukkan nomor meja Anda!");
      return;
    }

    try {
      const orderPayload = {
        order_number: null,
        customer_id: null,
        customer_name: checkoutForm.name,
        status: "pending",
        delivery_type:
          checkoutForm.deliveryType === "table" ? "dine_in" : "takeaway",
        table_number:
          checkoutForm.deliveryType === "table"
            ? checkoutForm.tableNumber
            : null,
        subtotal: subtotal,
        discount_amount: promoDiscount,
        tax_amount: tax,
        total_amount: parseFloat(total.toFixed(2)),
        notes: checkoutForm.notes,
      };

      const itemsPayload = cart.map((item) => ({
        menu_item_id: item.id,
        item_name: item.name,
        quantity: item.qty || item.quantity || 1,
        unit_price: item.price,
        subtotal: item.price * (item.qty || item.quantity || 1),
      }));

      const storedUser = localStorage.getItem("user");
      const user = storedUser ? JSON.parse(storedUser) : null;
      orderPayload.customer_id = user?.id || null;

      const res = await createOrderDb(orderPayload, itemsPayload, {
        payment_method: checkoutForm.paymentMethod.toLowerCase(),
        amount: orderPayload.total_amount,
        status: "pending",
      });

      if (res.error) throw res.error;

      if (appliedPromo) {
        await supabase
          .from("promotions")
          .update({ current_uses: (appliedPromo.current_uses || 0) + 1 })
          .eq("id", appliedPromo.id);
      }

      const createdOrder = res.data;
      const trackOrder = {
        id: createdOrder.order_number || createdOrder.id,
        customer: checkoutForm.name,
        items: cart.map((item) => ({
          name: item.name,
          qty: item.qty,
          price: item.price,
        })),
        total: parseFloat(total.toFixed(2)),
        status: "Pending",
        date: new Date(createdOrder.created_at || new Date())
          .toISOString()
          .split("T")[0],
        paymentMethod: checkoutForm.paymentMethod,
        promoCode: appliedPromo?.code || null,
        tableNumber:
          checkoutForm.deliveryType === "table"
            ? checkoutForm.tableNumber
            : null,
        notes: checkoutForm.notes,
      };

      const existingOrdersStr = localStorage.getItem("orders");
      let ordersList = [];
      if (existingOrdersStr) {
        try {
          ordersList = JSON.parse(existingOrdersStr);
        } catch (err) {
          console.error(err);
        }
      }
      ordersList.unshift(trackOrder);
      localStorage.setItem("orders", JSON.stringify(ordersList));

      setPromoCode("");
      setAppliedPromo(null);
      setCart([]);
      setCheckoutSuccess({
        id: createdOrder.order_number || createdOrder.id,
        total: parseFloat(total.toFixed(2)),
        paymentMethod: checkoutForm.paymentMethod,
        promoCode: appliedPromo?.code || null,
      });
      setCheckoutForm({
        name: "",
        deliveryType: "table",
        tableNumber: "",
        paymentMethod: "Cash",
        notes: "",
      });
      setTrackIdInput(createdOrder.order_number || createdOrder.id);
      setTrackedOrder(trackOrder);
    } catch (err) {
      console.error(err);
      alert("Gagal membuat pesanan. Silakan coba lagi.");
    }
  };

  // Track Order Logic
  const handleTrackOrder = (e) => {
    e.preventDefault();
    setTrackError(null);
    setTrackedOrder(null);

    if (!trackIdInput.trim()) {
      setTrackError("Harap masukkan ID Pesanan!");
      return;
    }

    const existingOrdersStr = localStorage.getItem("orders");
    let ordersList = [];
    if (existingOrdersStr) {
      try {
        ordersList = JSON.parse(existingOrdersStr);
      } catch (err) {
        console.error(err);
      }
    }

    const found = ordersList.find(
      (o) => o.id.toLowerCase() === trackIdInput.trim().toLowerCase(),
    );

    if (found) {
      setTrackedOrder(found);
    } else {
      setTrackError(
        "ID Pesanan tidak ditemukan. Coba cek kembali penulisannya (contoh: ORD-001).",
      );
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const { data: itemsData, error: itemsErr } = await getMenuItems({
          limit: 200,
        });
        if (!itemsErr) setMenuItems(itemsData || []);
        const { data: catsData } = await getCategories();
        if (catsData && catsData.length)
          setCategoriesList(["All", ...catsData.map((c) => c.name)]);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  const filteredMenu = menuItems.filter((item) => {
    const matchesSearch =
      (item.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === "All" ||
      (item.category || "").toLowerCase() ===
        (activeCategory || "").toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#F9F5EE] text-[#2C1A0E] font-sans antialiased scroll-smooth">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#EBE3D5] shadow-sm py-4 px-6 md:px-12 flex justify-between items-center transition-all duration-300">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#855C3B] flex items-center justify-center shadow-md">
            <CoffeeBeanIcon size="sm" color="#FAF4EE" />
          </div>
          <span className="font-extrabold text-xl tracking-wide text-[#4B2C20]">
            Bean & Brew
          </span>
        </div>

        {/* Desktop Menu links */}
        <div className="hidden md:flex items-center gap-8 font-semibold text-sm text-[#5F3A27]">
          <a
            href="#hero"
            className="hover:text-[#855C3B] transition-colors duration-200"
          >
            Beranda
          </a>
          <a
            href="#about"
            className="hover:text-[#855C3B] transition-colors duration-200"
          >
            Tentang Kami
          </a>
          <a
            href="#menu"
            className="hover:text-[#855C3B] transition-colors duration-200"
          >
            Menu Kopi
          </a>
          <a
            href="#track"
            className="hover:text-[#855C3B] transition-colors duration-200"
          >
            Lacak Pesanan
          </a>
          <a
            href="#feedback"
            className="hover:text-[#855C3B] transition-colors duration-200"
          >
            Ulasan
          </a>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2.5 rounded-full bg-[#FAF4EE] hover:bg-[#F2E7DC] text-[#4B2C20] transition-all duration-200 shadow-sm cursor-pointer border-0"
          >
            <LuShoppingCart className="w-5.5 h-5.5" />
            {cart.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#855C3B] text-[#FAF4EE] text-xs font-bold w-5.5 h-5.5 rounded-full flex items-center justify-center animate-bounce shadow-md">
                {cart.reduce((sum, i) => sum + i.qty, 0)}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <GuestHero />

      {/* About Us Section */}
      <section id="about" className="py-24 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <SlideUp delay={0.2} className="grid grid-cols-2 gap-4">
            <img
              src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=350&h=450&fit=crop"
              alt="Biji Kopi"
              className="w-full h-80 object-cover rounded-3xl shadow-lg transform translate-y-8"
            />
            <img
              src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=350&h=450&fit=crop"
              alt="Barista brewing"
              className="w-full h-80 object-cover rounded-3xl shadow-lg"
            />
          </SlideUp>

          <SlideUp delay={0.3} className="space-y-6 text-left">
            <span className="text-xs font-bold uppercase tracking-widest text-[#855C3B]">
              Filosofi Cangkir Kami
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#4B2C20] tracking-tight">
              Di Sini, Kopi Bukan Sekadar Minuman, Kopi Adalah Karya Seni.
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Bean & Brew hadir dari mimpi menghadirkan cangkir kopi berkualitas
              dunia langsung ke genggaman Anda. Kami mendatangkan biji kopi
              organik langsung dari petani lokal terbaik, melalui penyortiran
              ketat, serta proses pemanggangan (roasting) modern untuk mengunci
              cita rasa khasnya.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Barista kami dilatih khusus dengan dedikasi tinggi agar setiap
              ekstraksi espresso menghasilkan keseimbangan rasa (body, acidity,
              sweetness) yang sempurna. Nikmati di kedai kami yang nyaman atau
              pesan ke meja Anda secara instan.
            </p>

            <div className="grid grid-cols-3 gap-6 pt-4 border-t border-gray-100">
              <div>
                <h4 className="text-2xl font-black text-[#855C3B]">100%</h4>
                <p className="text-xs text-gray-500 mt-1 font-semibold">
                  Organik & Asli
                </p>
              </div>
              <div>
                <h4 className="text-2xl font-black text-[#855C3B]">Freshly</h4>
                <p className="text-xs text-gray-500 mt-1 font-semibold">
                  Dipanggang Harian
                </p>
              </div>
              <div>
                <h4 className="text-2xl font-black text-[#855C3B]">
                  Professional
                </h4>
                <p className="text-xs text-gray-500 mt-1 font-semibold">
                  Barista Bersertifikat
                </p>
              </div>
            </div>
          </SlideUp>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="py-24 px-6 md:px-12 bg-[#F9F5EE]">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-[#855C3B]">
              Seleksi Menu Terbaik
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#4B2C20]">
              Jelajahi Cita Rasa Favorit Anda
            </h2>
            <p className="text-gray-600 text-sm">
              Dari rasa manis latte caramel yang lembut hingga rasa espresso
              murni yang kuat dan tegas, temukan pilihan kopi yang paling cocok
              dengan selera hari ini.
            </p>
          </div>

          {/* Search & Category Filter Controls */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white p-4 rounded-3xl shadow-sm border border-[#EBE3D5]">
            {/* Search */}
            <div className="relative w-full md:w-80">
              <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Cari kopi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-[#F9F5EE] border border-[#EBE3D5] text-[#2C1A0E] text-sm focus:outline-none focus:ring-2 focus:ring-[#855C3B]/20 focus:border-[#855C3B] transition-all"
              />
            </div>

            {/* Filter categories */}
            <CategorySlider
              categoriesList={categoriesList}
              activeCategory={activeCategory}
              onSelectCategory={setActiveCategory}
            />
          </div>

          {/* Menu Grid */}
          <MenuGrid
            filteredMenu={filteredMenu}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            onAddToCart={addToCart}
          />

          {/* Online Delivery Platform Integration */}
          <div className="bg-gradient-to-r from-[#855C3B]/10 to-[#5F3A27]/5 rounded-3xl p-8 border border-[#855C3B]/20 flex flex-col lg:flex-row justify-between items-center gap-6 mt-16 text-left animate-[fadeIn_0.5s_ease-out]">
            <div className="space-y-1 max-w-xl">
              <h3 className="font-extrabold text-lg text-[#4B2C20]">
                Ingin Menikmati Kopi di Rumah?
              </h3>
              <p className="text-gray-600 text-xs leading-relaxed">
                Selain melalui pemesanan langsung (*Order & Pay Ahead*) untuk
                makan di tempat atau bawa pulang, Anda juga bisa memesan menu
                kopi favorit kami melalui platform pengiriman online favorit
                Anda.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="https://gofood.link"
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-6 bg-[#E62E2D] hover:bg-[#c92524] text-white font-extrabold text-xs rounded-xl shadow-md shadow-[#E62E2D]/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                GoFood
              </a>
              <a
                href="https://grab.com"
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-6 bg-[#00B14F] hover:bg-[#009642] text-white font-extrabold text-xs rounded-xl shadow-md shadow-[#00B14F]/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                GrabFood
              </a>
              <a
                href="https://shopee.co.id"
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-6 bg-[#EE4D2D] hover:bg-[#d63f21] text-white font-extrabold text-xs rounded-xl shadow-md shadow-[#EE4D2D]/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                ShopeeFood
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Order Tracking Section */}
      <OrderTracking
        trackIdInput={trackIdInput}
        setTrackIdInput={setTrackIdInput}
        onTrackOrder={handleTrackOrder}
        trackedOrder={trackedOrder}
        trackError={trackError}
      />

      {/* Reviews & Feedback Section */}
      <ReviewSection reviews={reviews} onAddReview={handleAddReview} />

      {/* Footer */}
      <footer className="bg-[#4B2C20] text-amber-100 py-16 px-6 md:px-12 border-t border-[#3F2419]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-left">
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500 flex items-center justify-center">
                <CoffeeBeanIcon size="sm" color="#FAF4EE" />
              </div>
              <span className="font-extrabold text-xl tracking-wide text-white">
                Bean & Brew
              </span>
            </div>
            <p className="text-sm text-amber-100/60 max-w-sm leading-relaxed">
              Kedai kopi modern yang mengutamakan kualitas ekstraksi kopi
              premium, suasana santai yang nyaman, dan layanan pelanggan tanpa
              hambatan.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-white tracking-wide text-sm uppercase">
              Jam Operasional
            </h4>
            <ul className="text-sm text-amber-100/70 space-y-2">
              <li className="flex justify-between">
                <span>Senin - Jumat</span>
                <span className="font-bold">07:00 - 22:00</span>
              </li>
              <li className="flex justify-between">
                <span>Sabtu - Minggu</span>
                <span className="font-bold">08:00 - 23:00</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-white tracking-wide text-sm uppercase">
              Hubungi Kami
            </h4>
            <p className="text-sm text-amber-100/70 leading-relaxed">
              Jl. Kopi Senja No. 42, Kota Jakarta
              <br />
              <span className="font-bold text-white block mt-1">
                support@beanbrew.com
              </span>
              <span className="font-bold text-white">(+62) 21-8888-999</span>
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 mt-12 border-t border-[#3F2419]/60 text-center text-xs text-amber-100/40">
          <p>
            © {new Date().getFullYear()} Bean & Brew Coffee Shop. All rights
            reserved.
          </p>
        </div>
      </footer>

      {/* Success Checkout Modal Overlay */}
      <CheckoutSuccessModal
        checkoutSuccess={checkoutSuccess}
        onClose={() => {
          setCheckoutSuccess(null);
          document
            .getElementById("track")
            ?.scrollIntoView({ behavior: "smooth" });
        }}
      />

      {/* Cart Drawer Panel */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQty={updateQty}
        onRemoveFromCart={removeFromCart}
        promoCode={promoCode}
        setPromoCode={setPromoCode}
        onApplyPromo={handleApplyPromo}
        appliedPromo={appliedPromo}
        promoError={promoError}
        subtotal={subtotal}
        tax={tax}
        promoDiscount={promoDiscount}
        total={total}
        checkoutForm={checkoutForm}
        setCheckoutForm={setCheckoutForm}
        onSubmitOrder={handlePlaceOrder}
      />

      {/* Floating Social Contact CTA Widget */}
      <ContactWidget />
    </div>
  );
}
