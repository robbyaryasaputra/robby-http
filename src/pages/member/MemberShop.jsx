import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LuCoffee,
  LuBell,
  LuShoppingCart,
  LuCheck,
  LuCircleAlert,
} from "react-icons/lu";
import { supabase } from "../../lib/supabase";
import {
  getMenuItems,
  getMemberMembershipByCustomer,
  createPointTransaction,
  getCategories,
  createOrder,
  getMemberRewards,
} from "../../lib/db";
import { SlideUp, FadeIn } from "../../components/animation";

// Import modular sub-components
import MemberProfileCard from "./components/MemberProfileCard";
import MemberBenefits from "./components/MemberBenefits";
import MemberShopCatalogue from "./components/MemberShopCatalogue";
import MemberRewards from "./components/MemberRewards";
import MemberTransactions from "./components/MemberTransactions";
import MemberCartDrawer from "./components/MemberCartDrawer";
import MemberCheckoutSuccess from "./components/MemberCheckoutSuccess";
import NotificationDrawer from "./components/NotificationDrawer";

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

  // App States
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [activeUser, setActiveUser] = useState(null);
  const [activeMemberProfile, setActiveMemberProfile] = useState(null);
  const [dbMode, setDbMode] = useState("supabase");
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

  // Notifications
  const [notifications, setNotifications] = useState([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    if (selectedUserId) {
      loadMemberProfile(selectedUserId);
    }
  }, [selectedUserId]);

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

  // Safe helper to parse logged user from localStorage
  const getSafeLoggedUserId = () => {
    try {
      const loggedUser = localStorage.getItem("user");
      if (!loggedUser) return null;
      // Check if it's stored as serialized JSON object
      if (loggedUser.startsWith("{")) {
        const parsed = JSON.parse(loggedUser);
        return parsed?.id || null;
      }
      // If it is stored as a raw string ID
      return loggedUser;
    } catch (e) {
      console.warn("Failed to parse logged user from localStorage:", e);
      return null;
    }
  };

  // Load registered users to populate selector
  const loadUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .order("name", { ascending: true });

      if (error) throw error;

      setUsers(data || []);
      setDbMode("supabase");

      if (data && data.length > 0) {
        const loggedId = getSafeLoggedUserId();
        const found = loggedId ? data.find((u) => u.id === loggedId) : null;

        if (found) {
          setSelectedUserId(found.id);
        } else {
          setSelectedUserId(data[0].id);
        }
      } else {
        setDbMode("local");
        loadLocalUsers();
      }
    } catch (err) {
      console.warn(
        "Supabase load users failed. Switching to Local Database Mode.",
      );
      setDbMode("local");
      loadLocalUsers();
    }
  };

  const loadLocalUsers = () => {
    const localUsers = localStorage.getItem("local_users") || "[]";
    let list = JSON.parse(localUsers);

    if (list.length === 0) {
      list = [
        {
          id: "u-1",
          name: "Budi Santoso",
          email: "budi.santoso@gmail.com",
          created_at: "2026-05-10",
        },
        {
          id: "u-2",
          name: "Siti Rahayu",
          email: "siti.rahayu@yahoo.com",
          created_at: "2026-06-01",
        },
        {
          id: "u-3",
          name: "Ahmad Hidayat",
          email: "ahmad.hidayat@outlook.com",
          created_at: "2026-06-15",
        },
        {
          id: "u-4",
          name: "Dewi Lestari",
          email: "dewi.lestari@gmail.com",
          created_at: "2026-06-20",
        },
      ];
      localStorage.setItem("local_users", JSON.stringify(list));
    }
    setUsers(list);

    const loggedId = getSafeLoggedUserId();
    const found = loggedId ? list.find((u) => u.id === loggedId) : null;
    setSelectedUserId(found ? found.id : list[0].id);
  };

  // Load specific membership profile
  const loadMemberProfile = async (userId) => {
    setLoading(true);
    try {
      const userObj = users.find((u) => u.id === userId);
      setActiveUser(userObj);

      setCheckoutForm((prev) => ({ ...prev, name: userObj?.name || "" }));

      let membership = null;

      if (dbMode === "supabase") {
        const { data, error } = await supabase
          .from("members")
          .select("*")
          .eq("id", userId)
          .single();

        if (error && error.code !== "PGRST116") throw error;

        if (data) {
          membership = data;
        } else {
          const { data: newMem, error: insError } = await supabase
            .from("members")
            .insert({
              id: userId,
              tier: "Bronze",
              member_code: `MBR-${String(Math.floor(Math.random() * 90000) + 10000)}`,
              total_points: 0,
              current_points: 0,
              status: "active",
            })
            .select()
            .single();

          if (insError) throw insError;
          membership = newMem;
        }
      } else {
        const localData = localStorage.getItem("local_memberships");
        let memberships = localData ? JSON.parse(localData) : [];
        let found = memberships.find((m) => m.customer_id === userId);

        if (!found) {
          found = {
            id: `local-mem-${userId}`,
            customer_id: userId,
            tier_id: 1,
            member_code: `MBR-${String(Math.floor(Math.random() * 90000) + 10000)}`,
            total_points: 0,
            current_points: 0,
            join_date: new Date().toISOString().split("T")[0],
            status: "active",
          };
          memberships.push(found);
          localStorage.setItem(
            "local_memberships",
            JSON.stringify(memberships),
          );
        }
        membership = found;
      }

      const mappedMembership = membership
        ? {
            ...membership,
            tier_id:
              dbMode === "supabase"
                ? tierNameToId[membership.tier] || 1
                : membership.tier_id || 1,
          }
        : null;

      const tierObj =
        MEMBERSHIP_TIERS.find(
          (t) => t.id === (mappedMembership ? mappedMembership.tier_id : 1),
        ) || MEMBERSHIP_TIERS[0];

      setActiveMemberProfile({
        ...mappedMembership,
        tier: tierObj,
      });

      loadTransactions(membership.id, userId);
      loadNotifications(userId);
    } catch (err) {
      console.error("Load member profile error:", err);
      setErrorToast("Gagal memuat profil member.");
    } finally {
      setLoading(false);
    }
  };

  const loadTransactions = async (membershipId, userId) => {
    try {
      if (dbMode === "supabase" && userId) {
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
          return;
        }
      }

      const localTx = localStorage.getItem("local_point_transactions");
      const list = localTx ? JSON.parse(localTx) : [];
      const filtered = list.filter(
        (tx) => tx.membership_id === membershipId || tx.customer_id === userId,
      );
      setTransactions(
        filtered.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at),
        ),
      );
    } catch (err) {
      console.error(err);
    }
  };

  const loadNotifications = async (userId) => {
    if (!userId || dbMode !== "supabase") {
      setNotifications([]);
      return;
    }
    try {
      const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      setNotifications(data || []);
    } catch (err) {
      console.error("Gagal memuat notifikasi member:", err);
    }
  };

  const markMemberNotifsAsRead = async () => {
    try {
      const unreadIds = notifications
        .filter((n) => !n.is_read)
        .map((n) => n.id);
      if (unreadIds.length === 0) return;
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .in("id", unreadIds);
      if (!error) {
        setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      }
    } catch (err) {
      console.error("Gagal menandai notifikasi dibaca:", err);
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

    const existingOrdersStr = localStorage.getItem("orders");
    const ordersList = existingOrdersStr ? JSON.parse(existingOrdersStr) : [];

    try {
      if (dbMode === "supabase") {
        const orderPayload = {
          order_number: orderId,
          customer_id: activeUser?.id || null,
          customer_name: activeUser?.name || "Member",
          status: "processing",
          delivery_type: "dine_in",
          table_number: null,
          subtotal: subtotal,
          discount_amount: discount,
          tax_amount: 0,
          total_amount: total,
          notes: null,
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
        loadMemberProfile(selectedUserId);
        return;
      }

      const newOrder = {
        id: orderId,
        customer: activeUser?.name || "Member",
        item: orderItemsSummary,
        total: total,
        paymentMethod: checkoutForm.paymentMethod,
        promoCode: appliedPromo?.code || null,
        status: "Completed",
        date: new Date().toISOString().split("T")[0],
      };
      ordersList.unshift(newOrder);
      localStorage.setItem("orders", JSON.stringify(ordersList));

      const newCurrentPoints =
        activeMemberProfile.current_points + pointsEarned;
      const newTotalPoints = activeMemberProfile.total_points + pointsEarned;
      const localData = localStorage.getItem("local_memberships");
      if (localData) {
        const memberships = JSON.parse(localData);
        const idx = memberships.findIndex(
          (m) => m.customer_id === activeUser.id,
        );
        if (idx !== -1) {
          memberships[idx].current_points = newCurrentPoints;
          memberships[idx].total_points = newTotalPoints;
          localStorage.setItem(
            "local_memberships",
            JSON.stringify(memberships),
          );
        }
      }

      const localTx = localStorage.getItem("local_point_transactions");
      const txs = localTx ? JSON.parse(localTx) : [];
      txs.push({
        id: `tx-${Date.now()}`,
        membership_id: activeMemberProfile.id,
        customer_id: activeUser.id,
        type: "earn",
        points: pointsEarned,
        description: `Belanja Kopishop (Order ID: ${orderId})`,
        balance_after: newCurrentPoints,
        created_at: new Date().toISOString(),
      });
      localStorage.setItem("local_point_transactions", JSON.stringify(txs));

      setCheckoutSuccess({
        id: orderId,
        total,
        points: pointsEarned,
        paymentMethod: checkoutForm.paymentMethod,
        promoCode: appliedPromo?.code || null,
      });
      setCart([]);
      setIsCartOpen(false);
      loadMemberProfile(selectedUserId);
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

      if (dbMode === "supabase") {
        const tx = await createPointTransaction({
          membership_id: activeMemberProfile.id,
          order_id: null,
          reward_id: null,
          type: "redeem",
          points: reward.points_required,
          description: `Tukar poin: ${reward.name} (Voucher: ${voucherCode})`,
        });
        if (tx.error) throw tx.error;
      } else {
        const localData = localStorage.getItem("local_memberships");
        if (localData) {
          const memberships = JSON.parse(localData);
          const idx = memberships.findIndex(
            (m) => m.customer_id === activeUser.id,
          );
          if (idx !== -1) {
            memberships[idx].current_points = newCurrentPoints;
            localStorage.setItem(
              "local_memberships",
              JSON.stringify(memberships),
            );
          }
        }

        const localTx = localStorage.getItem("local_point_transactions");
        const txs = localTx ? JSON.parse(localTx) : [];
        txs.push({
          id: `tx-${Date.now()}`,
          membership_id: activeMemberProfile.id,
          customer_id: activeUser.id,
          type: "redeem",
          points: -reward.points_required,
          description: `Tukar poin: ${reward.name} (Voucher: ${voucherCode})`,
          balance_after: newCurrentPoints,
          created_at: new Date().toISOString(),
        });
        localStorage.setItem("local_point_transactions", JSON.stringify(txs));
      }

      setSuccessToast(
        `Berhasil menukar ${reward.name}! Voucher Code: ${voucherCode}`,
      );
      loadMemberProfile(selectedUserId);
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

  const handleApplyPromo = (code) => {
    const normalizedCode = (code || promoCode || "").trim().toUpperCase();
    if (!normalizedCode) {
      setPromoError("Masukkan kode promo terlebih dahulu.");
      setAppliedPromo(null);
      return;
    }

    const PROMO_CODES = [
      {
        code: "MEMBER10",
        type: "percent",
        value: 10,
        description: "Diskon 10% untuk member",
      },
      {
        code: "COFFEE20",
        type: "fixed",
        value: 20000,
        description: "Potongan Rp20.000 untuk pesanan",
      },
    ];

    const found = PROMO_CODES.find((promo) => promo.code === normalizedCode);
    if (!found) {
      setPromoError("Kode promo tidak valid.");
      setAppliedPromo(null);
      return;
    }

    setPromoError("");
    setAppliedPromo(found);
    setPromoCode(found.code);
    setSuccessToast(`Promo ${found.code} berhasil diterapkan!`);
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
      {/* Upper Tester bar */}
      <div className="bg-[#4B2C20] py-3.5 px-6 text-white text-xs font-semibold shadow-md flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="bg-amber-500/20 text-amber-200 border border-amber-500/30 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wide font-sans">
            Testing Utility
          </span>
          <span>Pilih Profil Pelanggan untuk Uji Coba:</span>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="bg-[#5c3729] text-white text-xs font-bold border border-white/10 rounded-lg px-3 py-1.5 focus:outline-none hover:cursor-pointer"
          >
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.email})
              </option>
            ))}
          </select>
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-white/10 ${
              dbMode === "supabase" ? "text-emerald-300" : "text-amber-300"
            }`}
          >
            {dbMode === "supabase" ? "Supabase Connect" : "Local Mode"}
          </span>
        </div>
      </div>

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
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer border-0 ${
                activeTab === "shop"
                  ? "bg-white text-[#855C3B] shadow-sm"
                  : "text-slate-500 hover:text-slate-800 bg-transparent"
              }`}
            >
              Katalog Menu
            </button>
            <button
              onClick={() => setActiveTab("rewards")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer border-0 ${
                activeTab === "rewards"
                  ? "bg-white text-[#855C3B] shadow-sm"
                  : "text-slate-500 hover:text-slate-800 bg-transparent"
              }`}
            >
              Tukar Hadiah
            </button>
            <button
              onClick={() => setActiveTab("transactions")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer border-0 ${
                activeTab === "transactions"
                  ? "bg-white text-[#855C3B] shadow-sm"
                  : "text-slate-500 hover:text-slate-800 bg-transparent"
              }`}
            >
              Riwayat Poin
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors hidden sm:block border-r border-slate-200 pr-3.5"
            >
              Dashboard Admin
            </Link>

            {/* Notification Bell Button */}
            <button
              onClick={() => {
                setIsNotifOpen(!isNotifOpen);
                if (!isNotifOpen) markMemberNotifsAsRead();
              }}
              className="relative p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-all cursor-pointer border-0 bg-transparent"
            >
              <LuBell className="w-5 h-5" />
              {notifications.some((n) => !n.is_read) && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white animate-pulse" />
              )}
            </button>

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
                className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer border-0 ${
                  activeTab === "shop"
                    ? "bg-white text-[#855C3B] shadow-sm"
                    : "text-slate-500 bg-transparent"
                }`}
              >
                Belanja
              </button>
              <button
                onClick={() => setActiveTab("rewards")}
                className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer border-0 ${
                  activeTab === "rewards"
                    ? "bg-white text-[#855C3B] shadow-sm"
                    : "text-slate-500 bg-transparent"
                }`}
              >
                Hadiah
              </button>
              <button
                onClick={() => setActiveTab("transactions")}
                className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer border-0 ${
                  activeTab === "transactions"
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

      {/* NOTIFICATIONS DRAWER OVERLAY */}
      <NotificationDrawer
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
        notifications={notifications}
      />
    </div>
  );
}
