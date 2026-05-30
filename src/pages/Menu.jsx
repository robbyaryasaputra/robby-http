import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Badge, Button } from "../components/1-basic";
import { HeroSection, ProductSection } from "../components/6-section";
import { TabBar, Breadcrumb } from "../components/7-navigation";
import { RatingStars } from "../components/12-status";
import { Price, Paragraph, Caption } from "../components/14-typography";
import { FavoriteButton, FAB } from "../components/13-action";
import { Tooltip } from "../components/3-data-display";
import { Gallery } from "../components/11-media";
import { ModalOverlay } from "../components/10-overlay";
import { SlideUp } from "../components/15-animation";
import { LuShoppingCart } from "react-icons/lu";

const coffeeMenu = [
  {
    id: 1,
    name: "Americano",
    price: 3.75,
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop",
    category: "Hot",
    badge: "Popular",
    description: "Strong and bold espresso shots",
    reviews: 234,
  },
  {
    id: 2,
    name: "Mocha Delight",
    price: 5.0,
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1570968015861-ad48c34c1160?w=400&h=300&fit=crop",
    category: "Hot",
    badge: "Best Seller",
    description: "Rich chocolate and espresso blend",
    reviews: 456,
  },
  {
    id: 3,
    name: "Caramel Macchiato",
    price: 5.25,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=400&h=300&fit=crop",
    category: "Hot",
    badge: "Featured",
    description: "Sweet caramel with espresso",
    reviews: 389,
  },
  {
    id: 4,
    name: "Double Espresso",
    price: 4.0,
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400&h=300&fit=crop",
    category: "Hot",
    description: "Double shot of premium espresso",
    reviews: 278,
  },
  {
    id: 5,
    name: "Vanilla Latte",
    price: 4.75,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1541167760496-162955ed8a9f?w=400&h=300&fit=crop",
    category: "Hot",
    badge: "New",
    description: "Smooth vanilla-infused latte",
    reviews: 312,
  },
  {
    id: 6,
    name: "Iced Cappuccino",
    price: 4.5,
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=400&h=300&fit=crop",
    category: "Iced",
    description: "Refreshing iced cappuccino",
    reviews: 198,
  },
  {
    id: 7,
    name: "Flat White",
    price: 4.25,
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1459755486867-b55449bb39ff?w=400&h=300&fit=crop",
    category: "Hot",
    description: "Velvety smooth espresso and milk",
    reviews: 167,
  },
  {
    id: 8,
    name: "Irish Coffee",
    price: 5.75,
    rating: 4.4,
    image:
      "https://images.unsplash.com/photo-1521302080334-4bebac2763a6?w=400&h=300&fit=crop",
    category: "Special",
    badge: "Premium",
    description: "Classic Irish coffee blend",
    reviews: 89,
  },
  {
    id: 9,
    name: "Affogato",
    price: 5.5,
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1594631252845-29fc458631b6?w=400&h=300&fit=crop",
    category: "Special",
    description: "Espresso poured over ice cream",
    reviews: 212,
  },
];

const categories = ["All", "Hot", "Iced", "Special"];

const galleryImages = [
  { src: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop", alt: "Coffee shop", title: "Our Coffee Shop" },
  { src: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=400&h=400&fit=crop", alt: "Barista", title: "Expert Barista" },
  { src: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=400&fit=crop", alt: "Coffee beans", title: "Premium Beans" },
  { src: "https://images.unsplash.com/photo-1498804103079-a6351b050096?w=400&h=400&fit=crop", alt: "Latte art", title: "Latte Art" },
];

export default function Menu() {
  const { search } = useOutletContext();
  const [activeCategory, setActiveCategory] = useState("All");
  const [favorites, setFavorites] = useState([]);
  const [showGallery, setShowGallery] = useState(false);

  const filteredMenu = coffeeMenu.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory =
      activeCategory === "All" || item.category === activeCategory;
    return matchSearch && matchCategory;
  });

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id],
    );
  };

  return (
    <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: "Dashboard", to: "/dashboard" },
          { label: "Menu" },
        ]}
      />

      {/* Hero Card */}
      <HeroSection />

      {/* Coffee Shop Gallery */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-[#2C1A0E]">Our Gallery</h3>
            <Caption>A glimpse into our coffee world</Caption>
          </div>
          <Button variant="outline" size="sm" onClick={() => setShowGallery(true)}>
            View All
          </Button>
        </div>
        <Gallery images={galleryImages} cols={4} />
      </div>

      {/* Category Filter */}
      <TabBar
        tabs={categories}
        activeTab={activeCategory}
        onTabChange={setActiveCategory}
      />

      {/* Coffee Grid */}
      <ProductSection isEmpty={filteredMenu.length === 0}>
        {filteredMenu.map((coffee, index) => (
          <SlideUp
            key={coffee.id}
            duration={0.4}
            delay={index * 0.05}
          >
            <div
              className="group relative overflow-hidden rounded-[2rem] border border-[#EEE3D8] bg-white shadow-[0_20px_40px_rgba(34,20,14,0.06)] transition-all duration-500 hover:-translate-y-1"
            >
              <div className="relative h-64 overflow-hidden rounded-t-[2rem] bg-slate-100">
                <img
                  src={coffee.image}
                  alt={coffee.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                {coffee.badge && (
                  <div className="absolute top-4 left-4">
                    <Badge variant={coffee.badge}>{coffee.badge}</Badge>
                  </div>
                )}
                <div className="absolute top-4 right-4">
                  <FavoriteButton
                    isFavorite={favorites.includes(coffee.id)}
                    onClick={() => toggleFavorite(coffee.id)}
                  />
                </div>
              </div>

              <div className="p-6">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <Tooltip content={coffee.description}>
                    <h3 className="text-xl font-bold text-[#3F2A1E] cursor-help">{coffee.name}</h3>
                  </Tooltip>
                  <Price value={coffee.price} size="lg" />
                </div>
                <Paragraph className="mb-5">{coffee.description}</Paragraph>
                <div className="flex items-center justify-between gap-4">
                  <RatingStars rating={coffee.rating} size={14} />
                  <Caption>
                    {coffee.reviews} reviews
                  </Caption>
                </div>
                <Button
                  variant="primary"
                  fullWidth
                  rounded="full"
                  className="mt-6"
                  icon={LuShoppingCart}
                >
                  Add to cart
                </Button>
              </div>
            </div>
          </SlideUp>
        ))}
      </ProductSection>

      {/* Floating Action Button */}
      <FAB
        icon={LuShoppingCart}
        label="Cart"
        onClick={() => alert("Cart opened!")}
      />

      {/* Gallery Modal */}
      <ModalOverlay isOpen={showGallery} onClose={() => setShowGallery(false)}>
        <div className="bg-white rounded-2xl p-6 max-w-3xl w-full max-h-[80vh] overflow-y-auto shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-[#2C1A0E]">Coffee Shop Gallery</h3>
            <button onClick={() => setShowGallery(false)} className="text-gray-400 hover:text-gray-600 transition-colors">✕</button>
          </div>
          <Gallery images={galleryImages} cols={2} gap="gap-6" />
        </div>
      </ModalOverlay>
    </div>
  );
}
