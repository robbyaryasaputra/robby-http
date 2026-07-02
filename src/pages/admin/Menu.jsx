import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Badge, Button } from "../../components/basic";
import { HeroSection, ProductSection } from "../../components/section";
import { TabBar, Breadcrumb } from "../../components/navigation";
import { RatingStars } from "../../components/status";
import { Price, Paragraph, Caption } from "../../components/typography";
import { FavoriteButton, FAB } from "../../components/action";
import { Tooltip } from "../../components/data-display";
import { Gallery } from "../../components/media";
import { ModalOverlay } from "../../components/overlay";
import { SlideUp } from "../../components/animation";
import { LuShoppingCart, LuPlus, LuPencil, LuTrash2, LuCircleCheck, LuCircleAlert, LuLoader } from "react-icons/lu";

import { useEffect } from "react";
import db, {
  getMenuItems,
  getCategories,
  toggleFavorite as toggleFav,
} from "../../lib/db";
import { supabase } from "../../lib/supabase";
import { MenuFormModal } from "../../components/auth";
import { Alert } from "../../components/feedback";
import { useAuth } from "../../contexts/AuthContext";

const categories = ["All", "Hot", "Iced", "Special"];

const galleryImages = [
  {
    src: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop",
    alt: "Coffee shop",
    title: "Our Coffee Shop",
  },
  {
    src: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=400&h=400&fit=crop",
    alt: "Barista",
    title: "Expert Barista",
  },
  {
    src: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=400&fit=crop",
    alt: "Coffee beans",
    title: "Premium Beans",
  },
  {
    src: "https://images.unsplash.com/photo-1498804103079-a6351b050096?w=400&h=400&fit=crop",
    alt: "Latte art",
    title: "Latte Art",
  },
];

