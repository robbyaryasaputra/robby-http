import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LuCoffee,
  LuShoppingCart,
  LuSearch,
  LuPlus,
  LuMinus,
  LuTrash2,
  LuHeart,
  LuX,
  LuCircleCheck,
  LuExternalLink,
  LuMapPin,
  LuUtensils,
  LuCreditCard,
  LuCircleAlert,
  LuCalendar,
  LuInstagram,
  LuMessageCircle,
  LuPlay,
  LuStar,
  LuMessageSquare,
  LuPenLine,
  LuTag,
} from "react-icons/lu";
import { supabase } from "../../lib/supabase";
import {
  getMenuItems,
  getCategories,
  createOrder as createOrderDb,
  toggleFavorite as toggleFavDb,
} from "../../lib/db";
import { CoffeeBeanIcon } from "../../components/media";
import RatingStars from "../../components/status/RatingStars";
import { SlideUp, FadeIn, PulseGlow } from "../../components/animation";

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

  // Social Contact States
  const [isContactOpen, setIsContactOpen] = useState(false);

  // Promo Code States
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState("");

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

  const calculatePromoDiscount = () => {
    if (!appliedPromo) return 0;
    const discountVal = Number(appliedPromo.discount_value || 0);
    if (appliedPromo.discount_type === "percentage") {
      return (subtotal * discountVal) / 100;
    } else {
      return discountVal;
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

  const [newReview, setNewReview] = useState({
    name: "",
    category: "Pelayanan",
    rating: 5,
    comment: "",
  });

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!newReview.name.trim() || !newReview.comment.trim()) {
      alert("Harap isi nama dan komentar ulasan Anda!");
      return;
    }
    const reviewObject = {
      id: "REV-" + Math.floor(100 + Math.random() * 900),
      name: newReview.name,
      category: newReview.category,
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toISOString().split("T")[0],
    };
    const updated = [reviewObject, ...reviews];
    setReviews(updated);
    localStorage.setItem("customer_reviews", JSON.stringify(updated));
    setNewReview({
      name: "",
      category: "Pelayanan",
      rating: 5,
      comment: "",
    });
    alert("Terima kasih atas ulasan Anda!");
  };

  // Load favorites from localstorage or from user favorites
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

      // guest local fallback
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
    // Shake or toast behavior could be added here
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

  // Subtotal & Total Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const tax = subtotal * 0.1; // 10% tax/service charge
  const promoDiscount = calculatePromoDiscount();
  const total = Math.max(0, subtotal + tax - promoDiscount);

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
      setCheckoutSuccess(createdOrder);
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

  // Menu items from DB
  const [menuItems, setMenuItems] = useState([]);
  const [categoriesList, setCategoriesList] = useState(["All"]);

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

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-100 text-emerald-800 border border-emerald-200";
      case "Processing":
        return "bg-amber-100 text-amber-800 border border-amber-200";
      case "Pending":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      case "Cancelled":
        return "bg-red-100 text-red-800 border border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  const getTrackingSteps = (status) => {
    const steps = [
      {
        title: "Pesanan Diterima",
        desc: "Menunggu antrean barista",
        status: "completed",
      },
      {
        title: "Kopi Sedang Diseduh",
        desc: "Barista sedang meracik kopi Anda",
        status: "pending",
      },
      {
        title: "Pemeriksaan Kualitas",
        desc: "Memastikan rasa terbaik",
        status: "pending",
      },
      {
        title: "Siap Disajikan",
        desc: "Silakan ambil atau ditunggu di meja",
        status: "pending",
      },
    ];

    if (status === "Completed") {
      return steps.map((s) => ({ ...s, status: "completed" }));
    }
    if (status === "Processing") {
      steps[0].status = "completed";
      steps[1].status = "active";
      steps[1].desc = "Kopi Anda sedang diracik!";
      return steps;
    }
    if (status === "Pending") {
      steps[0].status = "active";
      steps[0].desc = "Pesanan masuk antrean.";
      return steps;
    }
    if (status === "Cancelled") {
      return [
        {
          title: "Pesanan Dibuat",
          desc: "Pesanan telah dibuat",
          status: "completed",
        },
        {
          title: "Dibatalkan",
          desc: "Pesanan ini dibatalkan",
          status: "failed",
        },
      ];
    }
    return steps;
  };

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
            className="relative p-2.5 rounded-full bg-[#FAF4EE] hover:bg-[#F2E7DC] text-[#4B2C20] transition-all duration-200 shadow-sm"
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
      <section
        id="hero"
        className="relative min-h-[85vh] bg-[#3F2419] flex items-center overflow-hidden"
      >
        {/* Background Image Overlay */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=1600&h=900&fit=crop"
            alt="Coffee shop ambient"
            className="w-full h-full object-cover"
          />
        </div>
        {/* Abstract shapes */}
        <div className="absolute top-1/4 right-0 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-amber-700/10 blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 relative z-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 text-left">
            <SlideUp delay={0.1}>
              <span className="inline-block bg-[#855C3B]/50 border border-amber-600/30 text-amber-200 text-xs font-bold tracking-widest uppercase py-1.5 px-4 rounded-full">
                ☕ Kedai Kopi Premium Terfavorit
              </span>
            </SlideUp>
            <SlideUp delay={0.2}>
              <h1 className="text-4xl md:text-6xl font-black tracking-tight text-[#FAF4EE] leading-tight">
                Nikmati Sensasi <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">
                  Kopi Racikan Asli
                </span>
              </h1>
            </SlideUp>
            <SlideUp delay={0.3}>
              <p className="text-base md:text-lg text-amber-100/80 max-w-lg leading-relaxed">
                Setiap cangkir menyajikan racikan biji kopi terbaik, dipanggang
                dengan suhu presisi, serta diracik sepenuh hati oleh barista
                handal kami untuk menemani setiap cerita Anda.
              </p>
            </SlideUp>
            <SlideUp delay={0.4}>
              <div className="flex flex-wrap gap-4 pt-2">
                <a
                  href="#menu"
                  className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-[#4B2C20] hover:from-amber-400 hover:to-amber-500 font-extrabold text-base rounded-2xl shadow-xl shadow-amber-600/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Pesan Kopi Sekarang
                </a>
                <a
                  href="#about"
                  className="px-8 py-4 border border-amber-400/40 text-amber-200 hover:bg-white/5 font-extrabold text-base rounded-2xl transition-all duration-300 active:scale-[0.98]"
                >
                  Tentang Kedai Kami
                </a>
              </div>
            </SlideUp>
          </div>

          {/* Featured Hero Card */}
          <SlideUp delay={0.5} className="hidden lg:block relative">
            <div className="absolute inset-0 bg-[#855C3B]/20 rounded-3xl blur-2xl transform rotate-6 scale-95 pointer-events-none"></div>
            <div className="relative bg-white/10 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=450&fit=crop"
                alt="Latte signature"
                className="w-full h-64 object-cover rounded-2xl mb-6 shadow-md"
              />
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-xl text-[#FAF4EE]">
                    Signature Cafe Latte
                  </h3>
                  <p className="text-xs text-amber-200/70 mt-1">
                    Perpaduan espresso arabika & susu premium
                  </p>
                </div>
                <span className="text-2xl font-black text-amber-400">
                  $4.50
                </span>
              </div>
            </div>
          </SlideUp>
        </div>
      </section>

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
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
              {categoriesList.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
                    activeCategory === cat
                      ? "bg-[#855C3B] text-white shadow-md shadow-[#855C3B]/20"
                      : "bg-[#FAF4EE] text-[#5F3A27] hover:bg-[#F2E7DC]"
                  }`}
                >
                  {cat === "All" ? "Semua" : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Menu Grid */}
          {filteredMenu.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredMenu.map((item, index) => {
                const isFav = favorites.includes(item.id);
                return (
                  <FadeIn
                    key={item.id}
                    duration={0.4}
                    delay={Math.min(index * 0.05, 0.3)}
                    className="h-full"
                  >
                    <div className="group bg-white rounded-3xl border border-[#EBE3D5] overflow-hidden shadow-sm hover:shadow-xl hover:border-[#855C3B]/25 transition-all duration-300 flex flex-col h-full">
                      {/* Image & Badge overlay */}
                      <div className="relative h-56 overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {/* Badge */}
                        {item.badge && (
                          <span className="absolute top-4 left-4 bg-amber-500 text-[#4B2C20] text-[10px] font-black uppercase tracking-wider py-1 px-3 rounded-full shadow-sm">
                            {item.badge}
                          </span>
                        )}
                        {/* Favorite Button */}
                        <button
                          onClick={() => toggleFavorite(item.id)}
                          className="absolute top-4 right-4 p-2 rounded-full bg-white/80 backdrop-blur-sm text-gray-500 hover:text-red-500 transition-colors shadow-md cursor-pointer"
                        >
                          <LuHeart
                            className={`w-5 h-5 transition-all duration-300 ${
                              isFav ? "text-red-500 fill-red-500 scale-110" : ""
                            }`}
                          />
                        </button>
                      </div>

                      {/* Card Content */}
                      <div className="p-6 flex-1 flex flex-col justify-between space-y-4 text-left">
                        <div className="space-y-2">
                          <div className="flex justify-between items-start gap-2">
                            <h3 className="font-bold text-lg text-[#4B2C20] group-hover:text-[#855C3B] transition-colors">
                              {item.name}
                            </h3>
                            <span className="inline-block bg-[#F9F5EE] text-[#855C3B] font-semibold text-xs py-0.5 px-2 rounded-lg">
                              {item.category}
                            </span>
                          </div>
                          {/* Rating */}
                          <RatingStars rating={item.rating} size={14} />
                          <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed">
                            {item.description}
                          </p>
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t border-[#F2E7DC]">
                          <span className="text-lg font-black text-[#4B2C20]">
                            ${item.price.toFixed(2)}
                          </span>
                          <button
                            onClick={() => addToCart(item)}
                            className="flex items-center gap-2 py-2 px-5 rounded-xl bg-[#FAF4EE] hover:bg-[#855C3B] text-[#855C3B] hover:text-white border border-[#855C3B]/20 transition-all duration-300 font-bold text-xs active:scale-[0.97] cursor-pointer"
                          >
                            <LuPlus className="w-4 h-4" />
                            Keranjang
                          </button>
                        </div>
                      </div>
                    </div>
                  </FadeIn>
                );
              })}
            </div>
          ) : (
            <div className="bg-white border border-[#EBE3D5] rounded-3xl p-16 text-center max-w-md mx-auto space-y-4">
              <LuCoffee className="w-16 h-16 text-gray-300 mx-auto" />
              <h3 className="font-bold text-lg text-[#4B2C20]">
                Kopi Tidak Ditemukan
              </h3>
              <p className="text-gray-500 text-sm">
                Kata kunci pencarian Anda tidak cocok dengan menu kami saat ini.
                Harap coba kata kunci lainnya.
              </p>
            </div>
          )}

          {/* Online Delivery Platform Integration */}
          <div className="bg-gradient-to-r from-[#855C3B]/10 to-[#5F3A27]/5 rounded-3xl p-8 border border-[#855C3B]/20 flex flex-col lg:flex-row justify-between items-center gap-6 mt-16 text-left">
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

      {/* Tracking Section */}
      <section id="track" className="py-24 px-6 md:px-12 bg-white">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#855C3B]">
              Lacak Proses Brewing
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#4B2C20]">
              Lacak Pesanan Anda Secara Instan
            </h2>
            <p className="text-gray-500 text-sm max-w-lg mx-auto">
              Masukkan ID Pesanan unik yang Anda peroleh setelah menyelesaikan
              checkout untuk melihat status persiapan kopi Anda secara
              real-time.
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleTrackOrder}
            className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto bg-[#F9F5EE] p-3 rounded-2xl border border-[#EBE3D5]"
          >
            <input
              type="text"
              placeholder="Masukkan ID Pesanan (contoh: ORD-123)..."
              value={trackIdInput}
              onChange={(e) => setTrackIdInput(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl bg-white border border-[#EBE3D5] text-[#2C1A0E] text-sm focus:outline-none focus:ring-2 focus:ring-[#855C3B]/20"
            />
            <button
              type="submit"
              className="py-3 px-6 rounded-xl bg-[#855C3B] text-white hover:bg-[#5F3A27] font-bold text-sm shadow-md transition-colors active:scale-[0.98]"
            >
              Lacak Sekarang
            </button>
          </form>

          {/* Track Results */}
          {trackedOrder && (
            <div className="bg-[#F9F5EE] border border-[#EBE3D5] rounded-3xl p-6 md:p-8 space-y-8 animate-[fadeIn_0.5s_ease-out] text-left max-w-2xl mx-auto">
              {/* Order Info */}
              <div className="flex flex-wrap justify-between items-center gap-4 pb-4 border-b border-[#EBE3D5]">
                <div>
                  <span className="text-xs text-gray-500 font-bold">
                    ID PESANAN
                  </span>
                  <h3 className="font-extrabold text-xl text-[#4B2C20]">
                    {trackedOrder.id}
                  </h3>
                </div>
                <div>
                  <span className="text-xs text-gray-500 font-bold block text-right">
                    STATUS
                  </span>
                  <span
                    className={`inline-block py-1 px-3.5 rounded-full text-xs font-extrabold mt-1 uppercase ${getStatusColor(trackedOrder.status)}`}
                  >
                    {trackedOrder.status}
                  </span>
                </div>
              </div>

              {/* Progress Steps */}
              <div className="space-y-6">
                <h4 className="font-bold text-[#4B2C20] text-sm">
                  Progres Pesanan:
                </h4>
                <div className="relative pl-8 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
                  {getTrackingSteps(trackedOrder.status).map((step, idx) => {
                    const isCompleted = step.status === "completed";
                    const isActive = step.status === "active";
                    const isFailed = step.status === "failed";
                    return (
                      <div key={idx} className="relative flex flex-col gap-1">
                        {/* Bullet */}
                        <div
                          className={`absolute -left-8.5 top-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 z-10 ${
                            isCompleted
                              ? "bg-[#855C3B] border-[#855C3B] text-white"
                              : isActive
                                ? "bg-amber-400 border-amber-400 text-[#4B2C20] animate-pulse"
                                : isFailed
                                  ? "bg-red-500 border-red-500 text-white"
                                  : "bg-white border-gray-300 text-gray-300"
                          }`}
                        >
                          {isCompleted ? (
                            <span className="text-[10px] font-black">✓</span>
                          ) : isFailed ? (
                            <span className="text-[10px] font-black">✗</span>
                          ) : (
                            <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                          )}
                        </div>
                        {/* Text */}
                        <span
                          className={`font-bold text-sm ${isActive ? "text-[#855C3B]" : isFailed ? "text-red-600" : "text-[#4B2C20]"}`}
                        >
                          {step.title}
                        </span>
                        <span className="text-xs text-gray-500 font-medium">
                          {step.desc}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Summary Items */}
              <div className="pt-6 border-t border-[#EBE3D5] space-y-3">
                <h4 className="font-bold text-[#4B2C20] text-sm">
                  Detail Pesanan:
                </h4>
                <div className="bg-white rounded-2xl border border-[#EBE3D5] p-4 space-y-3">
                  {trackedOrder.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-[1fr_auto] gap-3 rounded-2xl bg-gray-50 p-3"
                    >
                      <div className="space-y-1">
                        <div className="text-sm font-semibold text-[#2C1A0E]">
                          {item.name}
                        </div>
                        <div className="text-xs text-slate-500">
                          {item.qty} x ${Number(item.price).toFixed(2)}
                        </div>
                      </div>
                      <div className="text-sm font-bold text-[#855C3B] text-right">
                        ${Number(item.price * item.qty).toFixed(2)}
                      </div>
                    </div>
                  ))}
                  <div className="grid grid-cols-2 gap-3 pt-3 mt-3 text-xs text-slate-600 font-semibold">
                    <div className="rounded-2xl bg-slate-50 p-3 border border-slate-100">
                      <span className="block text-[10px] uppercase tracking-wider text-slate-400">
                        Metode Pembayaran
                      </span>
                      <span className="block pt-1 text-sm font-bold text-slate-800">
                        {trackedOrder.paymentMethod || "Cash"}
                      </span>
                    </div>
                    {trackedOrder.promoCode && (
                      <div className="rounded-2xl bg-slate-50 p-3 border border-slate-100">
                        <span className="block text-[10px] uppercase tracking-wider text-slate-400">
                          Promo terpakai
                        </span>
                        <span className="block pt-1 text-sm font-bold text-slate-800">
                          {trackedOrder.promoCode}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between items-center pt-3 mt-3 font-extrabold text-base text-[#2C1A0E]">
                    <span>Total Pembayaran</span>
                    <span>${trackedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
                {trackedOrder.tableNumber && (
                  <p className="text-xs text-gray-500 font-semibold flex items-center gap-1.5">
                    <LuUtensils className="w-4 h-4 text-[#855C3B]" />
                    Disajikan langsung di Meja:{" "}
                    <span className="text-[#4B2C20] font-bold">
                      No. {trackedOrder.tableNumber}
                    </span>
                  </p>
                )}
                {trackedOrder.notes && (
                  <div className="bg-amber-50 rounded-xl p-3 border border-amber-100">
                    <span className="text-[10px] text-amber-800 font-bold block mb-1">
                      CATATAN:
                    </span>
                    <p className="text-xs text-amber-900 font-medium italic">
                      "{trackedOrder.notes}"
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {trackError && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 max-w-md mx-auto flex items-center gap-3 text-left">
              <LuCircleAlert className="w-6 h-6 shrink-0" />
              <p className="text-xs font-semibold">{trackError}</p>
            </div>
          )}
        </div>
      </section>

      {/* Reviews & Feedback Section */}
      <section
        id="feedback"
        className="py-24 px-6 md:px-12 bg-[#F9F5EE] border-t border-[#EBE3D5]"
      >
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-[#855C3B]">
              Ulasan & Masukan Pelanggan
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#4B2C20]">
              Bagikan Pengalaman Anda
            </h2>
            <p className="text-gray-600 text-sm">
              Pendapat Anda sangat berarti bagi kami untuk terus meningkatkan
              cita rasa kopi dan kenyamanan kedai.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Feedback Form */}
            <SlideUp
              delay={0.1}
              className="lg:col-span-5 bg-white rounded-3xl border border-[#EBE3D5] p-6 md:p-8 space-y-6 shadow-sm text-left"
            >
              <h3 className="font-extrabold text-lg text-[#4B2C20] border-b border-[#F2E7DC] pb-3 flex items-center gap-2">
                <LuPenLine className="w-5 h-5 text-[#855C3B]" />
                Tulis Ulasan
              </h3>

              <form onSubmit={handleReviewSubmit} className="space-y-4">
                {/* Rating selection */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-600 block">
                    NILAI PELAYANAN / PRODUK
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() =>
                          setNewReview({ ...newReview, rating: star })
                        }
                        className="focus:outline-none transition-transform hover:scale-110 active:scale-95 cursor-pointer"
                      >
                        <LuStar
                          className={`w-7 h-7 transition-colors ${
                            star <= newReview.rating
                              ? "text-amber-500 fill-amber-500"
                              : "text-gray-200 fill-transparent"
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-gray-500 ml-2">
                      ({newReview.rating} dari 5)
                    </span>
                  </div>
                </div>

                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600 block">
                    NAMA ANDA
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Masukkan nama Anda..."
                    value={newReview.name}
                    onChange={(e) =>
                      setNewReview({ ...newReview, name: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F9F5EE] border border-[#EBE3D5] text-[#2C1A0E] text-sm focus:outline-none focus:ring-2 focus:ring-[#855C3B]/20"
                  />
                </div>

                {/* Category */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600 block">
                    KATEGORI ULASAN
                  </label>
                  <select
                    value={newReview.category}
                    onChange={(e) =>
                      setNewReview({ ...newReview, category: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F9F5EE] border border-[#EBE3D5] text-[#2C1A0E] text-sm focus:outline-none focus:ring-2 focus:ring-[#855C3B]/20 hover:cursor-pointer"
                  >
                    <option value="Pelayanan">Pelayanan</option>
                    <option value="Rasa Menu">Rasa Menu</option>
                    <option value="Kebersihan">Kebersihan</option>
                    <option value="Suasana">Suasana</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>

                {/* Comment */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600 block">
                    ULASAN / SARAN
                  </label>
                  <textarea
                    rows="4"
                    required
                    placeholder="Tulis ulasan, kritik, atau saran Anda di sini..."
                    value={newReview.comment}
                    onChange={(e) =>
                      setNewReview({ ...newReview, comment: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F9F5EE] border border-[#EBE3D5] text-[#2C1A0E] text-sm focus:outline-none focus:ring-2 focus:ring-[#855C3B]/20 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#855C3B] hover:bg-[#5F3A27] text-white font-extrabold text-sm transition-colors shadow-md active:scale-[0.98] cursor-pointer"
                >
                  Kirim Ulasan
                </button>
              </form>
            </SlideUp>

            {/* Reviews List */}
            <SlideUp delay={0.2} className="lg:col-span-7 space-y-6 text-left">
              <div className="flex justify-between items-center border-b border-[#EBE3D5] pb-3">
                <h3 className="font-extrabold text-lg text-[#4B2C20] flex items-center gap-2">
                  <LuMessageSquare className="w-5 h-5 text-[#855C3B]" />
                  Semua Ulasan ({reviews.length})
                </h3>
              </div>

              {/* Scrollable list container */}
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {reviews.length > 0 ? (
                  reviews.map((rev) => (
                    <FadeIn key={rev.id} duration={0.3}>
                      <div className="bg-white rounded-2xl border border-[#EBE3D5] p-5 space-y-3 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <h4 className="font-bold text-[#4B2C20] text-sm">
                              {rev.name}
                            </h4>
                            <span className="text-[10px] text-gray-400 font-semibold">
                              {rev.date}
                            </span>
                          </div>
                          <div className="flex flex-col items-end gap-1.5">
                            <span
                              className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold tracking-wide uppercase ${
                                rev.category === "Pelayanan"
                                  ? "bg-blue-50 text-blue-700 border border-blue-100"
                                  : rev.category === "Rasa Menu"
                                    ? "bg-amber-50 text-amber-800 border border-amber-100"
                                    : rev.category === "Kebersihan"
                                      ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                      : rev.category === "Suasana"
                                        ? "bg-purple-50 text-purple-700 border border-purple-100"
                                        : "bg-gray-50 text-gray-600 border border-gray-100"
                              }`}
                            >
                              {rev.category}
                            </span>
                            <RatingStars rating={rev.rating} size={12} />
                          </div>
                        </div>
                        <p className="text-gray-600 text-xs leading-relaxed">
                          {rev.comment}
                        </p>
                      </div>
                    </FadeIn>
                  ))
                ) : (
                  <div className="bg-white rounded-2xl border border-[#EBE3D5] p-12 text-center text-gray-500">
                    Belum ada ulasan. Jadilah yang pertama memberikan masukan!
                  </div>
                )}
              </div>
            </SlideUp>
          </div>
        </div>
      </section>

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
      {checkoutSuccess && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-[#EBE3D5] text-center space-y-6 shadow-2xl animate-[scaleUp_0.4s_ease-out]">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
              <LuCircleCheck className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <h3 className="font-extrabold text-2xl text-[#4B2C20]">
                Pesanan Berhasil Dikirim!
              </h3>
              <p className="text-sm text-gray-500 font-medium">
                Barista kami telah menerima pesanan Anda dan siap untuk menyeduh
                cangkir kopi terbaik Anda.
              </p>
            </div>

            <div className="bg-[#F9F5EE] border border-[#EBE3D5] rounded-2xl p-4 space-y-3 text-left">
              <div>
                <span className="text-[10px] text-gray-500 font-bold block mb-1">
                  ID PESANAN UNTUK PELACAKAN:
                </span>
                <span className="text-2xl font-black text-[#855C3B] tracking-widest">
                  {checkoutSuccess.id}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs text-slate-600 font-semibold">
                <div className="bg-white rounded-2xl p-3 border border-slate-100">
                  <span className="block text-[9px] uppercase tracking-wider text-slate-400">
                    Metode Pembayaran
                  </span>
                  <span className="block pt-1 text-sm font-bold text-slate-800">
                    {checkoutSuccess.paymentMethod || "Cash"}
                  </span>
                </div>
                {checkoutSuccess.promoCode && (
                  <div className="bg-white rounded-2xl p-3 border border-slate-100">
                    <span className="block text-[9px] uppercase tracking-wider text-slate-400">
                      Promo Terpakai
                    </span>
                    <span className="block pt-1 text-sm font-bold text-slate-800">
                      {checkoutSuccess.promoCode}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <p className="text-xs text-gray-400 leading-normal">
              *Tulis atau salin ID Pesanan di atas untuk memeriksa status
              persiapan Anda pada bagian pelacakan di bawah halaman.
            </p>

            <button
              onClick={() => {
                setCheckoutSuccess(null);
                // Scroll to tracking section
                document
                  .getElementById("track")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="w-full py-3 px-6 rounded-xl bg-[#855C3B] text-white hover:bg-[#5F3A27] font-bold text-sm transition-colors shadow-lg shadow-[#855C3B]/10 active:scale-[0.98]"
            >
              Lacak Pesanan Saya
            </button>
          </div>
        </div>
      )}

      {/* Cart Drawer Panel */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          {/* Backdrop */}
          <div
            onClick={() => setIsCartOpen(false)}
            className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
          ></div>

          {/* Drawer Body */}
          <div className="relative w-full max-w-lg bg-[#F9F5EE] h-full shadow-2xl flex flex-col z-10 border-l border-[#EBE3D5] animate-[slideInRight_0.3s_ease-out]">
            {/* Header */}
            <div className="bg-white border-b border-[#EBE3D5] px-6 py-5 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <LuShoppingCart className="w-5.5 h-5.5 text-[#855C3B]" />
                <h3 className="font-extrabold text-lg text-[#4B2C20]">
                  Keranjang Pemesanan
                </h3>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 rounded-xl text-gray-400 hover:text-[#4B2C20] hover:bg-gray-100 transition-all duration-200"
              >
                <LuX className="w-5.5 h-5.5" />
              </button>
            </div>

            {/* Scrollable list & checkout form */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
              {cart.length > 0 ? (
                <>
                  {/* Cart Items list */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-[#4B2C20] text-sm text-left">
                      Item yang Dipilih:
                    </h4>
                    <div className="space-y-3">
                      {cart.map((item) => (
                        <div
                          key={item.id}
                          className="bg-white rounded-2xl border border-[#EBE3D5] p-4 flex gap-4 items-center shadow-sm"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 rounded-xl object-cover"
                          />
                          <div className="flex-1 space-y-1 text-left">
                            <h5 className="font-bold text-sm text-[#4B2C20]">
                              {item.name}
                            </h5>
                            <span className="text-xs text-gray-500 font-bold">
                              ${item.price.toFixed(2)}
                            </span>
                          </div>

                          {/* Qty edit buttons */}
                          <div className="flex items-center border border-[#EBE3D5] rounded-xl bg-[#F9F5EE] p-1">
                            <button
                              onClick={() => updateQty(item.id, -1)}
                              className="p-1 text-[#855C3B] hover:bg-white rounded-lg transition-colors"
                            >
                              <LuMinus className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-xs font-bold w-6 text-center">
                              {item.qty}
                            </span>
                            <button
                              onClick={() => updateQty(item.id, 1)}
                              className="p-1 text-[#855C3B] hover:bg-white rounded-lg transition-colors"
                            >
                              <LuPlus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition-colors"
                            title="Remove"
                          >
                            <LuTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Promo Code Input */}
                  <div className="bg-white rounded-2xl border border-[#EBE3D5] p-5 space-y-2 text-left">
                    <span className="text-xs font-bold text-[#4B2C20] block">
                      Kode Voucher / Promo
                    </span>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Contoh: KOPI50"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="flex-1 bg-[#F9F5EE] border border-[#EBE3D5] rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#855C3B]/20 animate-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleApplyPromo(promoCode)}
                        className="bg-[#855C3B] hover:bg-[#6d4734] text-white text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer"
                      >
                        Pakai
                      </button>
                    </div>
                    {promoError && (
                      <p className="text-[10px] font-semibold text-red-500 mt-1">
                        {promoError}
                      </p>
                    )}
                    {appliedPromo && (
                      <p className="text-[10px] font-semibold text-emerald-600 mt-1">
                        Promo {appliedPromo.code} Aktif: Potongan{" "}
                        {appliedPromo.discount_type === "percentage"
                          ? `${appliedPromo.discount_value}%`
                          : `$${appliedPromo.discount_value}`}
                        !
                      </p>
                    )}
                  </div>

                  {/* Summary Pricing */}
                  <div className="bg-white rounded-2xl border border-[#EBE3D5] p-5 space-y-3 text-sm">
                    <div className="flex justify-between items-center text-gray-500 font-medium">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-500 font-medium">
                      <span>Pajak & Layanan (10%)</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    {appliedPromo && (
                      <div className="flex justify-between items-center text-red-500 font-medium">
                        <span className="flex items-center gap-1">
                          <LuTag className="w-3.5 h-3.5" />
                          Diskon Voucher ({appliedPromo.code})
                        </span>
                        <span>-${promoDiscount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center pt-3 border-t border-gray-100 font-black text-[#2C1A0E] text-base">
                      <span>Total Biaya</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Checkout Form */}
                  <form
                    onSubmit={handlePlaceOrder}
                    className="bg-white rounded-2xl border border-[#EBE3D5] p-5 space-y-4 text-left"
                  >
                    <h4 className="font-extrabold text-[#4B2C20] text-sm pb-2 border-b border-gray-100">
                      Informasi Pemesanan:
                    </h4>

                    {/* Customer Name */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-600 block">
                        NAMA PELANGGAN
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Masukkan nama lengkap..."
                        value={checkoutForm.name}
                        onChange={(e) =>
                          setCheckoutForm({
                            ...checkoutForm,
                            name: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-xl bg-[#F9F5EE] border border-[#EBE3D5] text-[#2C1A0E] text-sm focus:outline-none focus:ring-2 focus:ring-[#855C3B]/20"
                      />
                    </div>

                    {/* Delivery type selection */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-600 block">
                        LAYANAN PENYAJIAN
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            setCheckoutForm({
                              ...checkoutForm,
                              deliveryType: "table",
                            })
                          }
                          className={`py-2.5 rounded-xl text-xs font-bold border flex items-center justify-center gap-2 transition-all duration-300 ${
                            checkoutForm.deliveryType === "table"
                              ? "bg-[#855C3B]/10 border-[#855C3B] text-[#855C3B]"
                              : "border-gray-200 text-gray-500 hover:bg-gray-50"
                          }`}
                        >
                          <LuUtensils className="w-4 h-4" />
                          Makan di Meja
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setCheckoutForm({
                              ...checkoutForm,
                              deliveryType: "takeaway",
                            })
                          }
                          className={`py-2.5 rounded-xl text-xs font-bold border flex items-center justify-center gap-2 transition-all duration-300 ${
                            checkoutForm.deliveryType === "takeaway"
                              ? "bg-[#855C3B]/10 border-[#855C3B] text-[#855C3B]"
                              : "border-gray-200 text-gray-500 hover:bg-gray-50"
                          }`}
                        >
                          <LuMapPin className="w-4 h-4" />
                          Bawa Pulang
                        </button>
                      </div>
                    </div>

                    {/* Table Number (conditional) */}
                    {checkoutForm.deliveryType === "table" && (
                      <div className="space-y-1.5 animate-[fadeIn_0.3s_ease-out]">
                        <label className="text-xs font-bold text-gray-600 block">
                          NOMOR MEJA
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Contoh: 05, 12, VIP-1..."
                          value={checkoutForm.tableNumber}
                          onChange={(e) =>
                            setCheckoutForm({
                              ...checkoutForm,
                              tableNumber: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2.5 rounded-xl bg-[#F9F5EE] border border-[#EBE3D5] text-[#2C1A0E] text-sm focus:outline-none focus:ring-2 focus:ring-[#855C3B]/20"
                        />
                      </div>
                    )}

                    {/* Payment Method */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-600 block">
                        METODE PEMBAYARAN
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {["Cash", "QRIS", "Card"].map((method) => (
                          <button
                            key={method}
                            type="button"
                            onClick={() =>
                              setCheckoutForm({
                                ...checkoutForm,
                                paymentMethod: method,
                              })
                            }
                            className={`py-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-1 transition-all duration-300 ${
                              checkoutForm.paymentMethod === method
                                ? "bg-[#855C3B] text-white border-[#855C3B] shadow-sm"
                                : "border-gray-200 text-gray-500 hover:bg-gray-50"
                            }`}
                          >
                            {method === "Card" && (
                              <LuCreditCard className="w-3.5 h-3.5" />
                            )}
                            {method}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Notes */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-600 block">
                        CATATAN KHUSUS (OPSIONAL)
                      </label>
                      <textarea
                        rows="2"
                        placeholder="Contoh: Kurangi gula, es batu dipisah..."
                        value={checkoutForm.notes}
                        onChange={(e) =>
                          setCheckoutForm({
                            ...checkoutForm,
                            notes: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 rounded-xl bg-[#F9F5EE] border border-[#EBE3D5] text-[#2C1A0E] text-sm focus:outline-none focus:ring-2 focus:ring-[#855C3B]/20 resize-none"
                      />
                    </div>

                    {/* Place order button */}
                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-xl bg-[#855C3B] hover:bg-[#5F3A27] text-white font-extrabold text-sm transition-all duration-300 shadow-md shadow-[#855C3B]/10 active:scale-[0.98] mt-6"
                    >
                      Konfirmasi & Kirim Pesanan
                    </button>
                  </form>

                  {/* Alternative Food Delivery platforms */}
                  <div className="border-t border-[#EBE3D5] pt-6 mt-6 space-y-3">
                    <h5 className="text-[10px] font-black text-gray-500 uppercase tracking-wider text-left">
                      Atau Pesan via Platform Pengiriman Lain:
                    </h5>
                    <div className="grid grid-cols-3 gap-2">
                      <a
                        href="https://gofood.link"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2.5 px-2 bg-[#E62E2D]/5 hover:bg-[#E62E2D]/10 text-[#E62E2D] border border-[#E62E2D]/20 rounded-xl font-bold text-[11px] text-center transition-all duration-200 active:scale-[0.97]"
                      >
                        GoFood
                      </a>
                      <a
                        href="https://grab.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2.5 px-2 bg-[#00B14F]/5 hover:bg-[#00B14F]/10 text-[#00B14F] border border-[#00B14F]/20 rounded-xl font-bold text-[11px] text-center transition-all duration-200 active:scale-[0.97]"
                      >
                        GrabFood
                      </a>
                      <a
                        href="https://shopee.co.id"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2.5 px-2 bg-[#EE4D2D]/5 hover:bg-[#EE4D2D]/10 text-[#EE4D2D] border border-[#EE4D2D]/20 rounded-xl font-bold text-[11px] text-center transition-all duration-200 active:scale-[0.97]"
                      >
                        ShopeeFood
                      </a>
                    </div>
                  </div>
                </>
              ) : (
                <div className="py-24 text-center space-y-4 max-w-xs mx-auto">
                  <div className="w-16 h-16 rounded-full bg-[#FAF4EE] text-gray-400 flex items-center justify-center mx-auto">
                    <LuShoppingCart className="w-8 h-8" />
                  </div>
                  <h4 className="font-bold text-lg text-[#4B2C20]">
                    Keranjang Masih Kosong
                  </h4>
                  <p className="text-gray-500 text-xs leading-relaxed">
                    Anda belum memasukkan menu kopi apa pun. Buka katalog menu
                    kami di bawah dan mulailah berbelanja!
                  </p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="py-2.5 px-6 bg-[#855C3B] text-white hover:bg-[#5F3A27] rounded-xl text-xs font-bold transition-colors"
                  >
                    Mulai Belanja
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Floating Social Contact CTA Widget */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 font-sans">
        {/* Expanded Contact Card */}
        {isContactOpen && (
          <div className="bg-white rounded-3xl border border-[#EBE3D5] p-5 shadow-2xl w-64 space-y-4 animate-[scaleUp_0.3s_ease-out] text-left">
            <h4 className="font-extrabold text-sm text-[#4B2C20] border-b border-[#F2E7DC] pb-2 flex justify-between items-center">
              <span>Hubungi Kami</span>
              <button
                onClick={() => setIsContactOpen(false)}
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <LuX className="w-4 h-4" />
              </button>
            </h4>

            <div className="space-y-3">
              {/* WhatsApp Link */}
              <a
                href="https://wa.me/6281234567890?text=Halo%20Bean%20and%20Brew,%20saya%20ingin%20tanya%20reservasi%20tempat..."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-emerald-50 text-gray-700 hover:text-emerald-700 transition-all group"
              >
                <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <LuMessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold block">WhatsApp Chat</span>
                  <span className="text-[10px] text-gray-400 font-medium">
                    Reservasi & Tanya Acara
                  </span>
                </div>
              </a>

              {/* Instagram Link */}
              <a
                href="https://instagram.com/coffee_shop_username"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-pink-50 text-gray-700 hover:text-pink-700 transition-all group"
              >
                <div className="w-9 h-9 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <LuInstagram className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold block">Instagram</span>
                  <span className="text-[10px] text-gray-400 font-medium">
                    Update & Promo Harian
                  </span>
                </div>
              </a>

              {/* TikTok Link */}
              <a
                href="https://tiktok.com/@coffee_shop_username"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-100 text-gray-700 hover:text-black transition-all group"
              >
                <div className="w-9 h-9 rounded-full bg-slate-100 text-gray-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <LuPlay className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold block">TikTok</span>
                  <span className="text-[10px] text-gray-400 font-medium">
                    Keseruan Kafe Kami
                  </span>
                </div>
              </a>
            </div>
          </div>
        )}

        {/* Main Floating Trigger Button */}
        <PulseGlow color="#855C3B" className="rounded-full">
          <button
            onClick={() => setIsContactOpen(!isContactOpen)}
            className="w-14 h-14 rounded-full bg-[#855C3B] hover:bg-[#5F3A27] text-white flex items-center justify-center shadow-xl shadow-[#855C3B]/20 transition-all duration-300 hover:scale-105 active:scale-[0.97] relative group focus:outline-none cursor-pointer"
            title="Hubungi Kami"
          >
            {/* Pulsing Outer Ring */}
            <span className="absolute inset-0 rounded-full bg-[#855C3B]/40 animate-ping opacity-75 group-hover:hidden"></span>

            {isContactOpen ? (
              <LuX className="w-6 h-6 relative z-10" />
            ) : (
              <LuMessageCircle className="w-6 h-6 relative z-10 animate-bounce" />
            )}
          </button>
        </PulseGlow>
      </div>
    </div>
  );
}
