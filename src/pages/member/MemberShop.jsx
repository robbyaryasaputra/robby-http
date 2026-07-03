import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LuCoffee,
  LuBell,
  LuShoppingCart,
  LuCheck,
  LuCircleAlert,
  LuLogOut,
} from "react-icons/lu";
import { supabase } from "../../lib/supabase";
import {
  getMenuItems,
  getMemberMembershipByCustomer,
  createPointTransaction,
  getCategories,
  createOrder,
  getMemberRewards,
  getOrderHistory,
} from "../../lib/db";
import { useAuth } from "../../contexts/AuthContext";
import { SlideUp, FadeIn } from "../../components/animation";

// Import modular sub-components
import MemberProfileCard from "./components/MemberProfileCard";
import MemberBenefits from "./components/MemberBenefits";
import MemberShopCatalogue from "./components/MemberShopCatalogue";
import MemberRewards from "./components/MemberRewards";
import MemberTransactions from "./components/MemberTransactions";
import MemberCartDrawer from "./components/MemberCartDrawer";
import MemberCheckoutSuccess from "./components/MemberCheckoutSuccess";
import NotificationDrawer, { useUnreadNotifCount } from "./components/NotificationDrawer";


// Seed Tiers
const MEMBERSHIP_TIERS = [
  {
    id: 1,
    name: "Bronze",
    slug: "bronze",
    min_points: 0,
    points_multiplier: 1.0,
    discount_percent: 0.0,
    badge_color: "#CD7F32",
    bg_gradient: "from-amber-600 to-amber-800",
    text_color: "text-amber-700 bg-amber-50 border-amber-200",
    benefits: [
      "Kumpulkan poin setiap belanja",
      "Birthday reward",
      "Akses promo member",
      "Multiplier: 1.0x Poin",
    ],
  },
  {
    id: 2,
    name: "Silver",
    slug: "silver",
    min_points: 500,
    points_multiplier: 1.5,
    discount_percent: 5.0,
    badge_color: "#C0C0C0",
    bg_gradient: "from-slate-400 to-slate-600",
    text_color: "text-slate-600 bg-slate-50 border-slate-200",
    benefits: [
      "Semua benefit Bronze",
      "Promo eksklusif Silver",
      "Priority order",
      "Multiplier: 1.5x Poin",
      "Diskon 5% otomatis",
    ],
  },
  {
    id: 3,
    name: "Gold",
    slug: "gold",
    min_points: 2000,
    points_multiplier: 2.0,
    discount_percent: 10.0,
    badge_color: "#FFD700",
    bg_gradient: "from-yellow-500 to-amber-600",
    text_color: "text-yellow-700 bg-yellow-50 border-yellow-200",
    benefits: [
      "Semua benefit Silver",
      "Free upsize minuman",
      "Early access menu baru",
      "Multiplier: 2.0x Poin",
      "Diskon 10% otomatis",
    ],
  },
  {
    id: 4,
    name: "Platinum",
    slug: "platinum",
    min_points: 5000,
    points_multiplier: 3.0,
    discount_percent: 15.0,
    badge_color: "#E5E4E2",
    bg_gradient: "from-purple-600 to-slate-800",
    text_color: "text-purple-700 bg-purple-50 border-purple-200",
    benefits: [
      "Semua benefit Gold",
      "Free delivery",
      "VIP lounge access",
      "Personal barista",
      "Multiplier: 3.0x Poin",
      "Diskon 15% otomatis",
    ],
  },
];

// Rewards fallback static sample
const SAMPLE_REWARDS = [
  {
    id: "r-1",
    name: "Free Americano",
    points_required: 50,
    min_tier_id: 1,
    min_tier_name: "Bronze",
    description: "Tukar poin untuk 1 Americano gratis",
    type: "free_item",
  },
  {
    id: "r-2",
    name: "Free Pastry",
    points_required: 75,
    min_tier_id: 1,
    min_tier_name: "Bronze",
    description: "Tukar poin untuk 1 Butter Croissant gratis",
    type: "free_item",
  },
];

