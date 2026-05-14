import { Link } from "react-router-dom";

export default function ErrorPage({ errorCode = "500", errorDescription = "Something went wrong.", errorImage }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-[fadeIn_0.5s_ease-out]">
      {errorImage && (
        <img src={errorImage} alt={`Error ${errorCode}`} className="w-64 h-auto rounded-2xl shadow-lg mb-8" />
      )}
      <h1 className="text-6xl font-bold text-[#2C1A0E] mb-2">{errorCode}</h1>
      <p className="text-gray-500 text-center max-w-md mb-8">{errorDescription}</p>
      <Link to="/dashboard" className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-full font-medium hover:shadow-lg hover:shadow-amber-200 transition-all duration-300">
        Back to Dashboard
      </Link>
    </div>
  );
}
