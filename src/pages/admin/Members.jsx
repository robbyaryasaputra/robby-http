import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { PageHeader } from "../../components/section";
import { Avatar } from "../../components/media";
import { Table, Tooltip } from "../../components/data-display";
import { Breadcrumb } from "../../components/navigation";
import { SlideUp } from "../../components/animation";
import {
  LuRefreshCw,
  LuSearch,
  LuAward,
  LuCoins,
  LuUserX,
  LuHistory,
  LuPencil,
  LuLoader,
  LuCircleCheck,
  LuCircleAlert,
  LuUsers,
} from "react-icons/lu";

// Default Seed Tiers
const MEMBERSHIP_TIERS = [
  { id: 1, name: "Bronze", min_points: 0, points_multiplier: 1.0, discount_percent: 0.0, badge_color: "#CD7F32", text_color: "text-amber-700 bg-amber-50 border-amber-200" },
  { id: 2, name: "Silver", min_points: 500, points_multiplier: 1.5, discount_percent: 5.0, badge_color: "#C0C0C0", text_color: "text-slate-600 bg-slate-50 border-slate-200" },
  { id: 3, name: "Gold", min_points: 2000, points_multiplier: 2.0, discount_percent: 10.0, badge_color: "#FFD700", text_color: "text-yellow-700 bg-yellow-50 border-yellow-200" },
  { id: 4, name: "Platinum", min_points: 5000, points_multiplier: 3.0, discount_percent: 15.0, badge_color: "#E5E4E2", text_color: "text-purple-700 bg-purple-50 border-purple-200" },
];

const tierNameToId = {
  "Bronze": 1,
  "Silver": 2,
  "Gold": 3,
  "Platinum": 4
};

const tierNameMap = {
  1: "Bronze",
  2: "Silver",
  3: "Gold",
  4: "Platinum"
};

