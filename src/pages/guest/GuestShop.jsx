import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LuShoppingCart, LuSearch, LuAward } from "react-icons/lu";
import { supabase } from "../../lib/supabase";
import {
  getMenuItems,
  getCategories,
  createOrder as createOrderDb,
  toggleFavorite as toggleFavDb,
} from "../../lib/db";
import { useAuth } from "../../contexts/AuthContext";
import { CoffeeBeanIcon } from "../../components/media";
import { SlideUp, FadeIn } from "../../components/animation";

// Import modular sub-components
import GuestHero from "./components/GuestHero";
import CategorySlider from "./components/CategorySlider";
import MenuGrid from "./components/MenuGrid";
import CartDrawer from "./components/CartDrawer";
import CheckoutSuccessModal from "./components/CheckoutSuccessModal";
import OrderTracking from "./components/OrderTracking";
import ReviewSection from "./components/ReviewSection";
import ContactWidget from "./components/ContactWidget";
import AuthPromptModal from "./components/AuthPromptModal";

export default function GuestShop() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const isLoggedIn = !!user;

  // Auth prompt modal state (cart wall)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

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
          `Minimal belanja untuk voucher ini adalah $${Number(data.min_order_amount).toFixed(2)}.`,
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

  // Auto-open cart after login redirect (cart_intent) and auto-fill name from profile
  useEffect(() => {
    if (isLoggedIn) {
      const intent = sessionStorage.getItem("cart_intent");
      if (intent === "open") {
        sessionStorage.removeItem("cart_intent");
        setIsCartOpen(true);
      }
      // Auto-fill checkout name from member profile
      if (profile?.name) {
        setCheckoutForm((prev) => ({
          ...prev,
          name: prev.name || profile.name,
        }));
      }
    }
  }, [isLoggedIn, profile]);

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

  // Cart wall: show auth modal if not logged in, else open cart
  const handleOpenCart = () => {
    if (!isLoggedIn) {
      setIsAuthModalOpen(true);
    } else {
      setIsCartOpen(true);
    }
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
        customer_id: user?.id || null,  // ← gunakan auth session, bukan localStorage
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

      // customer_id sudah di-set dari useAuth session di atas
      // (localStorage fallback dihapus — gunakan Supabase auth)

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
    <div className="min-h-screen text-[#1a0f07] font-sans antialiased scroll-smooth" style={{ background: "#faf8f3" }}>
      {/* ===== NAVBAR ===== */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#ede8e1] shadow-sm py-4 px-6 md:px-12 flex justify-between items-center transition-all duration-300">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#2c1a0e] flex items-center justify-center shadow-md">
            <CoffeeBeanIcon size="sm" color="#f5c842" />
          </div>
          <div>
            <span className="font-bold text-lg tracking-wide text-[#1a0f07] block" style={{ fontFamily: "'Georgia', serif" }}>
              Artisanal Bean
            </span>
            <span className="text-[9px] text-[#8b6f47] font-bold uppercase tracking-widest block -mt-1">
              Coffee & Roastery
            </span>
          </div>
        </div>

        {/* Desktop Menu links */}
        <div className="hidden md:flex items-center gap-8 font-semibold text-sm">
          <a href="#hero" className="nav-link">
            Beranda
          </a>
          <a href="#about" className="nav-link">
            Tentang Kami
          </a>
          <a href="#menu" className="nav-link">
            Menu Kopi
          </a>
          <a href="#track" className="nav-link">
            Lacak Pesanan
          </a>
          <a href="#feedback" className="nav-link">
            Ulasan
          </a>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <button
              onClick={() => navigate("/member")}
              className="hidden sm:flex items-center gap-1.5 text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:opacity-90 transition-all shadow-md active:scale-[0.97] border-0 cursor-pointer"
              style={{
                background: "#8b6f47",
                boxShadow: "0 2px 8px rgba(139, 111, 71, 0.2)",
              }}
            >
              <LuAward className="w-3.5 h-3.5" />
              Portal Member
            </button>
          ) : (
            <button
              onClick={() => navigate("/auth/login")}
              className="hidden sm:flex items-center gap-1.5 text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:opacity-90 transition-all shadow-md active:scale-[0.97] border-0 cursor-pointer"
              style={{
                background: "#1a0f07",
                boxShadow: "0 2px 8px rgba(26, 15, 7, 0.2)",
              }}
            >
              Sign In
            </button>
          )}

          {/* Cart icon */}
          <button
            onClick={handleOpenCart}
            className="relative p-2.5 rounded-xl hover:bg-[#f5f0ea] text-[#1a0f07] border border-[#ede8e1] transition-all duration-200 shadow-sm cursor-pointer bg-transparent"
          >
            <LuShoppingCart className="w-5 h-5" />
            {cart.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#1a0f07] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                {cart.reduce((sum, i) => sum + i.qty, 0)}
              </span>
            )}
          </button>
        </div>
      </nav>

      <FadeIn duration={0.8}>
        {/* Hero Section */}
        <GuestHero />

        {/* About Us Section */}
        <section id="about" className="py-24 px-6 md:px-12 bg-white">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <SlideUp delay={0.2} className="grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=350&h=450&fit=crop"
                alt="Biji Kopi"
                className="w-full h-80 object-cover rounded-2xl shadow-lg transform translate-y-8"
              />
              <img
                src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=350&h=450&fit=crop"
                alt="Barista brewing"
                className="w-full h-80 object-cover rounded-2xl shadow-lg"
              />
            </SlideUp>

            <SlideUp delay={0.3} className="space-y-6 text-left">
              <span className="text-xs font-bold uppercase tracking-widest text-[#8b6f47]">
                Filosofi Cangkir Kami
              </span>
              <h2 className="text-3xl md:text-4xl font-normal text-[#1a0f07] tracking-tight" style={{ fontFamily: "'Georgia', serif" }}>
                Di Sini, Kopi Bukan Sekadar Minuman, Kopi Adalah Karya Seni.
              </h2>
              <p className="text-[#8a7868] leading-relaxed text-sm">
                Artisanal Bean hadir dari mimpi menghadirkan cangkir kopi berkualitas
                dunia langsung ke genggaman Anda. Kami mendatangkan biji kopi
                organik langsung dari petani lokal terbaik, melalui penyortiran
                ketat, serta proses pemanggangan (roasting) modern untuk mengunci
                cita rasa khasnya.
              </p>
              <p className="text-[#8a7868] leading-relaxed text-sm">
                Barista kami dilatih khusus dengan dedikasi tinggi agar setiap
                ekstraksi espresso menghasilkan keseimbangan rasa (body, acidity,
                sweetness) yang sempurna. Nikmati di kedai kami yang nyaman atau
                pesan ke meja Anda secara instan.
              </p>

              <div className="grid grid-cols-3 gap-6 pt-4 border-t border-[#ede8e1]">
                <div>
                  <h4 className="text-2xl font-bold text-[#8b6f47]">100%</h4>
                  <p className="text-xs text-[#8a7868] mt-1 font-semibold">
                    Organik & Asli
                  </p>
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-[#8b6f47]">Freshly</h4>
                  <p className="text-xs text-[#8a7868] mt-1 font-semibold">
                    Dipanggang Harian
                  </p>
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-[#8b6f47]">
                    Professional
                  </h4>
                  <p className="text-xs text-[#8a7868] mt-1 font-semibold">
                    Barista Bersertifikat
                  </p>
                </div>
              </div>
            </SlideUp>
          </div>
        </section>

        {/* Menu Section */}
        <section id="menu" className="py-24 px-6 md:px-12 bg-[#faf8f3]">
          <div className="max-w-7xl mx-auto space-y-12">
            {/* Header */}
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-widest text-[#8b6f47]">
                Seleksi Menu Terbaik
              </span>
              <h2 className="text-3xl md:text-4xl font-normal text-[#1a0f07]" style={{ fontFamily: "'Georgia', serif" }}>
                Jelajahi Cita Rasa Favorit Anda
              </h2>
              <p className="text-[#8a7868] text-sm leading-relaxed">
                Dari rasa manis latte caramel yang lembut hingga rasa espresso
                murni yang kuat dan tegas, temukan pilihan kopi yang paling cocok
                dengan selera hari ini.
              </p>
            </div>

            {/* Search & Category Filter Controls */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white p-4 rounded-2xl shadow-sm border border-[#ede8e1]">
              {/* Search */}
              <div className="relative w-full md:w-80">
                <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#b0a090] w-4 h-4" />
                <input
                  type="text"
                  placeholder="Cari kopi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#faf8f3] border border-[#ede8e1] rounded-xl text-[#1a0f07] text-sm focus:outline-none focus:border-[#8b6f47]/50 transition-all"
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
            <div className="bg-gradient-to-r from-[#8b6f47]/10 to-[#2c1a0e]/5 rounded-2xl p-8 border border-[#ede8e1] flex flex-col lg:flex-row justify-between items-center gap-6 mt-16 text-left animate-[fadeIn_0.5s_ease-out]">
              <div className="space-y-1 max-w-xl">
                <h3 className="font-bold text-lg text-[#1a0f07]">
                  Ingin Menikmati Kopi di Rumah?
                </h3>
                <p className="text-[#8a7868] text-xs leading-relaxed">
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
        <footer style={{ background: "#1c1109", padding: "48px 32px", borderTop: "1px solid #2e1e12" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "32px", textAlign: "left" }}>
            <div className="space-y-4">
              <span style={{ fontFamily: "'Georgia', serif", fontSize: "20px", fontWeight: "700", color: "#f5c842" }}>
                Artisanal Bean
              </span>
              <p className="text-xs text-white/60 max-w-xs leading-relaxed">
                Kedai kopi modern yang mengutamakan kualitas ekstraksi kopi
                premium, suasana santai yang nyaman, dan layanan pelanggan tanpa
                hambatan.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold tracking-wider text-xs uppercase" style={{ color: "#f5c842" }}>
                Jam Operasional
              </h4>
              <ul className="text-xs text-white/60 space-y-1.5" style={{ listStyle: "none", padding: 0, margin: 0 }}>
                <li className="flex justify-between">
                  <span>Senin - Jumat</span>
                  <span className="font-bold text-white">07:00 - 22:00</span>
                </li>
                <li className="flex justify-between">
                  <span>Sabtu - Minggu</span>
                  <span className="font-bold text-white">08:00 - 23:00</span>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold tracking-wider text-xs uppercase" style={{ color: "#f5c842" }}>
                Hubungi Kami
              </h4>
              <p className="text-xs text-white/60 leading-relaxed">
                Jl. Kopi Senja No. 42, Kota Jakarta
                <br />
                <span className="font-bold text-white block mt-1">
                  support@artisanalbean.com
                </span>
                <span className="font-bold text-white">(+62) 21-8888-999</span>
              </p>
            </div>
          </div>

          <div className="max-w-7xl mx-auto pt-8 mt-12 border-t border-[#2e1e12] text-center text-xs text-white/30">
            <p>
              © {new Date().getFullYear()} Artisanal Bean Coffee Shop. All rights reserved.
            </p>
          </div>
        </footer>
      </FadeIn>

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

      {/* Auth Prompt Modal (Cart Wall) */}
      <AuthPromptModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Floating Social Contact CTA Widget */}
      <ContactWidget />

      <style>{`
        .nav-link {
          position: relative;
          color: #7a6a58;
          text-decoration: none;
          transition: color 0.25s ease, transform 0.15s ease;
          display: inline-block;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          width: 100%;
          transform: scaleX(0);
          height: 2px;
          bottom: -4px;
          left: 0;
          background-color: #1a0f07;
          transform-origin: bottom right;
          transition: transform 0.25s ease-out;
        }
        .nav-link:hover::after {
          transform: scaleX(1);
          transform-origin: bottom left;
        }
        .nav-link:hover {
          color: #1a0f07;
        }
        .nav-link:active {
          transform: scale(0.95);
        }

        /* Target section scroll highlight pulse */
        section:target {
          animation: targetPulse 1.4s ease-out;
        }
        @keyframes targetPulse {
          0% {
            background-color: rgba(139, 111, 71, 0.12);
            box-shadow: inset 0 0 30px rgba(139, 111, 71, 0.08);
          }
          50% {
            background-color: rgba(139, 111, 71, 0.05);
            box-shadow: inset 0 0 15px rgba(139, 111, 71, 0.03);
          }
          100% {
            background-color: transparent;
            box-shadow: inset 0 0 0 rgba(139, 111, 71, 0);
          }
        }
      `}</style>
    </div>
  );
}

