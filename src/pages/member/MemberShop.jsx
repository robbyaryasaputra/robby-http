import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LuCoffee,
  LuShoppingCart,
  LuSearch,
  LuPlus,
  LuMinus,
  LuTrash2,
  LuX,
  LuAward,
  LuCoins,
  LuHistory,
  LuGift,
  LuChevronRight,
  LuCheck,
  LuLoader,
  LuCircleCheck,
  LuCircleAlert,
  LuUtensils,
  LuCreditCard,
  LuTag,
  LuBell,
} from "react-icons/lu";
import { supabase } from "../../lib/supabase";
import {
  getMenuItems,
  getMembershipTiers,
  getMemberMembershipByCustomer,
  createPointTransaction,
  getCategories,
  createOrder,
  getMemberRewards,
} from "../../lib/db";
import RatingStars from "../../components/status/RatingStars";
import { SlideUp, FadeIn } from "../../components/animation";

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

// Rewards (fetched from DB; fallback to static sample if needed)
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
  const [levelupReward, setLevelupReward] = useState(null);

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

      const subtotal = calculateCartSubtotal();
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

      setAppliedPromo(data);
      setSuccessToast(`Voucher ${data.code} berhasil diterapkan!`);
    } catch (err) {
      console.error(err);
      setPromoError("Gagal memvalidasi kode voucher.");
    }
  };

  const calculatePromoDiscount = () => {
    if (!appliedPromo) return 0;
    const subtotal = calculateCartSubtotal();
    const discountVal = Number(appliedPromo.discount_value || 0);
    if (appliedPromo.discount_type === "percentage") {
      return (subtotal * discountVal) / 100;
    } else {
      return discountVal;
    }
  };

  // Points Transactions History
  const [transactions, setTransactions] = useState([]);

  // Toast messages
  const [successToast, setSuccessToast] = useState("");
  const [errorToast, setErrorToast] = useState("");

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
        const loggedUser = localStorage.getItem("user");
        const found = loggedUser
          ? data.find((u) => u.id === JSON.parse(loggedUser).id)
          : null;

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

    const loggedUser = localStorage.getItem("user");
    const found = loggedUser
      ? list.find((u) => u.id === JSON.parse(loggedUser).id)
      : null;
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

      const tierNameToId = {
        Bronze: 1,
        Silver: 2,
        Gold: 3,
        Platinum: 4,
      };

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

  const [notifications, setNotifications] = useState([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

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

  // Menu items from DB
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
          <span className="bg-amber-500/20 text-amber-200 border border-amber-500/30 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wide">
            Testing Utility
          </span>
          <span>Pilih Profil Pelanggan untuk Uji Coba:</span>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="bg-[#5c3729] text-white text-xs font-bold border border-white/10 rounded-lg px-3 py-1.5 focus:outline-none"
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
            <div>
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
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === "shop"
                  ? "bg-white text-[#855C3B] shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Katalog Menu
            </button>
            <button
              onClick={() => setActiveTab("rewards")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === "rewards"
                  ? "bg-white text-[#855C3B] shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Tukar Hadiah
            </button>
            <button
              onClick={() => setActiveTab("transactions")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === "transactions"
                  ? "bg-white text-[#855C3B] shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
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
              className="relative p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-all cursor-pointer"
            >
              <LuBell className="w-5 h-5" />
              {notifications.some((n) => !n.is_read) && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white animate-pulse" />
              )}
            </button>

            {/* Cart Button trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-all cursor-pointer flex items-center gap-1 bg-amber-500/10 text-[#855C3B]"
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
            {activeMemberProfile && (
              <div
                className={`rounded-3xl bg-gradient-to-br ${activeMemberProfile.tier.bg_gradient} p-6 text-white shadow-xl relative overflow-hidden border border-white/5`}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-6 -mt-6"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-xl -ml-6 -mb-6"></div>

                <div className="flex items-center justify-between mb-8 relative z-10">
                  <span className="text-[10px] font-extrabold tracking-widest uppercase bg-white/15 px-2.5 py-0.5 rounded-md border border-white/10">
                    Loyalty Member Card
                  </span>
                  <LuCoffee className="w-6 h-6 text-white/30" />
                </div>

                <div className="mb-8 relative z-10">
                  <span className="text-[10px] text-white/60 font-bold uppercase tracking-wider block">
                    Nama Pelanggan
                  </span>
                  <h3 className="text-lg font-black tracking-wide leading-none">
                    {activeUser?.name}
                  </h3>
                  <span className="text-[10px] text-white/40 block mt-1 font-mono tracking-wider">
                    {activeMemberProfile.member_code}
                  </span>
                </div>

                <div className="flex justify-between items-end relative z-10 pt-4 border-t border-white/10">
                  <div>
                    <span className="text-[10px] text-white/60 font-bold uppercase tracking-wider block">
                      Status Level
                    </span>
                    <span className="inline-flex items-center gap-1 mt-0.5 text-xs font-black tracking-wider px-2 py-0.5 rounded bg-white text-slate-800 shadow-sm border border-slate-100">
                      <LuAward
                        className="w-3.5 h-3.5"
                        style={{ color: activeMemberProfile.tier.badge_color }}
                      />
                      {activeMemberProfile.tier.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-white/60 font-bold uppercase tracking-wider block">
                      Poin Aktif
                    </span>
                    <span className="text-xl font-black tracking-wide text-amber-300">
                      {activeMemberProfile.current_points}{" "}
                      <span className="text-[10px] text-white/80 font-bold">pts</span>
                    </span>
                  </div>
                </div>

                {/* Progress bar info */}
                {getNextTierInfo() && (
                  <div className="mt-5 pt-4 border-t border-white/5 relative z-10 space-y-1.5">
                    <div className="flex justify-between items-center text-[10px] font-bold text-white/70">
                      <span>Progress ke {getNextTierInfo().name}</span>
                      <span>
                        {activeMemberProfile.total_points} / {getNextTierInfo().targetPoints} pts
                      </span>
                    </div>
                    <div className="w-full bg-black/25 h-1.5 rounded-full overflow-hidden p-0.5 border border-white/5">
                      <div
                        className="bg-amber-400 h-full rounded-full transition-all duration-500"
                        style={{ width: `${getNextTierInfo().percent}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-white/50 font-medium pt-0.5">
                      Butuh {getNextTierInfo().pointsNeeded} poin lagi untuk naik tingkat.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Level Benefits summary */}
            {activeMemberProfile && (
              <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm mt-6">
                <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider pb-3 border-b border-slate-100 mb-4 flex items-center gap-1.5">
                  <LuAward className="w-4 h-4 text-amber-600" /> Benefit Level{" "}
                  {activeMemberProfile.tier.name}
                </h4>
                <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
                  {activeMemberProfile.tier.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <LuCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Quick Mobile Navigation */}
            <div className="flex md:hidden gap-2 bg-slate-100 p-1 rounded-xl mt-6">
              <button
                onClick={() => setActiveTab("shop")}
                className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "shop" ? "bg-white text-[#855C3B] shadow-sm" : "text-slate-500"
                }`}
              >
                Belanja
              </button>
              <button
                onClick={() => setActiveTab("rewards")}
                className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "rewards" ? "bg-white text-[#855C3B] shadow-sm" : "text-slate-500"
                }`}
              >
                Hadiah
              </button>
              <button
                onClick={() => setActiveTab("transactions")}
                className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "transactions" ? "bg-white text-[#855C3B] shadow-sm" : "text-slate-500"
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
            <SlideUp duration={0.4}>
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
                  <div className="flex flex-wrap gap-1.5">
                    {categoriesList.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          activeCategory === cat
                            ? "bg-[#855C3B] text-white shadow-sm"
                            : "text-slate-500 hover:bg-slate-50"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                  <div className="relative">
                    <LuSearch className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Cari menu favorit..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 w-full sm:w-60 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#855C3B]/50 transition-colors"
                    />
                  </div>
                </div>

                {/* Grid of Menu Items */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {filteredMenu.map((item) => {
                    const discountPercent = activeMemberProfile
                      ? parseFloat(activeMemberProfile.tier.discount_percent)
                      : 0;
                    const hasDiscount = discountPercent > 0;
                    const discountedPrice = item.price * (1 - discountPercent / 100);
                    return (
                      <div
                        key={item.id}
                        className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md hover:border-slate-200/80 transition-all flex flex-col group"
                      >
                        <div className="h-44 relative bg-slate-100 overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          {item.badge && (
                            <span className="absolute top-3 left-3 bg-[#4B2C20] text-white font-extrabold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md shadow-sm">
                              {item.badge}
                            </span>
                          )}
                          {hasDiscount && (
                            <span className="absolute top-3 right-3 bg-red-500 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-md shadow-sm">
                              Diskon {discountPercent}%
                            </span>
                          )}
                        </div>

                        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                          <div className="space-y-1.5">
                            <div className="flex justify-between items-start gap-1">
                              <h4 className="font-extrabold text-slate-800 text-base">
                                {item.name}
                              </h4>
                              <div className="flex items-center gap-0.5 text-xs text-amber-500 shrink-0 font-bold">
                                <RatingStars rating={item.rating} size="xs" />
                                <span className="text-slate-400 font-semibold text-[10px] ml-0.5">
                                  ({item.reviews})
                                </span>
                              </div>
                            </div>
                            <p className="text-xs text-slate-400 font-medium line-clamp-2 leading-relaxed">
                              {item.description}
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                            <div>
                              {hasDiscount ? (
                                <div className="space-y-0.5">
                                  <span className="text-[10px] text-slate-400 line-through block font-medium">
                                    IDR {Number(item.price).toLocaleString("id-ID")}
                                  </span>
                                  <span className="text-[#855C3B] font-black text-sm">
                                    IDR {Number(discountedPrice).toLocaleString("id-ID")}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-slate-800 font-black text-sm">
                                  IDR {Number(item.price).toLocaleString("id-ID")}
                                </span>
                              )}
                            </div>
                            <button
                              onClick={() => addToCart(item)}
                              className="p-2.5 rounded-xl bg-[#855C3B] text-white hover:bg-[#6d4734] transition-colors cursor-pointer group-hover:scale-105 duration-300 shadow-md shadow-[#855C3B]/10"
                            >
                              <LuPlus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </SlideUp>
          )}

          {/* TAB 2: Rewards List */}
          {activeTab === "rewards" && (
            <SlideUp duration={0.4}>
              <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <h3 className="font-black text-slate-800 text-lg">Tukar Reward Points</h3>
                  <p className="text-xs text-slate-400 font-medium mt-1">
                    Gunakan poin Anda untuk mengklaim voucher minuman atau makanan gratis.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(memberRewards.length > 0 ? memberRewards : SAMPLE_REWARDS).map((reward) => {
                    const meetsTier = activeMemberProfile
                      ? activeMemberProfile.tier_id >= (reward.min_tier_id || 1)
                      : false;
                    const hasPoints = activeMemberProfile
                      ? activeMemberProfile.current_points >= reward.points_required
                      : false;
                    const isRedeemable = meetsTier && hasPoints;

                    return (
                      <div
                        key={reward.id}
                        className="border border-slate-100 rounded-2xl p-4 flex flex-col justify-between gap-4 hover:border-slate-200 transition-colors bg-slate-50/40"
                      >
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <h4 className="font-black text-slate-800 text-sm">{reward.name}</h4>
                            <span
                              className={`inline-flex px-2 py-0.5 rounded-full text-xs font-bold ${
                                isRedeemable
                                  ? "text-amber-700 bg-amber-50 border border-amber-200"
                                  : "text-slate-400 bg-slate-50 border border-slate-100"
                              }`}
                            >
                              {reward.points_required} pts
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 font-medium leading-relaxed">
                            {reward.description}
                          </p>
                          <div className="flex items-center gap-1 pt-1.5">
                            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                              Syarat Level:
                            </span>
                            <span
                              className={`text-[10px] font-bold ${
                                meetsTier ? "text-slate-600" : "text-amber-600 font-extrabold"
                              }`}
                            >
                              {reward.min_tier_name || "Bronze"}
                            </span>
                          </div>
                        </div>
                        <div>
                          {isRedeemable ? (
                            <button
                              onClick={() => handleRedeemReward(reward)}
                              className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-amber-600/10 active:scale-[0.98]"
                            >
                              <LuCoins className="w-4 h-4" /> Klaim Sekarang
                            </button>
                          ) : (
                            <div className="bg-slate-50 border border-slate-100 rounded-xl p-2 text-center text-slate-400 text-[10px] font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5">
                              {!meetsTier ? (
                                <>🔒 Butuh Level {reward.min_tier_name}</>
                              ) : (
                                <>
                                  🔒 Poin Kurang{" "}
                                  {reward.points_required -
                                    (activeMemberProfile?.current_points || 0)}{" "}
                                  pts
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </SlideUp>
          )}

          {/* TAB 3: Transactions Points History */}
          {activeTab === "transactions" && (
            <SlideUp duration={0.4}>
              <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <h3 className="font-black text-slate-800 text-lg">Riwayat Mutasi Poin</h3>
                  <p className="text-xs text-slate-400 font-medium mt-1">
                    Catatan penambahan dan penukaran point loyalti Anda.
                  </p>
                </div>

                {transactions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-slate-400 text-center space-y-2">
                    <LuHistory className="w-10 h-10 text-slate-200" />
                    <p className="text-xs font-medium">Belum ada transaksi poin tersedia</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto border border-slate-100 rounded-2xl">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                          <th className="px-4 py-3">Tanggal</th>
                          <th className="px-4 py-3">Jenis</th>
                          <th className="px-4 py-3">Jumlah</th>
                          <th className="px-4 py-3">Keterangan</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 font-medium">
                        {transactions.map((tx) => {
                          const isPositive = tx.type === "earn";
                          return (
                            <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-4 py-3.5 text-slate-400 whitespace-nowrap">
                                {new Date(tx.created_at).toLocaleDateString("id-ID", {
                                  day: "numeric",
                                  month: "short",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </td>
                              <td className="px-4 py-3.5 whitespace-nowrap">
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${
                                    isPositive
                                      ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                                      : "bg-rose-50 text-rose-500 border border-rose-100"
                                  }`}
                                >
                                  {tx.type === "earn"
                                    ? "Belanja"
                                    : tx.type === "redeem"
                                      ? "Tukar"
                                      : "Koreksi"}
                                </span>
                              </td>
                              <td
                                className={`px-4 py-3.5 font-bold text-sm ${
                                  isPositive ? "text-emerald-600" : "text-red-500"
                                }`}
                              >
                                {isPositive ? `+${tx.points}` : tx.points}{" "}
                                <span className="text-[10px] font-semibold text-slate-400">
                                  pts
                                </span>
                              </td>
                              <td className="px-4 py-3.5 text-slate-500 break-words leading-relaxed max-w-[220px]">
                                {tx.description}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </SlideUp>
          )}
        </div>
      </main>

      {/* SHOPPING CART SIDEBAR PANEL */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-[#FAF4EE] w-full max-w-md h-full flex flex-col p-6 shadow-2xl animate-[slideLeft_0.3s_ease-out] relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <LuShoppingCart className="w-5 h-5 text-[#855C3B]" />
                <h3 className="font-extrabold text-slate-800 text-lg">Keranjang Belanja</h3>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                <LuX className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items Area */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center text-slate-400 space-y-2">
                  <LuShoppingCart className="w-12 h-12 text-slate-200" />
                  <p className="text-xs font-semibold">Keranjang Anda masih kosong</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 object-cover rounded-xl bg-slate-50"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-800 text-xs truncate">{item.name}</h4>
                      <p className="text-[10px] text-slate-400 font-medium">
                        IDR {Number(item.price).toLocaleString("id-ID")} / item
                      </p>
                      <span className="text-xs font-extrabold text-[#855C3B] block mt-0.5">
                        IDR {Number(item.price * item.quantity).toLocaleString("id-ID")}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-100 shrink-0">
                      <button
                        onClick={() => updateCartQty(item.id, -1)}
                        className="w-6 h-6 rounded-lg hover:bg-white text-slate-500 flex items-center justify-center text-xs font-bold cursor-pointer transition-colors"
                      >
                        <LuMinus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-black text-slate-700 w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQty(item.id, 1)}
                        className="w-6 h-6 rounded-lg hover:bg-white text-slate-500 flex items-center justify-center text-xs font-bold cursor-pointer transition-colors"
                      >
                        <LuPlus className="w-3 h-3" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-slate-300 hover:text-red-500 rounded-lg hover:bg-red-50 shrink-0 cursor-pointer transition-colors"
                    >
                      <LuTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Cart Summary Form & Pricing */}
            {cart.length > 0 && activeMemberProfile && (
              <form onSubmit={handleCheckoutSubmit} className="border-t border-slate-100 pt-4 space-y-4">
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-2">
                  <div className="flex gap-2">
                    <label className="flex-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                        Pengantaran
                      </span>
                      <select
                        value={checkoutForm.deliveryType}
                        onChange={(e) =>
                          setCheckoutForm((prev) => ({ ...prev, deliveryType: e.target.value }))
                        }
                        className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-xs font-semibold focus:outline-none"
                      >
                        <option value="dine_in">Dine In (Meja)</option>
                        <option value="takeaway">Takeaway (Bawa Pulang)</option>
                      </select>
                    </label>
                    {checkoutForm.deliveryType === "dine_in" && (
                      <label className="w-24">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                          No Meja
                        </span>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 5"
                          value={checkoutForm.tableNumber}
                          onChange={(e) =>
                            setCheckoutForm((prev) => ({ ...prev, tableNumber: e.target.value }))
                          }
                          className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-xs text-center font-bold focus:outline-none"
                        />
                      </label>
                    )}
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-2 text-left">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                    Metode Pembayaran
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {["Cash", "QRIS", "Card", "Member Balance"].map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() =>
                          setCheckoutForm((prev) => ({ ...prev, paymentMethod: method }))
                        }
                        className={`py-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-1 transition-all duration-300 ${
                          checkoutForm.paymentMethod === method
                            ? "bg-[#855C3B] text-white border-[#855C3B] shadow-sm"
                            : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {method === "Card" && <LuCreditCard className="w-3.5 h-3.5" />}
                        {method === "Member Balance" && <LuAward className="w-3.5 h-3.5" />}
                        <span>{method}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block text-left">
                    Kode Voucher / Promo
                  </span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="E.G. COFFEEBARU"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold uppercase tracking-wide focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleApplyPromo(promoCode)}
                      className="px-4 bg-[#4B2C20] hover:bg-[#3f2419] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      Gunakan
                    </button>
                  </div>
                  {promoError && (
                    <p className="text-[10px] text-rose-500 font-bold text-left">{promoError}</p>
                  )}
                </div>

                <div className="border-t border-b border-dashed border-slate-200 py-3 space-y-1.5 text-xs font-medium text-slate-500">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-slate-700 font-semibold">
                      IDR {Number(calculateCartSubtotal()).toLocaleString("id-ID")}
                    </span>
                  </div>
                  {calculateCartDiscount() > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>
                        Diskon Level ({activeMemberProfile.tier.name}{" "}
                        {activeMemberProfile.tier.discount_percent}%)
                      </span>
                      <span>
                        -IDR {Number(calculateCartDiscount()).toLocaleString("id-ID")}
                      </span>
                    </div>
                  )}
                  {appliedPromo && (
                    <div className="flex justify-between text-red-500">
                      <span className="flex items-center gap-1">
                        <LuTag className="w-3.5 h-3.5" /> Diskon Voucher ({appliedPromo.code})
                      </span>
                      <span>
                        -IDR {Number(calculatePromoDiscount()).toLocaleString("id-ID")}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between pt-1 text-sm font-extrabold text-slate-800">
                    <span>Total Pembayaran</span>
                    <span className="text-[#855C3B] font-black">
                      IDR {Number(calculateCartTotal()).toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div className="bg-emerald-50 text-emerald-700 px-3 py-2 rounded-xl border border-emerald-100/50 flex items-center justify-between mt-2.5 font-bold">
                    <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider">
                      <LuCoins className="w-4 h-4 text-emerald-600 animate-bounce" /> Poin Diperoleh
                      ({activeMemberProfile.tier.points_multiplier}x multiplier)
                    </span>
                    <span>+{calculateEstimatedPoints()} pts</span>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-[#855C3B] hover:bg-[#6d4734] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-[#855C3B]/20 cursor-pointer"
                >
                  <LuCircleCheck className="w-4.5 h-4.5" /> Konfirmasi Order
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* CHECKOUT SUCCESS MODAL */}
      {checkoutSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 text-center transform transition-all animate-[scaleIn_0.2s_ease-out] space-y-5">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto shadow-sm">
              <LuCircleCheck className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="font-black text-slate-800 text-lg">Pesanan Berhasil!</h3>
              <p className="text-xs text-slate-400 font-medium">
                Order ID:{" "}
                <span className="font-mono text-slate-700 font-bold">{checkoutSuccess.id}</span>
              </p>
            </div>
            <div className="bg-slate-50 rounded-2xl p-4 text-xs space-y-2 text-left border border-slate-100">
              <div className="flex justify-between font-medium">
                <span className="text-slate-400">Total Belanja:</span>
                <span className="text-slate-800 font-bold">
                  IDR {Number(checkoutSuccess.total).toLocaleString("id-ID")}
                </span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-slate-400">Pembayaran:</span>
                <span className="text-slate-800 font-bold">{checkoutSuccess.paymentMethod}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-200/60 font-bold text-emerald-600">
                <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider">
                  🎁 Bonus Loyalty Points:
                </span>
                <span>+{checkoutSuccess.points} pts</span>
              </div>
            </div>
            <button
              onClick={() => setCheckoutSuccess(null)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Tutup & Selesai
            </button>
          </div>
        </div>
      )}

      {/* NOTIFICATIONS DRAWER OVERLAY */}
      {isNotifOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white w-full max-w-sm h-full flex flex-col p-6 shadow-2xl animate-[slideLeft_0.3s_ease-out]">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <LuBell className="w-5 h-5 text-amber-600" />
                <h3 className="font-extrabold text-slate-800 text-base">Notifikasi Member</h3>
              </div>
              <button
                onClick={() => setIsNotifOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-slate-50 flex items-center justify-center font-bold text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <LuX className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 pr-1">
              {notifications.length === 0 ? (
                <div className="text-center py-16 text-xs text-slate-400 font-semibold">
                  Tidak ada pemberitahuan baru
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`py-4 transition-colors ${!n.is_read ? "bg-amber-50/10" : ""}`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-xs font-bold text-slate-800">{n.title}</span>
                      {!n.is_read && (
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5" />
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{n.message}</p>
                    <span className="text-[10px] text-slate-400 mt-2 block font-medium">
                      {new Date(n.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                      })}{" "}
                      {new Date(n.created_at).toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}