export default function Members() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dbMode, setDbMode] = useState("supabase"); // "supabase" or "local"
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [tierFilter, setTierFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // Transaction History Modal
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [transactionsLoading, setTransactionsLoading] = useState(false);

  // Adjust Points Modal
  const [adjustModalOpen, setAdjustModalOpen] = useState(false);
  const [adjustData, setAdjustData] = useState({
    points: 0,
    type: "adjust", // "adjust", "bonus", "redeem"
    description: "",
  });
  const [adjustLoading, setAdjustLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => setSuccessMsg(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  // Load and merge users & memberships
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch all registered users
      const { data: usersData, error: usersError } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false });

      if (usersError) throw usersError;

      // 2. Fetch memberships from Supabase
      let membershipsData = [];
      let mode = "supabase";

      const { data: mData, error: mError } = await supabase
        .from("members")
        .select("*");

      if (mError) {
        console.warn("Supabase members error. Falling back to local database mode:", mError.message);
        mode = "local";
        // Retrieve local memberships from localStorage or create new ones
        const localData = localStorage.getItem("local_memberships");
        if (localData) {
          membershipsData = JSON.parse(localData);
        }
      } else {
        membershipsData = mData || [];
      }

      setDbMode(mode);

      // 3. For each user, ensure a membership profile exists
      const mergedMembers = usersData.map((user) => {
        let membership = membershipsData.find((m) => (mode === "supabase" ? m.id === user.id : m.customer_id === user.id));

        if (!membership) {
          // Auto create a Bronze membership profile
          membership = {
            id: user.id,
            customer_id: user.id,
            tier: "Bronze",
            tier_id: 1, // Bronze
            member_code: `MBR-${String(Math.floor(Math.random() * 90000) + 10000)}`,
            total_points: 0,
            current_points: 0,
            join_date: new Date(user.created_at || Date.now()).toISOString().split("T")[0],
            status: "active",
            created_at: user.created_at || new Date().toISOString(),
          };

          // Save to local memberships array if in local mode
          if (mode === "local") {
            membershipsData.push(membership);
          }
        }

        const tierId = mode === "supabase" ? (tierNameToId[membership.tier] || 1) : (membership.tier_id || 1);
        const tier = MEMBERSHIP_TIERS.find((t) => t.id === tierId) || MEMBERSHIP_TIERS[0];

        return {
          ...user,
          membershipId: membership.id,
          member_code: membership.member_code,
          tier_id: tierId,
          tierName: tier.name,
          badgeColor: tier.badge_color,
          badgeClass: tier.text_color,
          total_points: membership.total_points,
          current_points: membership.current_points,
          join_date: membership.join_date,
          status: membership.status,
        };
      });

      if (mode === "local") {
        localStorage.setItem("local_memberships", JSON.stringify(membershipsData));
      }

      setMembers(mergedMembers);
    } catch (err) {
      console.error("Fetch members error:", err);
      setError("Gagal memuat data member. Silakan periksa koneksi atau database Anda.");
      
      // Load fallback completely from mock data
      setDbMode("local");
      loadMockDataFallback();
    } finally {
      setLoading(false);
    }
  };

  const loadMockDataFallback = () => {
    const localData = localStorage.getItem("local_memberships");
    const localUsers = localStorage.getItem("local_users") || "[]";
    let users = JSON.parse(localUsers);
    
    // Seed default users if empty
    if (users.length === 0) {
      users = [
        { id: "u-1", name: "Budi Santoso", email: "budi.santoso@gmail.com", created_at: "2026-05-10" },
        { id: "u-2", name: "Siti Rahayu", email: "siti.rahayu@yahoo.com", created_at: "2026-06-01" },
        { id: "u-3", name: "Ahmad Hidayat", email: "ahmad.hidayat@outlook.com", created_at: "2026-06-15" },
        { id: "u-4", name: "Dewi Lestari", email: "dewi.lestari@gmail.com", created_at: "2026-06-20" },
      ];
      localStorage.setItem("local_users", JSON.stringify(users));
    }

    let memberships = [];
    if (localData) {
      memberships = JSON.parse(localData);
    } else {
      memberships = [
        { id: "m-1", customer_id: "u-1", tier_id: 2, member_code: "MBR-00001", total_points: 650, current_points: 600, join_date: "2026-05-10", status: "active" },
        { id: "m-2", customer_id: "u-2", tier_id: 1, member_code: "MBR-00002", total_points: 120, current_points: 45, join_date: "2026-06-01", status: "active" },
        { id: "m-3", customer_id: "u-3", tier_id: 3, member_code: "MBR-00003", total_points: 2150, current_points: 1950, join_date: "2026-06-15", status: "active" },
        { id: "m-4", customer_id: "u-4", tier_id: 4, member_code: "MBR-00004", total_points: 5200, current_points: 4700, join_date: "2026-06-20", status: "suspended" },
      ];
      localStorage.setItem("local_memberships", JSON.stringify(memberships));
    }

    const merged = users.map((user) => {
      let membership = memberships.find((m) => m.customer_id === user.id) || {
        id: `m-${user.id}`, customer_id: user.id, tier_id: 1, member_code: `MBR-12345`, total_points: 0, current_points: 0, join_date: "2026-06-25", status: "active"
      };
      const tier = MEMBERSHIP_TIERS.find((t) => t.id === membership.tier_id) || MEMBERSHIP_TIERS[0];
      return {
        ...user,
        membershipId: membership.id,
        member_code: membership.member_code,
        tier_id: membership.tier_id,
        tierName: tier.name,
        badgeColor: tier.badge_color,
        badgeClass: tier.text_color,
        total_points: membership.total_points,
        current_points: membership.current_points,
        join_date: membership.join_date,
        status: membership.status,
      };
    });
    setMembers(merged);
  };

  // Fetch transaction history for a member
  const fetchTransactionHistory = async (member) => {
    setSelectedMember(member);
    setHistoryModalOpen(true);
    setTransactionsLoading(true);
    setTransactions([]);

    try {
      if (dbMode === "supabase" && member.membershipId) {
        const { data, error: txError } = await supabase
          .from("activity_logs")
          .select("*")
          .eq("user_id", member.id)
          .ilike("action", "POINTS_%")
          .order("created_at", { ascending: false });

        if (!txError && data) {
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
          setTransactionsLoading(false);
          return;
        }
      }

      // Fallback Local Storage
      const localTx = localStorage.getItem("local_point_transactions");
      let allTransactions = localTx ? JSON.parse(localTx) : [];
      
      // Filter for this customer membership
      const memberTx = allTransactions.filter((tx) => tx.membership_id === member.membershipId || tx.customer_id === member.id);
      
      // Seed default transactions if empty history for budget testing
      if (memberTx.length === 0) {
        const mockTx = [
          { id: "tx-1", membership_id: member.membershipId, type: "earn", points: 120, description: "Belanja Kopi & Pastry", created_at: new Date(Date.now() - 86400000 * 5).toISOString() },
        ];
        if (member.total_points > 120) {
          mockTx.push({ id: "tx-2", membership_id: member.membershipId, type: "bonus", points: member.total_points - 120, description: "Bonus Registrasi Member", created_at: new Date(Date.now() - 86400000 * 10).toISOString() });
        }
        if (member.total_points !== member.current_points) {
          mockTx.push({ id: "tx-3", membership_id: member.membershipId, type: "redeem", points: -(member.total_points - member.current_points), description: "Redeem Reward: Free Coffee", created_at: new Date(Date.now() - 86400000 * 2).toISOString() });
        }
        setTransactions(mockTx.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
      } else {
        setTransactions(memberTx.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
      }
    } catch (err) {
      console.error("Error loading transactions:", err);
    } finally {
      setTransactionsLoading(false);
    }
  };

  // Suspend/Activate membership status
  const handleToggleStatus = async (member) => {
    const newStatus = member.status === "active" ? "suspended" : "active";
    setError(null);
    try {
      if (dbMode === "supabase") {
        if (member.membershipId) {
          const { error: updateError } = await supabase
            .from("members")
            .update({ status: newStatus })
            .eq("id", member.membershipId);

          if (updateError) throw updateError;
        } else {
          // Auto create membership with status suspended/active
          const { error: insError } = await supabase
            .from("members")
            .insert({
              id: member.id,
              tier: "Bronze",
              member_code: `MBR-${String(Math.floor(Math.random() * 90000) + 10000)}`,
              total_points: 0,
              current_points: 0,
              status: newStatus,
            });

          if (insError) throw insError;
        }
      } else {
        // Local Mode
        const localData = localStorage.getItem("local_memberships");
        if (localData) {
          const memberships = JSON.parse(localData);
          const index = memberships.findIndex((m) => m.customer_id === member.id);
          if (index !== -1) {
            memberships[index].status = newStatus;
            localStorage.setItem("local_memberships", JSON.stringify(memberships));
          }
        }
      }

      setSuccessMsg(`Status membership ${member.name} berhasil diubah menjadi ${newStatus}!`);
      fetchData();
    } catch (err) {
      setError(err.message || "Gagal mengubah status member.");
    }
  };

  // Adjust points (positive or negative)
  const handleAdjustPointsSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMember) return;
    
    const changeAmount = parseInt(adjustData.points);
    if (isNaN(changeAmount) || changeAmount === 0) {
      setError("Masukkan jumlah poin yang valid (selain 0).");
      return;
    }

    setAdjustLoading(true);
    setError(null);

    try {
      const newCurrentPoints = Math.max(0, selectedMember.current_points + changeAmount);
      // Lifetime points only increase when earn or bonus, adjustments can reduce it too if negative
      const newTotalPoints = Math.max(0, selectedMember.total_points + (changeAmount > 0 ? changeAmount : 0));

      // Calculate new Tier based on new total points
      let newTierId = 1;
      if (newTotalPoints >= 5000) newTierId = 4;
      else if (newTotalPoints >= 2000) newTierId = 3;
      else if (newTotalPoints >= 500) newTierId = 2;

      const txDescription = adjustData.description || (changeAmount > 0 ? "Penyesuaian Poin oleh Admin" : "Pengurangan Poin oleh Admin");

      if (dbMode === "supabase") {
        // If membership does not have an ID yet (auto-creation flow)
        let membershipId = selectedMember.membershipId;

        if (!membershipId) {
          // Check if table supports inserting a new membership
          const { data: newMem, error: insError } = await supabase
            .from("members")
            .insert({
              id: selectedMember.id,
              tier: tierNameMap[newTierId] || 'Bronze',
              member_code: `MBR-${String(Math.floor(Math.random() * 90000) + 10000)}`,
              total_points: newTotalPoints,
              current_points: newCurrentPoints,
              status: "active",
            })
            .select()
            .single();

          if (insError) throw insError;
          membershipId = newMem.id;
        } else {
          // Update existing membership
          const { error: updError } = await supabase
            .from("members")
            .update({
              current_points: newCurrentPoints,
              total_points: newTotalPoints,
              tier: tierNameMap[newTierId] || 'Bronze',
            })
            .eq("id", membershipId);

          if (updError) throw updError;
        }

        // Insert point transaction
        const { error: txError } = await supabase
          .from("activity_logs")
          .insert({
            user_id: selectedMember.id,
            action: changeAmount > 0 ? "POINTS_BONUS" : "POINTS_REDEEM",
            entity_type: "members",
            entity_id: selectedMember.id,
            new_data: {
              delta: changeAmount,
              points: newCurrentPoints,
              total: newTotalPoints,
              description: txDescription
            }
          });

        if (txError) console.error("Could not write transaction log:", txError.message);

      } else {
        // Local database mode
        const localData = localStorage.getItem("local_memberships");
        let memberships = localData ? JSON.parse(localData) : [];
        let index = memberships.findIndex((m) => m.customer_id === selectedMember.id);

        let membershipId = selectedMember.membershipId;

        if (index === -1) {
          membershipId = `local-mem-${selectedMember.id}`;
          const newMem = {
            id: membershipId,
            customer_id: selectedMember.id,
            tier_id: newTierId,
            member_code: selectedMember.member_code || `MBR-${String(Math.floor(Math.random() * 90000) + 10000)}`,
            total_points: newTotalPoints,
            current_points: newCurrentPoints,
            join_date: new Date().toISOString().split("T")[0],
            status: "active",
          };
          memberships.push(newMem);
        } else {
          memberships[index].current_points = newCurrentPoints;
          memberships[index].total_points = newTotalPoints;
          memberships[index].tier_id = newTierId;
          membershipId = memberships[index].id;
        }
        localStorage.setItem("local_memberships", JSON.stringify(memberships));

        // Append to local transaction log
        const localTx = localStorage.getItem("local_point_transactions");
        const transactions = localTx ? JSON.parse(localTx) : [];
        transactions.push({
          id: `tx-${Date.now()}`,
          membership_id: membershipId,
          customer_id: selectedMember.id,
          type: changeAmount > 0 ? "bonus" : "redeem",
          points: changeAmount,
          description: txDescription,
          balance_after: newCurrentPoints,
          created_at: new Date().toISOString(),
        });
        localStorage.setItem("local_point_transactions", JSON.stringify(transactions));
      }

      setSuccessMsg(`Poin ${selectedMember.name} berhasil disesuaikan (${changeAmount > 0 ? "+" : ""}${changeAmount} Poin)!`);
      setAdjustModalOpen(false);
      setAdjustData({ points: 0, type: "adjust", description: "" });
      fetchData();
    } catch (err) {
      setError(err.message || "Gagal menyesuaikan poin member.");
    } finally {
      setAdjustLoading(false);
    }
  };

  // Helper date formatter
  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Filter members list
  const filteredMembers = members.filter((member) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      member.name?.toLowerCase().includes(query) ||
      member.email?.toLowerCase().includes(query) ||
      member.member_code?.toLowerCase().includes(query);

    const matchesTier = tierFilter === "All" || member.tierName === tierFilter;
    const matchesStatus = statusFilter === "All" || member.status === statusFilter;

    return matchesSearch && matchesTier && matchesStatus;
  });

  // Calculate statistics
  const totalMembersCount = members.length;
  const activeMembersCount = members.filter((m) => m.status === "active").length;
  const totalPointsCount = members.reduce((sum, m) => sum + (m.current_points || 0), 0);
  const bronzeCount = members.filter((m) => m.tierName === "Bronze").length;
  const silverCount = members.filter((m) => m.tierName === "Silver").length;
  const goldCount = members.filter((m) => m.tierName === "Gold").length;
  const platinumCount = members.filter((m) => m.tierName === "Platinum").length;

  return (
    <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: "Dashboard", to: "/dashboard" },
          { label: "Members" },
        ]}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader
          title="Members Monitoring"
          subtitle="Pantau status, poin, dan tingkatan (tier) membership pelanggan Anda"
        />
        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
            dbMode === "supabase" 
              ? "text-emerald-700 bg-emerald-50 border-emerald-200" 
              : "text-amber-700 bg-amber-50 border-amber-200"
          }`}>
            <span className={`w-2 h-2 rounded-full ${dbMode === "supabase" ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`}></span>
            {dbMode === "supabase" ? "Database Supabase Aktif" : "Mode Penyimpanan Lokal"}
          </span>
          <button
            onClick={fetchData}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all duration-200 cursor-pointer shadow-sm"
          >
            <LuRefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Notification Toast Messages */}
      {successMsg && (
        <div className="flex items-center gap-2 p-3 text-sm font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl animate-[fadeIn_0.3s_ease-out]">
          <LuCircleCheck className="w-5 h-5 text-emerald-500 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 p-3 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-xl animate-[fadeIn_0.3s_ease-out]">
          <LuCircleAlert className="w-5 h-5 text-red-500 shrink-0" />
          <span>{error}</span>
          <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600 font-bold">✕</button>
        </div>
      )}

      {/* Member Statistics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-[#855C3B]">
            <LuUsers className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Member</p>
            <h4 className="text-2xl font-bold text-slate-800">{totalMembersCount}</h4>
            <p className="text-xs text-slate-500 mt-0.5">{activeMembersCount} Akun Aktif</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <LuCoins className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Poin Beredar</p>
            <h4 className="text-2xl font-bold text-slate-800">{totalPointsCount} <span className="text-sm font-medium text-slate-400">pts</span></h4>
            <p className="text-xs text-slate-500 mt-0.5">Siap ditukarkan reward</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm lg:col-span-2 flex flex-col justify-center">
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">Penyebaran Level Member</p>
          <div className="grid grid-cols-4 gap-3 text-center">
            <div className="bg-amber-50/50 p-2 rounded-xl border border-amber-100">
              <span className="block text-xs font-bold text-amber-700">Bronze</span>
              <span className="text-lg font-bold text-slate-800">{bronzeCount}</span>
            </div>
            <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
              <span className="block text-xs font-bold text-slate-600">Silver</span>
              <span className="text-lg font-bold text-slate-800">{silverCount}</span>
            </div>
            <div className="bg-yellow-50 p-2 rounded-xl border border-yellow-200">
              <span className="block text-xs font-bold text-yellow-700">Gold</span>
              <span className="text-lg font-bold text-slate-800">{goldCount}</span>
            </div>
            <div className="bg-purple-50 p-2 rounded-xl border border-purple-100">
              <span className="block text-xs font-bold text-purple-700">Platinum</span>
              <span className="text-lg font-bold text-slate-800">{platinumCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Section */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <LuSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari member berdasarkan nama, email, atau kode member..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#855C3B] focus:ring-1 focus:ring-[#855C3B] transition-colors"
          />
        </div>

        {/* Tier Filter */}
        <div className="w-full md:w-48">
          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:border-[#855C3B] transition-colors"
          >
            <option value="All">Semua Level</option>
            <option value="Bronze">Bronze</option>
            <option value="Silver">Silver</option>
            <option value="Gold">Gold</option>
            <option value="Platinum">Platinum</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="w-full md:w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:border-[#855C3B] transition-colors"
          >
            <option value="All">Semua Status</option>
            <option value="active">Aktif</option>
            <option value="suspended">Ditangguhkan</option>
            <option value="expired">Kedaluwarsa</option>
          </select>
        </div>
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <LuLoader className="w-9 h-9 animate-spin text-[#855C3B] mb-3" />
          <p className="text-sm font-medium text-slate-500">Memuat data monitoring member...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredMembers.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4 border border-slate-100">
            <LuAward className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-700">Member Tidak Ditemukan</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-sm text-center">
            Tidak ada member terdaftar yang cocok dengan pencarian dan filter Anda saat ini.
          </p>
        </div>
      )}

      {/* Members Table */}
      {!loading && filteredMembers.length > 0 && (
        <SlideUp duration={0.4}>
          <Table
            columns={[
              { label: "Kode Member" },
              { label: "Pelanggan" },
              { label: "Level Member" },
              { label: "Poin Aktif" },
              { label: "Total Poin" },
              { label: "Tanggal Join" },
              { label: "Status" },
              { label: "Aksi", width: "120px" },
            ]}
            data={filteredMembers}
            renderRow={(member) => (
              <tr
                key={member.id}
                className="hover:bg-amber-50/15 border-b border-slate-100 transition-colors last:border-0"
              >
                {/* Member Code */}
                <td className="px-6 py-4 font-bold text-slate-800 text-xs tracking-wider">
                  {member.member_code}
                </td>

                {/* Avatar and Name */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar name={member.name} size="sm" />
                    <div>
                      <span className="font-bold text-slate-800 block text-sm">{member.name}</span>
                      <span className="text-xs text-slate-400 font-medium block">{member.email}</span>
                    </div>
                  </div>
                </td>

                {/* Tier Badge */}
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${member.badgeClass}`}>
                    <LuAward className="w-3.5 h-3.5" style={{ color: member.badgeColor }} />
                    {member.tierName}
                  </span>
                </td>

                {/* Current Points */}
                <td className="px-6 py-4 font-bold text-slate-800 text-sm">
                  {member.current_points} <span className="text-xs font-semibold text-slate-400">pts</span>
                </td>

                {/* Total Lifetime Points */}
                <td className="px-6 py-4 font-bold text-slate-500 text-sm">
                  {member.total_points} <span className="text-xs font-semibold text-slate-400">pts</span>
                </td>

                {/* Join Date */}
                <td className="px-6 py-4 text-xs font-semibold text-slate-500">
                  {formatDate(member.join_date)}
                </td>

                {/* Status Badge */}
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-2xs font-bold uppercase tracking-wider ${
                    member.status === "active"
                      ? "text-emerald-700 bg-emerald-50 border border-emerald-200"
                      : member.status === "suspended"
                      ? "text-red-700 bg-red-50 border border-red-200"
                      : "text-slate-500 bg-slate-50 border border-slate-200"
                  }`}>
                    {member.status === "active" ? "Aktif" : member.status === "suspended" ? "Suspen" : "Expired"}
                  </span>
                </td>

                {/* Action buttons */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 justify-end">
                    {/* View History */}
                    <button
                      onClick={() => fetchTransactionHistory(member)}
                      className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-all cursor-pointer"
                      title="Riwayat Poin"
                    >
                      <LuHistory className="w-4 h-4" />
                    </button>

                    {/* Adjust Points */}
                    <button
                      onClick={() => {
                        setSelectedMember(member);
                        setAdjustModalOpen(true);
                      }}
                      className="w-8 h-8 rounded-lg bg-amber-50 hover:bg-amber-100 flex items-center justify-center text-amber-700 transition-all cursor-pointer"
                      title="Sesuaikan Poin"
                    >
                      <LuPencil className="w-4 h-4" />
                    </button>

                    {/* Suspend or Activate Toggle */}
                    <button
                      onClick={() => handleToggleStatus(member)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                        member.status === "active"
                          ? "bg-red-50 hover:bg-red-100 text-red-600"
                          : "bg-emerald-50 hover:bg-emerald-100 text-emerald-600"
                      }`}
                      title={member.status === "active" ? "Tangguhkan Member" : "Aktifkan Member"}
                    >
                      {member.status === "active" ? <LuUserX className="w-4 h-4" /> : <LuCircleCheck className="w-4 h-4" />}
                    </button>
                  </div>
                </td>
              </tr>
            )}
          />
        </SlideUp>
      )}

      {/* ADJUST POINTS MODAL */}
      {adjustModalOpen && selectedMember && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 transform transition-all animate-[scaleIn_0.2s_ease-out]">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700">
                <LuCoins className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg">Sesuaikan Poin</h3>
                <p className="text-xs text-slate-400">Sesuaikan saldo poin member secara manual</p>
              </div>
              <button
                onClick={() => setAdjustModalOpen(false)}
                className="ml-auto w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAdjustPointsSubmit} className="space-y-4">
              {/* Member Info Snippet */}
              <div className="bg-slate-50 p-3 rounded-xl flex items-center gap-3">
                <Avatar name={selectedMember.name} size="sm" />
                <div>
                  <span className="font-bold text-slate-800 text-xs block">{selectedMember.name}</span>
                  <span className="text-3xs text-slate-400 block tracking-wider">{selectedMember.member_code} • Level: {selectedMember.tierName}</span>
                </div>
                <div className="ml-auto text-right">
                  <span className="text-2xs text-slate-400 uppercase font-semibold block">Poin Saat Ini</span>
                  <span className="font-extrabold text-sm text-[#855C3B]">{selectedMember.current_points} pts</span>
                </div>
              </div>

              {/* Poin Adjustment input */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Jumlah Penyesuaian Poin
                </label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    placeholder="Contoh: 100 untuk menambah, -50 untuk mengurangi"
                    value={adjustData.points === 0 ? "" : adjustData.points}
                    onChange={(e) => setAdjustData((prev) => ({ ...prev, points: parseInt(e.target.value) || 0 }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#855C3B]"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">pts</span>
                </div>
                <p className="text-3xs text-slate-400 mt-1">
                  Masukkan nilai positif untuk menambahkan poin bonus, atau nilai negatif untuk memotong poin.
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Keterangan / Alasan
                </label>
                <textarea
                  required
                  placeholder="Contoh: Bonus event spesial, Klaim manual, Kompensasi order terlambat"
                  rows="3"
                  value={adjustData.description}
                  onChange={(e) => setAdjustData((prev) => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#855C3B] resize-none"
                />
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setAdjustModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={adjustLoading}
                  className="flex-1 py-2.5 rounded-xl bg-[#855C3B] text-white text-sm font-semibold hover:bg-[#6d4734] transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-[#855C3B]/10 disabled:opacity-50"
                >
                  {adjustLoading ? <LuLoader className="w-4 h-4 animate-spin" /> : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TRANSACTION HISTORY MODAL */}
      {historyModalOpen && selectedMember && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 transform transition-all animate-[scaleIn_0.2s_ease-out] flex flex-col max-h-[85vh]">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-4">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
                <LuHistory className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg">Riwayat Transaksi Poin</h3>
                <p className="text-xs text-slate-400">Audit perolehan dan penukaran poin member</p>
              </div>
              <button
                onClick={() => setHistoryModalOpen(false)}
                className="ml-auto w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            {/* Member Card Header */}
            <div className="bg-slate-50 p-4 rounded-xl flex items-center gap-4 mb-4">
              <Avatar name={selectedMember.name} size="md" />
              <div>
                <h4 className="font-bold text-slate-800 text-sm">{selectedMember.name}</h4>
                <p className="text-xs text-slate-400">{selectedMember.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-3xs bg-white px-2 py-0.5 border border-slate-200 rounded font-semibold text-slate-500">
                    {selectedMember.member_code}
                  </span>
                  <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-3xs font-bold border ${selectedMember.badgeClass}`}>
                    <LuAward className="w-3 h-3" style={{ color: selectedMember.badgeColor }} />
                    {selectedMember.tierName}
                  </span>
                </div>
              </div>
              <div className="ml-auto text-right">
                <div className="bg-white py-1.5 px-3 rounded-lg border border-slate-200">
                  <span className="text-3xs text-slate-400 uppercase font-bold block">Poin Tersedia</span>
                  <span className="font-extrabold text-lg text-[#855C3B]">{selectedMember.current_points} pts</span>
                </div>
              </div>
            </div>

            {/* Transactions Table Area */}
            <div className="flex-1 overflow-y-auto min-h-[300px]">
              {transactionsLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <LuLoader className="w-8 h-8 animate-spin text-[#855C3B] mb-2" />
                  <p className="text-xs text-slate-500 font-semibold">Memuat riwayat transaksi...</p>
                </div>
              ) : transactions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 mb-2">
                    <LuCoins className="w-6 h-6 text-slate-300" />
                  </div>
                  <p className="text-xs text-slate-400 font-bold">Belum Ada Transaksi Poin</p>
                  <p className="text-3xs text-slate-400 mt-0.5">Member belum melakukan pembelanjaan atau penukaran poin.</p>
                </div>
              ) : (
                <div className="border border-slate-100 rounded-xl overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider text-3xs border-b border-slate-100">
                        <th className="px-4 py-3">Tanggal</th>
                        <th className="px-4 py-3">Jenis</th>
                        <th className="px-4 py-3">Transaksi Poin</th>
                        <th className="px-4 py-3">Deskripsi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
                      {transactions.map((tx) => {
                        const isPositive = tx.points > 0;
                        return (
                          <tr key={tx.id} className="hover:bg-slate-50/50">
                            <td className="px-4 py-3.5 whitespace-nowrap text-3xs text-slate-400">
                              {formatDate(tx.created_at)}
                            </td>
                            <td className="px-4 py-3.5 uppercase text-3xs tracking-wider">
                              <span className={`inline-flex px-1.5 py-0.5 rounded font-bold border ${
                                tx.type === "earn"
                                  ? "text-emerald-700 bg-emerald-50 border-emerald-100"
                                  : tx.type === "redeem"
                                  ? "text-red-700 bg-red-50 border-red-100"
                                  : "text-blue-700 bg-blue-50 border-blue-100"
                              }`}>
                                {tx.type === "earn" ? "Belanja" : tx.type === "redeem" ? "Tukar" : tx.type === "adjust" ? "Koreksi" : tx.type}
                              </span>
                            </td>
                            <td className={`px-4 py-3.5 font-bold text-sm ${isPositive ? "text-emerald-600" : "text-red-500"}`}>
                              {isPositive ? `+${tx.points}` : tx.points} <span className="text-3xs font-semibold text-slate-400">pts</span>
                            </td>
                            <td className="px-4 py-3.5 text-xs text-slate-600 break-words max-w-[200px]">
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

            <div className="border-t border-slate-100 pt-4 mt-4 flex justify-end">
              <button
                onClick={() => setHistoryModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition-all cursor-pointer"
              >
                Tutup Halaman
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
