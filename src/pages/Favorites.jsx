import { useState } from "react";
import { Link } from "react-router-dom";
import { LuHeart, LuTrash2, LuShoppingCart, LuDownload } from "react-icons/lu";
import { Button, Badge } from "../components/1-basic";
import { PageHeader } from "../components/6-section";
import { EmptyState } from "../components/5-feedback";
import { RatingStars } from "../components/12-status";
import { Price, Paragraph, Caption, Heading } from "../components/14-typography";
import { FavoriteButton, IconButton, ActionGroup } from "../components/13-action";
import { Breadcrumb } from "../components/7-navigation";
import { Grid } from "../components/2-layout";
import { Tooltip } from "../components/3-data-display";
import { SlideUp } from "../components/15-animation";

const favoriteCoffees = [
  {
    id: 1,
    name: "Caramel Macchiato",
    price: 5.25,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=400&h=300&fit=crop",
    category: "Hot",
    addedAt: "2 days ago",
    description: "Sweet caramel with espresso",
  },
  {
    id: 2,
    name: "Mocha Delight",
    price: 5.0,
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1570968015861-ad48c34c1160?w=400&h=300&fit=crop",
    category: "Hot",
    addedAt: "5 days ago",
    description: "Rich chocolate and espresso blend",
  },
  {
    id: 5,
    name: "Vanilla Latte",
    price: 4.75,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1541167760496-162955ed8a9f?w=400&h=300&fit=crop",
    category: "Hot",
    addedAt: "1 week ago",
    description: "Smooth vanilla-infused latte",
  },
  {
    id: 6,
    name: "Iced Cappuccino",
    price: 4.5,
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=400&h=300&fit=crop",
    category: "Iced",
    addedAt: "3 days ago",
    description: "Refreshing iced cappuccino",
  },
];

export default function Favorites() {
  const [favorites, setFavorites] = useState(favoriteCoffees);

  const removeFavorite = (id) => {
    setFavorites(favorites.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: "Dashboard", to: "/dashboard" },
          { label: "Favorites" },
        ]}
      />

      {/* Header with Stats */}
      <PageHeader
        title="Favorites"
        subtitle={`${favorites.length} favorite coffee ${favorites.length === 1 ? "item" : "items"} saved`}
        action={
          favorites.length > 0 && (
            <Button
              variant="primary"
              icon={LuDownload}
              className="w-full sm:w-auto"
            >
              Export List
            </Button>
          )
        }
      />

      {favorites.length > 0 ? (
        <Grid cols={3} gap="lg">
          {favorites.map((coffee, index) => (
            <SlideUp key={coffee.id} duration={0.4} delay={index * 0.05}>
              <div
                className="group bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-amber-200"
              >
                {/* Image Container */}
                <div className="relative h-56 overflow-hidden bg-gray-100">
                  <img
                    src={coffee.image}
                    alt={coffee.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop";
                    }}
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>

                  {/* Category Badge */}
                  <div className="absolute top-3 right-3">
                    <Badge variant={coffee.category === "Iced" ? "New" : "Popular"}>
                      {coffee.category}
                    </Badge>
                  </div>

                  {/* Heart Icon */}
                  <div className="absolute top-3 left-3">
                    <FavoriteButton isFavorite={true} disabled />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col">
                  {/* Title */}
                  <Heading level={3} className="!text-lg group-hover:!text-[#8B5F3C] transition-colors mb-2">
                    {coffee.name}
                  </Heading>

                  {/* Rating & Meta */}
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-50 flex-wrap">
                    <RatingStars rating={coffee.rating} size={14} />
                    <span className="text-xs text-gray-300">•</span>
                    <Tooltip content={`Added to favorites ${coffee.addedAt}`}>
                      <Caption className="cursor-help">
                        Saved {coffee.addedAt}
                      </Caption>
                    </Tooltip>
                  </div>

                  {/* Description */}
                  <Paragraph className="mb-4 flex-1">
                    {coffee.description || "Premium quality coffee item"}
                  </Paragraph>

                  {/* Footer - Price & Actions */}
                  <div className="flex items-center justify-between gap-3 pt-4 border-t border-gray-50">
                    <div className="flex flex-col">
                      <Caption>Price</Caption>
                      <Price value={coffee.price} size="lg" />
                    </div>
                    <ActionGroup>
                      <Button
                        variant="primary"
                        size="sm"
                        icon={LuShoppingCart}
                        rounded="lg"
                      >
                        Buy
                      </Button>
                      <Tooltip content="Remove from favorites">
                        <IconButton
                          variant="danger"
                          size="sm"
                          icon={LuTrash2}
                          onClick={() => removeFavorite(coffee.id)}
                          title="Remove from favorites"
                          className="bg-red-50 hover:bg-red-100 hover:text-red-600 rounded-lg p-2.5"
                        />
                      </Tooltip>
                    </ActionGroup>
                  </div>
                </div>
              </div>
            </SlideUp>
          ))}
        </Grid>
      ) : (
        <EmptyState
          icon={LuHeart}
          title="No Favorites Yet"
          description="Add coffee items to your favorites by clicking the heart icon on the Menu page. Your favorite items will appear here."
          action={
            <Link to="/dashboard/menu">
              <Button variant="primary" icon={LuShoppingCart}>
                Browse Menu
              </Button>
            </Link>
          }
        />
      )}
    </div>
  );
}