const tierNameToId = {
  Bronze: 1,
  Silver: 2,
  Gold: 3,
  Platinum: 4,
};

export default function MemberShop() {
  const navigate = useNavigate();
  const { profile, refreshProfile, signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  // App States
  const [activeUser, setActiveUser] = useState(null);
  const [activeMemberProfile, setActiveMemberProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [memberRewards, setMemberRewards] = useState([]);
  const [activeTab, setActiveTab] = useState("shop"); // "shop" or "rewards" or "transactions"

  // Shop States
  const [cart, setCart] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(null);

  const [checkoutForm, setCheckoutForm] = useState({
    name: "",
    deliveryType: "dine_in",
    tableNumber: "",
    paymentMethod: "Cash",
    notes: "",
  });

  // Promo Code States
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState("");

  // Points Transactions History
  const [transactions, setTransactions] = useState([]);

  // Toast messages
  const [successToast, setSuccessToast] = useState("");
  const [errorToast, setErrorToast] = useState("");

  // Notification Drawer state
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const unreadNotifCount = useUnreadNotifCount(activeUser?.id || null);

  useEffect(() => {
    if (profile) {
      loadMemberProfile(profile.id);
    } else {
      // DUMMY PROFILE FOR GUEST PREVIEW
      const dummyTier = MEMBERSHIP_TIERS[0];
      setActiveUser({
        name: "Guest User",
        email: "guest@example.com",
      });
      setActiveMemberProfile({
        name: "Guest User",
        member_code: "MBR-00000",
        tier: dummyTier,
        tier_id: dummyTier.id,
        current_points: 0,
        total_points: 0,
      });
      setLoading(false);
    }
  }, [profile]);

  useEffect(() => {
    if (successToast) {
      const timer = setTimeout(() => setSuccessToast(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [successToast]);

  useEffect(() => {
    if (errorToast) {
      const timer = setTimeout(() => setErrorToast(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [errorToast]);

  // Load specific membership profile from users table (membership fields are embedded)
  const loadMemberProfile = async (userId) => {
    setLoading(true);
    try {
      // Get user data from v_member_details view (which has membership fields)
      const { data: userData, error: userError } = await supabase
        .from("v_member_details")
        .select("id:member_id, name:full_name, member_code, tier:tier_name, total_points, current_points, phone, avatar_url, status:user_status")
        .eq("member_id", userId)
        .single();

      if (userError) throw userError;

      setActiveUser(userData);
      setCheckoutForm((prev) => ({ ...prev, name: userData?.name || "" }));

      const tierId = tierNameToId[userData.tier] || 1;
      const tierObj = MEMBERSHIP_TIERS.find((t) => t.id === tierId) || MEMBERSHIP_TIERS[0];

      setActiveMemberProfile({
        ...userData,
        tier_id: tierId,
        tier: tierObj,
      });

      // Load rewards
      const { data: rewardsData } = await getMemberRewards();
      setMemberRewards(rewardsData || []);

      loadTransactions(userId);
    } catch (err) {
      console.error("Load member profile error:", err);
      setErrorToast("Gagal memuat profil member.");
    } finally {
      setLoading(false);
    }
  };

  const loadTransactions = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("activity_logs")
        .select("*")
        .eq("user_id", userId)
        .ilike("action", "POINTS_%")
        .order("created_at", { ascending: false });

      if (!error && data) {
        const mappedTxs = data.map((log) => ({
          id: log.id,
          membership_id: log.user_id,
          type: log.action.replace("POINTS_", "").toLowerCase(),
          points: log.new_data?.delta || 0,
          description: log.new_data?.description || log.action,
          balance_after: log.new_data?.points || 0,
          created_at: log.created_at,
        }));
        setTransactions(mappedTxs);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getNextTierInfo = () => {
    if (!activeMemberProfile) return null;
    const currentTierId = activeMemberProfile.tier_id;
    if (currentTierId >= 4) return null;

    const nextTier = MEMBERSHIP_TIERS.find((t) => t.id === currentTierId + 1);
    if (!nextTier) return null;

    const pointsNeeded = nextTier.min_points - activeMemberProfile.total_points;
    const percent = Math.min(
      100,
      (activeMemberProfile.total_points / nextTier.min_points) * 100,
    );

    return {
      name: nextTier.name,
      pointsNeeded,
      percent,
      targetPoints: nextTier.min_points,
    };
  };

  const addToCart = (item) => {
    if (activeMemberProfile?.status !== "active") {
      setErrorToast("Membership Anda ditangguhkan. Tidak dapat memesan.");
      return;
    }

    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    setSuccessToast(`${item.name} ditambahkan ke keranjang!`);
  };

  const updateCartQty = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean),
    );
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const calculateCartSubtotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const calculateCartDiscount = () => {
    if (!activeMemberProfile) return 0;
    const discPercent = parseFloat(activeMemberProfile.tier.discount_percent);
    return (calculateCartSubtotal() * discPercent) / 100;
  };

  const calculateCartTotal = () => {
    return Math.max(
      0,
      calculateCartSubtotal() -
      calculateCartDiscount() -
      calculatePromoDiscount(),
    );
  };

  const calculateEstimatedPoints = () => {
    if (!activeMemberProfile) return 0;
    const multiplier = parseFloat(activeMemberProfile.tier.points_multiplier);
    return Math.round(calculateCartTotal() * multiplier);
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;
    if (!activeMemberProfile) return;

    const subtotal = calculateCartSubtotal();
    const memberDiscount = calculateCartDiscount();
    const promoDiscount = calculatePromoDiscount();
    const discount = memberDiscount + promoDiscount;
    const total = calculateCartTotal();
    const pointsEarned = calculateEstimatedPoints();

    const orderId = `ORD-${Date.now()}`;
    const orderItemsSummary = cart
      .map((i) => `${i.name} x${i.quantity}`)
      .join(", ");

    try {
      const orderPayload = {
        order_number: orderId,
        customer_id: activeUser?.id || null,
        customer_name: activeUser?.name || "Member",
        status: "processing",
        delivery_type: checkoutForm.deliveryType || "dine_in",
        table_number: checkoutForm.deliveryType === "dine_in" ? (checkoutForm.tableNumber || null) : null,
        subtotal: subtotal,
        discount_amount: discount,
        tax_amount: 0,
        total_amount: total,
        notes: checkoutForm.notes || null,
      };

      const itemsPayload = cart.map((i) => ({
        menu_item_id: i.id,
        item_name: i.name,
        quantity: i.quantity,
        unit_price: i.price,
        subtotal: i.price * i.quantity,
      }));

      const res = await createOrder(orderPayload, itemsPayload, {
        payment_method: "member_balance",
        amount: total,
        status: "paid",
      });
      if (res.error) throw res.error;

      const tx = await createPointTransaction({
        membership_id: activeMemberProfile.id,
        order_id: res.data.id,
        type: "earn",
        points: pointsEarned,
        description: `Belanja Member (Order ID: ${res.data.order_number || res.data.id})`,
      });
      if (tx.error) console.error(tx.error);

      if (appliedPromo) {
        await supabase
          .from("promotions")
          .update({ current_uses: (appliedPromo.current_uses || 0) + 1 })
          .eq("id", appliedPromo.id);
      }
      setPromoCode("");
      setAppliedPromo(null);
      setCheckoutSuccess({
        id: res.data.order_number || res.data.id,
        total,
        points: pointsEarned,
        paymentMethod: checkoutForm.paymentMethod,
        promoCode: appliedPromo?.code || null,
      });
      setCart([]);
      setIsCartOpen(false);
      loadMemberProfile(activeUser.id);
    } catch (err) {
      console.error("Order submission failure:", err);
      setErrorToast("Gagal melakukan pemesanan.");
    }
  };

  const handleRedeemReward = async (reward) => {
    if (!activeMemberProfile) return;
    if (activeMemberProfile.status !== "active") {
      setErrorToast("Membership ditangguhkan. Tidak dapat menukar reward.");
      return;
    }

    if (activeMemberProfile.current_points < reward.points_required) {
      setErrorToast("Poin Anda tidak mencukupi.");
      return;
    }

    if (activeMemberProfile.tier_id < reward.min_tier_id) {
      setErrorToast(`Minimal level ${reward.min_tier_name} diperlukan.`);
      return;
    }

    try {
      const newCurrentPoints =
        activeMemberProfile.current_points - reward.points_required;
      const voucherCode = `VCH-${String(Math.floor(Math.random() * 900000) + 100000)}`;

      const tx = await createPointTransaction({
        membership_id: activeMemberProfile.id,
        order_id: null,
        reward_id: null,
        type: "redeem",
        points: reward.points_required,
        description: `Tukar poin: ${reward.name} (Voucher: ${voucherCode})`,
      });
      if (tx.error) throw tx.error;

      setSuccessToast(
        `Berhasil menukar ${reward.name}! Voucher Code: ${voucherCode}`,
      );
      loadMemberProfile(activeUser.id);
    } catch (err) {
      console.error(err);
      setErrorToast("Gagal menukar reward.");
    }
  };

  const calculatePromoDiscount = () => {
    if (!appliedPromo) return 0;
    const subtotal = calculateCartSubtotal();
    if (appliedPromo.type === "percent") {
      return (subtotal * appliedPromo.value) / 100;
    }
    if (appliedPromo.type === "fixed") {
      return appliedPromo.value;
    }
    return 0;
  };

  const handleApplyPromo = async (code) => {
    const normalizedCode = (code || promoCode || "").trim().toUpperCase();
    setPromoError("");
    if (!normalizedCode) {
      setAppliedPromo(null);
      setPromoError("Masukkan kode promo terlebih dahulu.");
      return;
    }

    try {
      // Query Supabase promotions table (same as GuestShop)
      const { data, error } = await supabase
        .from("promotions")
        .select("*")
        .eq("code", normalizedCode)
        .eq("is_active", true)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        setPromoError("Kode promo tidak valid.");
        setAppliedPromo(null);
        return;
      }

      const now = new Date();
      if (data.start_date && now < new Date(data.start_date)) {
        setPromoError("Voucher ini belum dimulai.");
        setAppliedPromo(null);
        return;
      }
      if (data.end_date && now > new Date(data.end_date)) {
        setPromoError("Voucher ini sudah kedaluwarsa.");
        setAppliedPromo(null);
        return;
      }
      if (data.max_uses && data.current_uses >= data.max_uses) {
        setPromoError("Kuota voucher ini sudah habis.");
        setAppliedPromo(null);
        return;
      }
      if (calculateCartSubtotal() < Number(data.min_order_amount || 0)) {
        setPromoError(
          `Minimal belanja IDR ${Number(data.min_order_amount).toLocaleString("id-ID")} untuk voucher ini.`
        );
        setAppliedPromo(null);
        return;
      }

      // Map db fields to local promo format
      const mapped = {
        ...data,
        code: data.code,
        type: data.discount_type === "percentage" ? "percent" : "fixed",
        value: Number(data.discount_value || 0),
        description: data.description || `Voucher ${data.code}`,
      };
      setPromoError("");
      setAppliedPromo(mapped);
      setPromoCode(mapped.code);
      setSuccessToast(`Promo ${mapped.code} berhasil diterapkan!`);
    } catch (err) {
      console.error("Promo validation error:", err);
      setPromoError("Gagal memvalidasi kode promo.");
    }
  };

  const [menuItems, setMenuItems] = useState([]);
  const [categoriesList, setCategoriesList] = useState(["All"]);

  useEffect(() => {
    (async () => {
      try {
        const { data: itemsData, error } = await getMenuItems({ limit: 200 });
        if (!error) setMenuItems(itemsData || []);
        const { data: catsData } = await getCategories();
        if (catsData && catsData.length)
          setCategoriesList(["All", ...catsData.map((c) => c.name)]);

        const { data: rewardsData, error: rewardsErr } =
          await getMemberRewards();
        if (!rewardsErr && rewardsData) setMemberRewards(rewardsData || []);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  const filteredMenu = menuItems.filter((item) => {
    const matchesCategory =
      activeCategory === "All" ||
      (item.category || "").toLowerCase() ===
      (activeCategory || "").toLowerCase();
    const matchesSearch = (item.name || "")
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F9F5EE] pb-16 font-sans text-slate-800 antialiased">
      {/* Main Navbar */}
      <header className="sticky top-0 bg-[#FAF4EE]/90 backdrop-blur-md z-40 border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between py-4">
          <Link to="/member" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-[#855C3B] flex items-center justify-center text-white shadow-md shadow-[#855C3B]/10 group-hover:scale-105 transition-transform duration-300">
              <LuCoffee className="w-5 h-5" />
            </div>
            <div className="text-left">
              <span className="text-[#4B2C20] font-black text-base tracking-wide block">
                Coffee Shop
              </span>
              <span className="text-[10px] text-amber-700 font-extrabold uppercase tracking-widest block -mt-1">
                Member Portal
              </span>
            </div>
          </Link>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab("shop")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer border-0 ${activeTab === "shop"
                  ? "bg-white text-[#855C3B] shadow-sm"
                  : "text-slate-500 hover:text-slate-800 bg-transparent"
                }`}
            >
              Katalog Menu
            </button>
            <button
              onClick={() => setActiveTab("rewards")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer border-0 ${activeTab === "rewards"
                  ? "bg-white text-[#855C3B] shadow-sm"
                  : "text-slate-500 hover:text-slate-800 bg-transparent"
                }`}
            >
              Tukar Hadiah
            </button>
            <button
              onClick={() => setActiveTab("transactions")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer border-0 ${activeTab === "transactions"
                  ? "bg-white text-[#855C3B] shadow-sm"
                  : "text-slate-500 hover:text-slate-800 bg-transparent"
                }`}
            >
              Riwayat Poin
            </button>
          </nav>

          <div className="flex items-center gap-3">
            {profile ? (
              <button
                onClick={handleLogout}
                className="text-xs font-bold text-rose-600 hover:text-rose-800 transition-colors pr-3.5 border-r border-slate-200 cursor-pointer border-0 bg-transparent flex items-center gap-1.5"
              >
                <LuLogOut className="w-4 h-4" />
                Logout
              </button>
            ) : (
              <Link
                to="/auth/login"
                className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors pr-3.5 border-r border-slate-200"
              >
                Login
              </Link>
            )}

            {/* Notification Bell */}
            {activeUser?.id && (
              <button
                onClick={() => setIsNotifOpen(true)}
                className="relative p-2 rounded-xl hover:bg-slate-100 transition-all cursor-pointer flex items-center gap-1 text-slate-500 border-0 bg-transparent"
                title="Notifikasi"
              >
                <LuBell className="w-5 h-5" />
                {unreadNotifCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-rose-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-black">
                    {unreadNotifCount > 9 ? "9+" : unreadNotifCount}
                  </span>
                )}
              </button>
            )}

            {/* Cart Button trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-xl hover:bg-slate-100 transition-all cursor-pointer flex items-center gap-1 bg-amber-500/10 text-[#855C3B] border-0"
            >
              <LuShoppingCart className="w-5 h-5" />
              {cart.length > 0 && (
                <span className="bg-[#855C3B] text-white text-[10px] px-1.5 py-0.5 rounded-full font-black">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Grid Content Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col: Member Profile & Card */}
        <div className="space-y-6 lg:col-span-1">
          <FadeIn duration={0.5}>
            {/* Digital Membership Card */}
            <MemberProfileCard
              activeMemberProfile={activeMemberProfile}
              activeUser={activeUser}
              nextTierInfo={getNextTierInfo()}
            />

            {/* Level Benefits summary */}
            <MemberBenefits activeMemberProfile={activeMemberProfile} />

            {/* Quick Mobile Navigation */}
            <div className="flex md:hidden gap-2 bg-slate-100 p-1 rounded-xl mt-6">
              <button
                onClick={() => setActiveTab("shop")}
                className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer border-0 ${activeTab === "shop"
                    ? "bg-white text-[#855C3B] shadow-sm"
                    : "text-slate-500 bg-transparent"
                  }`}
              >
                Belanja
              </button>
              <button
                onClick={() => setActiveTab("rewards")}
                className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer border-0 ${activeTab === "rewards"
                    ? "bg-white text-[#855C3B] shadow-sm"
                    : "text-slate-500 bg-transparent"
                  }`}
              >
                Hadiah
              </button>
              <button
                onClick={() => setActiveTab("transactions")}
                className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer border-0 ${activeTab === "transactions"
                    ? "bg-white text-[#855C3B] shadow-sm"
                    : "text-slate-500 bg-transparent"
                  }`}
              >
                Poin
              </button>
            </div>
          </FadeIn>
        </div>

        {/* Right Col: Dynamic Portal Tabs */}
        <div className="lg:col-span-2 space-y-6">
          {successToast && (
            <div className="flex items-center gap-2 p-3 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl animate-[fadeIn_0.3s_ease-out]">
              <LuCheck className="w-4 h-4 text-emerald-500" />
              <span>{successToast}</span>
            </div>
          )}

          {errorToast && (
            <div className="flex items-center gap-2 p-3 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-xl animate-[fadeIn_0.3s_ease-out]">
              <LuCircleAlert className="w-4 h-4 text-rose-500" />
              <span>{errorToast}</span>
            </div>
          )}

          {/* TAB 1: Shop Catalogue */}
          {activeTab === "shop" && (
            <MemberShopCatalogue
              categoriesList={categoriesList}
              activeCategory={activeCategory}
              onSelectCategory={setActiveCategory}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filteredMenu={filteredMenu}
              activeMemberProfile={activeMemberProfile}
              onAddToCart={addToCart}
            />
          )}

          {/* TAB 2: Rewards List */}
          {activeTab === "rewards" && (
            <MemberRewards
              memberRewards={memberRewards}
              activeMemberProfile={activeMemberProfile}
              onRedeemReward={handleRedeemReward}
              SAMPLE_REWARDS={SAMPLE_REWARDS}
            />
          )}

          {/* TAB 3: Transactions Points History */}
          {activeTab === "transactions" && (
            <MemberTransactions transactions={transactions} />
          )}
        </div>
      </main>

      {/* SHOPPING CART SIDEBAR PANEL */}
      <MemberCartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQty={updateCartQty}
        onRemoveFromCart={removeFromCart}
        activeMemberProfile={activeMemberProfile}
        checkoutForm={checkoutForm}
        setCheckoutForm={setCheckoutForm}
        promoCode={promoCode}
        setPromoCode={setPromoCode}
        onApplyPromo={handleApplyPromo}
        appliedPromo={appliedPromo}
        promoError={promoError}
        subtotal={calculateCartSubtotal()}
        discount={calculateCartDiscount()}
        promoDiscount={calculatePromoDiscount()}
        total={calculateCartTotal()}
        estimatedPoints={calculateEstimatedPoints()}
        onSubmitCheckout={handleCheckoutSubmit}
      />

      {/* CHECKOUT SUCCESS MODAL */}
      <MemberCheckoutSuccess
        checkoutSuccess={checkoutSuccess}
        onClose={() => setCheckoutSuccess(null)}
      />

      {/* NOTIFICATION DRAWER */}
      {activeUser?.id && (
        <NotificationDrawer
          userId={activeUser.id}
          isOpen={isNotifOpen}
          onClose={() => setIsNotifOpen(false)}
        />
      )}

    </div>
  );
}