export default function Menu() {
  const { search } = useOutletContext();
  const { profile } = useAuth();
  const [activeCategory, setActiveCategory] = useState("All");
  const [favorites, setFavorites] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [categoryList, setCategoryList] = useState(categories);
  const [dbCategories, setDbCategories] = useState([]);
  const [userId, setUserId] = useState(null);
  const [showGallery, setShowGallery] = useState(false);

  // CRUD States
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteConfirmItem, setDeleteConfirmItem] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState(null);

  const filteredMenu = menuItems.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory =
      activeCategory === "All" || item.category === activeCategory;
    return matchSearch && matchCategory;
  });

  const handleToggleFavorite = async (menuItemId) => {
    if (!userId) return alert("Please sign in to favorite items");
    const res = await toggleFav(userId, menuItemId);
    if (res.error) return console.error(res.error);
    // refetch favorites
    const { data } = await supabase
      .from("favorites")
      .select("menu_item_id")
      .eq("customer_id", userId);
    setFavorites((data || []).map((r) => r.menu_item_id));
  };

  const fetchMenuAndCategories = async () => {
    try {
      // fetch menu items
      const { data: itemsData, error: itemsErr } = await getMenuItems({
        limit: 100,
      });
      if (!itemsErr) setMenuItems(itemsData || []);

      // fetch categories
      const { data: catsData } = await getCategories();
      if (catsData) {
        setDbCategories(catsData);
        setCategoryList(["All", ...catsData.map((c) => c.name)]);
      }

      // fetch favorites
      if (profile) {
        setUserId(profile.id);
        const { data: favs } = await supabase
          .from("favorites")
          .select("menu_item_id")
          .eq("customer_id", profile.id);
        setFavorites((favs || []).map((r) => r.menu_item_id));
      }
    } catch (e) {
      console.error("Gagal memuat data menu:", e);
    }
  };

  useEffect(() => {
    fetchMenuAndCategories();
  }, [profile]);

  // Auto-hide success message
  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => setSuccessMsg(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  // CREATE MenuItem
  const handleCreateMenuItem = async (formData) => {
    setModalLoading(true);
    setErrorMsg(null);
    try {
      // Generate slug from name
      const slug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

      const { error } = await supabase
        .from("menu_items")
        .insert({
          name: formData.name,
          slug: slug,
          category_id: formData.category_id,
          price: formData.price,
          image_url: formData.image_url,
          badge: formData.badge || null,
          description: formData.description || "",
          is_available: formData.is_available,
          rating: 0.0,
          review_count: 0
        });

      if (error) throw error;

      setSuccessMsg("Menu baru berhasil ditambahkan!");
      setFormOpen(false);
      fetchMenuAndCategories();
    } catch (err) {
      setErrorMsg(err.message || "Gagal menambahkan menu baru.");
    } finally {
      setModalLoading(false);
    }
  };

  // UPDATE MenuItem
  const handleUpdateMenuItem = async (formData) => {
    if (!editingItem) return;
    setModalLoading(true);
    setErrorMsg(null);
    try {
      const slug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

      const { error } = await supabase
        .from("menu_items")
        .update({
          name: formData.name,
          slug: slug,
          category_id: formData.category_id,
          price: formData.price,
          image_url: formData.image_url,
          badge: formData.badge || null,
          description: formData.description || "",
          is_available: formData.is_available,
        })
        .eq("id", editingItem.id);

      if (error) throw error;

      setSuccessMsg("Menu berhasil diperbarui!");
      setFormOpen(false);
      setEditingItem(null);
      fetchMenuAndCategories();
    } catch (err) {
      setErrorMsg(err.message || "Gagal memperbarui menu.");
    } finally {
      setModalLoading(false);
    }
  };

  // DELETE MenuItem
  const handleDeleteMenuItem = async (menuItemId) => {
    setDeleteLoading(true);
    setErrorMsg(null);
    try {
      const { error } = await supabase
        .from("menu_items")
        .delete()
        .eq("id", menuItemId);

      if (error) throw error;

      setSuccessMsg("Menu berhasil dihapus!");
      setDeleteConfirmItem(null);
      fetchMenuAndCategories();
    } catch (err) {
      setErrorMsg(err.message || "Gagal menghapus menu.");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[{ label: "Dashboard", to: "/dashboard" }, { label: "Menu" }]}
      />

      {/* Hero Card */}
      <HeroSection />

      {/* Success/Error Alerts */}
      {successMsg && (
        <Alert variant="success" dismissible onDismiss={() => setSuccessMsg("")}>
          {successMsg}
        </Alert>
      )}
      {errorMsg && (
        <Alert variant="error" dismissible onDismiss={() => setErrorMsg(null)}>
          {errorMsg}
        </Alert>
      )}

      {/* Coffee Shop Gallery */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-[#2C1A0E]">Our Gallery</h3>
            <Caption>A glimpse into our coffee world</Caption>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowGallery(true)}
          >
            View All
          </Button>
        </div>
        <Gallery images={galleryImages} cols={4} />
      </div>

      {/* Category Filter and Add Menu Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <TabBar
          tabs={categoryList}
          activeTab={activeCategory}
          onTabChange={setActiveCategory}
          className="flex-1"
        />
        <Button
          variant="primary"
          icon={LuPlus}
          onClick={() => {
            setEditingItem(null);
            setFormOpen(true);
          }}
          className="shrink-0 rounded-xl px-5 py-2.5 font-bold"
        >
          Tambah Menu
        </Button>
      </div>

      {/* Coffee Grid */}
      <ProductSection isEmpty={filteredMenu.length === 0}>
        {filteredMenu.map((coffee, index) => (
          <SlideUp key={coffee.id} duration={0.4} delay={index * 0.05}>
            <div className={`group relative overflow-hidden rounded-[2rem] border border-[#EEE3D8] bg-white shadow-[0_20px_40px_rgba(34,20,14,0.06)] transition-all duration-500 hover:-translate-y-1 ${!coffee.is_available ? "opacity-90" : ""}`}>
              <div className="relative h-64 overflow-hidden rounded-t-[2rem] bg-slate-100">
                <img
                  src={coffee.image}
                  alt={coffee.name}
                  className={`h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 ${!coffee.is_available ? "grayscale-[40%]" : ""}`}
                  onError={(e) => {
                    e.target.src =
                      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                {coffee.is_available === false ? (
                  <div className="absolute top-4 left-4">
                    <Badge variant="best-seller">Kosong</Badge>
                  </div>
                ) : (
                  coffee.badge && (
                    <div className="absolute top-4 left-4">
                      <Badge variant={coffee.badge}>{coffee.badge}</Badge>
                    </div>
                  )
                )}
                <div className="absolute top-4 right-4">
                  <FavoriteButton
                    isFavorite={favorites.includes(coffee.id)}
                    onClick={() => handleToggleFavorite(coffee.id)}
                  />
                </div>
              </div>

              <div className="p-6">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <Tooltip content={coffee.description}>
                    <h3 className="text-xl font-bold text-[#3F2A1E] cursor-help">
                      {coffee.name}
                    </h3>
                  </Tooltip>
                  <Price value={coffee.price} size="lg" />
                </div>
                <Paragraph className="mb-5 line-clamp-2 h-10">{coffee.description}</Paragraph>
                <div className="flex items-center justify-between gap-4">
                  <RatingStars rating={coffee.rating} size={14} />
                  <Caption>{coffee.reviews} reviews</Caption>
                </div>

                {/* Admin Actions */}
                <div className="mt-6 flex items-center gap-3">
                  <Button
                    variant="secondary"
                    className="flex-1 rounded-xl font-bold py-2"
                    icon={LuPencil}
                    onClick={() => {
                      setEditingItem(coffee);
                      setFormOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    className="flex-1 rounded-xl font-bold py-2"
                    icon={LuTrash2}
                    onClick={() => {
                      setDeleteConfirmItem(coffee);
                    }}
                  >
                    Hapus
                  </Button>
                </div>
              </div>
            </div>
          </SlideUp>
        ))}
      </ProductSection>

      {/* Floating Action Button */}
      <FAB
        icon={LuPlus}
        label="Tambah Menu"
        onClick={() => {
          setEditingItem(null);
          setFormOpen(true);
        }}
      />

      {/* Gallery Modal */}
      <ModalOverlay isOpen={showGallery} onClose={() => setShowGallery(false)}>
        <div className="bg-white rounded-2xl p-6 max-w-3xl w-full max-h-[80vh] overflow-y-auto shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-[#2C1A0E]">
              Coffee Shop Gallery
            </h3>
            <button
              onClick={() => setShowGallery(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          </div>
          <Gallery images={galleryImages} cols={2} gap="gap-6" />
        </div>
      </ModalOverlay>

      {/* Menu Form Modal */}
      <MenuFormModal
        isOpen={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingItem(null);
        }}
        onSubmit={editingItem ? handleUpdateMenuItem : handleCreateMenuItem}
        categories={dbCategories}
        initialData={editingItem}
        loading={modalLoading}
      />

      {/* Delete Confirmation Modal */}
      <ModalOverlay
        isOpen={!!deleteConfirmItem}
        onClose={() => setDeleteConfirmItem(null)}
      >
        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-[fadeIn_0.2s_ease-out] border border-slate-100 text-left">
          <div className="flex items-center gap-4 text-red-500 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-500">
              <LuTrash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">Hapus Menu Kopi</h3>
              <p className="text-xs text-slate-500">Tindakan ini tidak dapat dibatalkan</p>
            </div>
          </div>
          <p className="text-sm text-slate-600 mb-6">
            Apakah Anda yakin ingin menghapus menu <strong className="text-slate-800">"{deleteConfirmItem?.name}"</strong>? Item ini akan dihapus secara permanen dari database.
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setDeleteConfirmItem(null)}
              className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-all cursor-pointer text-center"
              disabled={deleteLoading}
            >
              Batal
            </button>
            <Button
              variant="danger"
              className="flex-1 py-3 rounded-xl font-semibold text-sm transition-all"
              onClick={() => handleDeleteMenuItem(deleteConfirmItem.id)}
              loading={deleteLoading}
            >
              Hapus Permanen
            </Button>
          </div>
        </div>
      </ModalOverlay>
    </div>
  );
}
