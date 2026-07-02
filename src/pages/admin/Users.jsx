import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { PageHeader } from "../../components/section";
import { Avatar } from "../../components/media";
import { Table, Tooltip } from "../../components/data-display";
import { Breadcrumb } from "../../components/navigation";
import { SlideUp } from "../../components/animation";
import { UserFormModal } from "../../components/auth";
import {
  LuPlus,
  LuPencil,
  LuTrash2,
  LuLoader,
  LuRefreshCw,
  LuUsers,
  LuCircleAlert,
  LuCircleCheck,
} from "react-icons/lu";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  // Delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch users from Supabase
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;
      setUsers(data || []);
    } catch (err) {
      setError(err.message || "Gagal memuat data user.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Auto-hide success message
  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => setSuccessMsg(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  // CREATE user
  const handleCreate = async (formData) => {
    setModalLoading(true);
    try {
      const { error: insertError } = await supabase.from("users").insert([
        {
          name: formData.name,
          email: formData.email,
          password: formData.password || "123456",
          role: formData.role || "customer",
          status: formData.status || "active",
        },
      ]);

      if (insertError) throw insertError;

      setSuccessMsg("User berhasil ditambahkan!");
      setModalOpen(false);
      fetchUsers();
    } catch (err) {
      setError(err.message || "Gagal menambahkan user.");
    } finally {
      setModalLoading(false);
    }
  };

  // UPDATE user
  const handleUpdate = async (formData) => {
    if (!editingUser) return;
    setModalLoading(true);
    try {
      const updateData = {
        name: formData.name,
        role: formData.role,
        status: formData.status,
      };
      // Hanya update password jika diisi
      if (formData.password) {
        updateData.password = formData.password;
      }

      const { error: updateError } = await supabase
        .from("users")
        .update(updateData)
        .eq("id", editingUser.id);

      if (updateError) throw updateError;

      setSuccessMsg("Data user berhasil diperbarui!");
      setModalOpen(false);
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      setError(err.message || "Gagal memperbarui data user.");
    } finally {
      setModalLoading(false);
    }
  };

  // DELETE user
  const handleDelete = async (userId) => {
    setDeleteLoading(true);
    try {
      const { error: deleteError } = await supabase
        .from("users")
        .delete()
        .eq("id", userId);

      if (deleteError) throw deleteError;

      setSuccessMsg("User berhasil dihapus!");
      setDeleteConfirm(null);
      fetchUsers();
    } catch (err) {
      setError(err.message || "Gagal menghapus user.");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Open modal for create
  const openCreateModal = () => {
    setEditingUser(null);
    setModalOpen(true);
  };

  // Open modal for edit
  const openEditModal = (user) => {
    setEditingUser(user);
    setModalOpen(true);
  };

  // Format date
  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: "Dashboard", to: "/dashboard" },
          { label: "Users" },
        ]}
      />

      <div className="flex items-center justify-between">
        <PageHeader
          title="Users"
          subtitle="Kelola data user yang terdaftar di sistem"
        />
        <div className="flex items-center gap-3">
          <button
            onClick={fetchUsers}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all duration-200 cursor-pointer"
          >
            <LuRefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#855C3B] text-white text-sm font-semibold hover:bg-[#6d4734] transition-all duration-200 shadow-lg shadow-[#855C3B]/20 cursor-pointer"
          >
            <LuPlus className="w-4 h-4" />
            Tambah User
          </button>
        </div>
      </div>

      {/* Success Message */}
      {successMsg && (
        <div className="flex items-center gap-2 p-3 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl animate-[fadeIn_0.3s_ease-out]">
          <LuCircleCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 p-3 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-xl animate-[fadeIn_0.3s_ease-out]">
          <LuCircleAlert className="w-4 h-4 text-red-500 shrink-0" />
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-400 hover:text-red-600 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <LuLoader className="w-8 h-8 animate-spin text-[#855C3B]" />
            <p className="text-sm text-slate-500 font-medium">Memuat data user...</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && users.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-4">
            <LuUsers className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-700">Belum ada user</h3>
          <p className="text-sm text-slate-500 mt-1">
            Klik tombol "Tambah User" untuk menambahkan user baru.
          </p>
        </div>
      )}

      {/* Users Table */}
      {!loading && users.length > 0 && (
        <SlideUp duration={0.4}>
          <Table
            columns={[
              { label: "User ID" },
              { label: "User" },
              { label: "Email" },
              { label: "Role" },
              { label: "Status" },
              { label: "Date Joined" },
              { label: "" },
            ]}
            data={users}
            renderRow={(user) => (
              <tr
                key={user.id}
                className="hover:bg-amber-50/20 transition-colors duration-200 border-b border-slate-50 last:border-0"
              >
                <td className="px-6 py-4 font-bold text-[#2C1A0E]">
                  USR-{user.id.substring(0, 8).toUpperCase()}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar name={user.name} size="sm" />
                    <span className="font-semibold text-slate-800">{user.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-600 font-medium">{user.email}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                    user.role === "admin"
                      ? "bg-rose-50 text-rose-700 border-rose-100"
                      : user.role === "cashier"
                      ? "bg-sky-50 text-sky-700 border-sky-100"
                      : "bg-amber-50 text-amber-800 border-amber-100/80"
                  }`}>
                    {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "Customer"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                    user.status === "active"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                      : user.status === "inactive"
                      ? "bg-slate-50 text-slate-600 border-slate-100"
                      : "bg-red-50 text-red-700 border-red-100"
                  }`}>
                    {user.status ? user.status.charAt(0).toUpperCase() + user.status.slice(1) : "Active"}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-400 text-xs font-semibold">
                  {formatDate(user.created_at)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => openEditModal(user)}
                      className="w-8 h-8 rounded-lg bg-amber-50 hover:bg-amber-100 flex items-center justify-center text-amber-600 transition-all duration-200 cursor-pointer"
                      title="Edit"
                    >
                      <LuPencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(user)}
                      className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-500 transition-all duration-200 cursor-pointer"
                      title="Hapus"
                    >
                      <LuTrash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            )}
          />
        </SlideUp>
      )}

      {/* User Form Modal (Create / Edit) */}
      <UserFormModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingUser(null);
        }}
        onSubmit={editingUser ? handleUpdate : handleCreate}
        initialData={editingUser}
        loading={modalLoading}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
            onClick={() => setDeleteConfirm(null)}
          />
          <div className="relative w-full max-w-sm mx-4 bg-white rounded-3xl shadow-2xl shadow-black/20 p-7 animate-[fadeIn_0.3s_ease-out]">
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-4">
                <LuTrash2 className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Hapus User?</h3>
              <p className="text-sm text-slate-500 mt-2">
                Anda yakin ingin menghapus{" "}
                <span className="font-semibold text-slate-700">
                  {deleteConfirm.name}
                </span>
                ? Tindakan ini tidak dapat dibatalkan.
              </p>
              <div className="flex items-center gap-3 mt-6 w-full">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-all duration-200 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm.id)}
                  disabled={deleteLoading}
                  className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-all duration-200 shadow-lg shadow-red-500/20 cursor-pointer disabled:opacity-60"
                >
                  {deleteLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <LuLoader className="w-4 h-4 animate-spin" />
                      Menghapus...
                    </span>
                  ) : (
                    "Ya, Hapus"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
