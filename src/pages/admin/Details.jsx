import { useOutletContext } from "react-router-dom";
import { LuClock, LuFlame } from "react-icons/lu";
import { PageHeader } from "../../components/section";
import { RatingStars } from "../../components/status";
import { Price, Paragraph, Caption, Heading } from "../../components/typography";
import { Badge } from "../../components/basic";
import { Breadcrumb } from "../../components/navigation";
import { Tooltip } from "../../components/data-display";
import { ImageCard, Thumbnail } from "../../components/media";
import { Grid } from "../../components/layout";
import { SlideUp } from "../../components/animation";

const coffeeDetails = [
  { id: 1, name: "Americano", origin: "Brazil", roast: "Medium", price: 3.75, rating: 4.6, prepTime: "3 min", calories: 15, description: "A rich, full-bodied coffee made by diluting espresso with hot water.", image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefda?w=400&h=300&fit=crop" },
  { id: 2, name: "Mocha Delight", origin: "Colombia", roast: "Dark", price: 5.00, rating: 4.9, prepTime: "5 min", calories: 290, description: "A chocolate-flavored variant of a latte with espresso and steamed milk.", image: "https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=400&h=300&fit=crop" },
  { id: 3, name: "Caramel Macchiato", origin: "Ethiopia", roast: "Light", price: 5.25, rating: 4.8, prepTime: "4 min", calories: 250, description: "Freshly steamed milk with vanilla syrup, marked with espresso and caramel.", image: "https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=400&h=300&fit=crop" },
  { id: 4, name: "Double Espresso", origin: "Italy", roast: "Dark", price: 4.00, rating: 4.7, prepTime: "2 min", calories: 10, description: "Two shots of concentrated coffee brewed with high pressure.", image: "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=400&h=300&fit=crop" },
];

export default function Details() {
  const { search } = useOutletContext();

  const filtered = coffeeDetails.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: "Dashboard", to: "/dashboard" },
          { label: "Menu", to: "/dashboard/menu" },
          { label: "Coffee Details" },
        ]}
      />

      <PageHeader
        title="Coffee Details"
        subtitle="Explore detailed information about our coffees"
      />

      {/* Gallery Thumbnails */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2">
        {coffeeDetails.map((coffee) => (
          <Tooltip key={coffee.id} content={coffee.name}>
            <Thumbnail
              src={coffee.image}
              alt={coffee.name}
              size="lg"
              rounded="2xl"
              className="border-2 border-transparent hover:border-amber-400 transition-all duration-300 cursor-pointer"
            />
          </Tooltip>
        ))}
      </div>

      {/* Detail Cards */}
      <Grid cols={2} gap="md">
        {filtered.map((coffee, index) => (
          <SlideUp key={coffee.id} duration={0.4} delay={index * 0.08}>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-50 overflow-hidden flex flex-col sm:flex-row hover:shadow-md transition-all duration-300">
              <div className="sm:w-64 h-48 sm:h-auto overflow-hidden">
                <img src={coffee.image} alt={coffee.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="flex-1 p-6">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <Heading level={3} className="!text-xl">{coffee.name}</Heading>
                    <Caption className="mt-0.5">{coffee.origin} · {coffee.roast} Roast</Caption>
                  </div>
                  <Price value={coffee.price} size="lg" />
                </div>
                <Paragraph className="mb-4">{coffee.description}</Paragraph>
                <div className="flex flex-wrap gap-3 items-center">
                  <RatingStars rating={coffee.rating} />
                  <Tooltip content="Preparation time">
                    <span className="flex items-center gap-1.5 text-sm text-gray-500 font-semibold cursor-help">
                      <LuClock className="w-4 h-4 text-blue-500" /> {coffee.prepTime}
                    </span>
                  </Tooltip>
                  <Tooltip content="Calories per serving">
                    <span className="flex items-center gap-1.5 text-sm text-gray-500 font-semibold cursor-help">
                      <LuFlame className="w-4 h-4 text-red-400" /> {coffee.calories} cal
                    </span>
                  </Tooltip>
                  <Badge variant={coffee.roast === "Dark" ? "Premium" : "New"}>
                    {coffee.roast} Roast
                  </Badge>
                </div>
              </div>
            </div>
          </SlideUp>
        ))}
      </Grid>
    </div>
  );
}
