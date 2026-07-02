import RestaurantTable from "./RestaurantTable";

export default function AdminView({ restaurants }) {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-gray-400 text-sm">
          Showing <span className="text-purple-300 font-semibold">{restaurants.length}</span> restaurants
        </p>
      </div>
      <RestaurantTable restaurants={restaurants} />
    </div>
  );
}
