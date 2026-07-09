import { useState } from "react";
import { LuPenLine, LuStar, LuMessageSquare } from "react-icons/lu";
import RatingStars from "../../../components/status/RatingStars";
import { SlideUp, FadeIn } from "../../../components/animation";

export default function ReviewSection({ reviews, onAddReview }) {
  const [newReview, setNewReview] = useState({
    name: "",
    category: "Pelayanan",
    rating: 5,
    comment: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newReview.name.trim() || !newReview.comment.trim()) {
      alert("Harap isi nama dan komentar ulasan Anda!");
      return;
    }

    onAddReview({
      name: newReview.name,
      category: newReview.category,
      rating: newReview.rating,
      comment: newReview.comment,
    });

    // Reset local form state
    setNewReview({
      name: "",
      category: "Pelayanan",
      rating: 5,
      comment: "",
    });
  };

  return (
    <section
      id="feedback"
      className="py-24 px-6 md:px-12 border-t border-[#ede8e1]"
      style={{ background: "#faf8f3" }}
    >
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-[#8b6f47]">
            Ulasan & Masukan Pelanggan
          </span>
          <h2 className="text-3xl md:text-4xl font-normal text-[#1a0f07]" style={{ fontFamily: "'Georgia', serif" }}>
            Bagikan Pengalaman Anda
          </h2>
          <p className="text-[#8a7868] text-sm">
            Pendapat Anda sangat berarti bagi kami untuk terus meningkatkan
            cita rasa kopi dan kenyamanan kedai.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Feedback Form */}
          <SlideUp
            delay={0.1}
            className="lg:col-span-5 bg-white rounded-2xl border border-[#ede8e1] p-6 md:p-8 space-y-6 shadow-sm text-left"
          >
            <h3 className="font-bold text-lg text-[#1a0f07] border-b border-[#ede8e1] pb-3 flex items-center gap-2" style={{ fontFamily: "'Georgia', serif" }}>
              <LuPenLine className="w-5 h-5 text-[#8b6f47]" />
              Tulis Ulasan
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Rating selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#8a7868] block">
                  NILAI PELAYANAN / PRODUK
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() =>
                        setNewReview({ ...newReview, rating: star })
                      }
                      className="focus:outline-none transition-transform hover:scale-110 active:scale-95 cursor-pointer border-0 bg-transparent"
                    >
                      <LuStar
                        className={`w-7 h-7 transition-colors ${
                          star <= newReview.rating
                            ? "text-amber-500 fill-amber-500"
                            : "text-gray-200 fill-transparent"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-gray-500 ml-2">
                    ({newReview.rating} dari 5)
                  </span>
                </div>
              </div>

              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#8a7868] block">
                  NAMA ANDA
                </label>
                <input
                  type="text"
                  required
                  placeholder="Masukkan nama Anda..."
                  value={newReview.name}
                  onChange={(e) =>
                    setNewReview({ ...newReview, name: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-[#faf8f3] border border-[#ede8e1] text-[#1a0f07] text-sm focus:outline-none focus:border-[#8b6f47]/50"
                />
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#8a7868] block">
                  KATEGORI ULASAN
                </label>
                <select
                  value={newReview.category}
                  onChange={(e) =>
                    setNewReview({ ...newReview, category: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-[#faf8f3] border border-[#ede8e1] text-[#1a0f07] text-sm focus:outline-none focus:border-[#8b6f47]/50 hover:cursor-pointer"
                >
                  <option value="Pelayanan">Pelayanan</option>
                  <option value="Rasa Menu">Rasa Menu</option>
                  <option value="Kebersihan">Kebersihan</option>
                  <option value="Suasana">Suasana</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              {/* Comment */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#8a7868] block">
                  ULASAN / SARAN
                </label>
                <textarea
                  rows="4"
                  required
                  placeholder="Tulis ulasan, kritik, atau saran Anda di sini..."
                  value={newReview.comment}
                  onChange={(e) =>
                    setNewReview({ ...newReview, comment: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-[#faf8f3] border border-[#ede8e1] text-[#1a0f07] text-sm focus:outline-none focus:border-[#8b6f47]/50 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl text-white font-bold text-sm transition-colors shadow-md active:scale-[0.98] cursor-pointer border-0"
                style={{
                  background: "#1a0f07",
                  boxShadow: "0 2px 8px rgba(26, 15, 7, 0.2)",
                }}
              >
                Kirim Ulasan
              </button>
            </form>
          </SlideUp>

          {/* Reviews List */}
          <SlideUp delay={0.2} className="lg:col-span-7 space-y-6 text-left">
            <div className="flex justify-between items-center border-b border-[#ede8e1] pb-3">
              <h3 className="font-bold text-lg text-[#1a0f07] flex items-center gap-2" style={{ fontFamily: "'Georgia', serif" }}>
                <LuMessageSquare className="w-5 h-5 text-[#8b6f47]" />
                Semua Ulasan ({reviews.length})
              </h3>
            </div>

            {/* Scrollable list container */}
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {reviews.length > 0 ? (
                reviews.map((rev) => (
                  <FadeIn key={rev.id} duration={0.3}>
                    <div className="bg-white rounded-2xl border border-[#ede8e1] p-5 space-y-3 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h4 className="font-bold text-[#1a0f07] text-sm" style={{ fontFamily: "'Georgia', serif" }}>
                            {rev.name}
                          </h4>
                          <span className="text-[10px] text-gray-400 font-semibold">
                            {rev.date}
                          </span>
                        </div>
                        <div className="flex flex-col items-end gap-1.5">
                          <span
                            className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold tracking-wide uppercase ${
                              rev.category === "Pelayanan"
                                ? "bg-blue-50 text-blue-700 border border-blue-100"
                                : rev.category === "Rasa Menu"
                                  ? "bg-amber-50 text-amber-800 border border-amber-100"
                                  : rev.category === "Kebersihan"
                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                    : rev.category === "Suasana"
                                      ? "bg-purple-50 text-purple-700 border border-purple-100"
                                      : "bg-gray-50 text-gray-600 border border-gray-100"
                            }`}
                          >
                            {rev.category}
                          </span>
                          <RatingStars rating={rev.rating} size={12} />
                        </div>
                      </div>
                      <p className="text-[#8a7868] text-xs leading-relaxed">
                        {rev.comment}
                      </p>
                    </div>
                  </FadeIn>
                ))
              ) : (
                <div className="bg-white rounded-2xl border border-[#ede8e1] p-12 text-center text-gray-500">
                  Belum ada ulasan. Jadilah yang pertama memberikan masukan!
                </div>
              )}
            </div>
          </SlideUp>
        </div>
      </div>
    </section>
  );
}
