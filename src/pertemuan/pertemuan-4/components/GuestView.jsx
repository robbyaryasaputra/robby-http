import RestaurantCard from "./RestaurantCard";

export default function GuestView({ restaurants }) {
  if (restaurants.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-400 text-lg">No restaurants found</p>
        <p className="text-gray-600 text-sm mt-1">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {restaurants.map((restaurant) => (
        <RestaurantCard key={restaurant.id} restaurant={restaurant} />
      ))}
    </div>
  );
}
