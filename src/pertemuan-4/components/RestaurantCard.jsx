export default function RestaurantCard({ restaurant }) {
  const {
    name,
    category,
    rating,
    priceRange,
    image,
    description,
    isOpen,
    established,
    location,
    contact,
    operationalHours,
  } = restaurant;

  return (
    <div className="group relative bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20 hover:border-purple-500/30">
      {/* Image Section */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm ${
              isOpen
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30"
                : "bg-red-500/20 text-red-300 border border-red-400/30"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isOpen ? "bg-emerald-400 animate-pulse" : "bg-red-400"
              }`}
            />
            {isOpen ? "Open" : "Closed"}
          </span>
        </div>

        {/* Rating Badge */}
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30 backdrop-blur-sm">
            <svg className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {rating}
          </span>
        </div>

        {/* Category & Price */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/30 text-purple-200 border border-purple-400/20 backdrop-blur-sm">
            {category}
          </span>
          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-white/10 text-white/80 backdrop-blur-sm">
            {priceRange}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 space-y-4">
        {/* Title & Description */}
        <div>
          <h3 className="text-xl font-bold text-white mb-1 group-hover:text-purple-300 transition-colors">
            {name}
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">
            {description}
          </p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 gap-3">
          {/* Location */}
          <div className="flex items-start gap-2.5 text-sm">
            <svg className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <div>
              <p className="text-gray-300">{location.address}</p>
              <p className="text-gray-500 text-xs">{location.district}, {location.city}</p>
            </div>
          </div>

          {/* Contact */}
          <div className="flex items-center gap-2.5 text-sm">
            <svg className="w-4 h-4 text-purple-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span className="text-gray-300">{contact.phone}</span>
          </div>

          {/* Hours */}
          <div className="flex items-start gap-2.5 text-sm">
            <svg className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-gray-300">Weekday: {operationalHours.weekday}</p>
              <p className="text-gray-500 text-xs">Weekend: {operationalHours.weekend}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between">
          <span className="text-xs text-gray-500">Est. {established}</span>
          <a
            href={contact.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors"
          >
            Visit Website
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
