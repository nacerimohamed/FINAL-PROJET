import React from "react";
import { useTranslation } from "react-i18next";
import { FaQuoteRight, FaStar, FaRegStar, FaLeaf } from "react-icons/fa";

const StarRating = ({ rating }) => {
  return (
    <div className="flex gap-0.5 text-amber-400">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className="text-sm">
          {star <= rating ? <FaStar /> : <FaRegStar className="text-gray-200" />}
        </span>
      ))}
    </div>
  );
};

const Testimonials = () => {
  const { t } = useTranslation();



  const testimonials = [
    {
      name: t("testimonials.review1Name"),
      location: t("testimonials.review1Location"),
      rating: 5,
      comment: t("testimonials.review1Comment"),
      avatar: "F",
      color: "from-emerald-500 to-teal-600",
    },
    {
      name: t("testimonials.review2Name"),
      location: t("testimonials.review2Location"),
      rating: 5,
      comment: t("testimonials.review2Comment"),
      avatar: "A",
      color: "from-emerald-600 to-green-700",
    },
    {
      name: t("testimonials.review3Name"),
      location: t("testimonials.review3Location"),
      rating: 4,
      comment: t("testimonials.review3Comment"),
      avatar: "K",
      color: "from-teal-500 to-emerald-600",
    },
    {
      name: t("testimonials.review4Name"),
      location: t("testimonials.review4Location"),
      rating: 5,
      comment: t("testimonials.review4Comment"),
      avatar: "S",
      color: "from-green-600 to-emerald-800",
    },
  ];

  return (
    <section className="py-20 lg:py-24 bg-green-50/10 relative overflow-hidden" id="testimonials">
      {/* Decorative Background Pattern */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-b from-emerald-50/60 to-transparent rounded-full opacity-70 -translate-y-1/2 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-100 mb-3">
            <FaLeaf className="text-[10px]" />
            {t("testimonials.badge")}
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-gray-800 tracking-tight mb-3">
            {t("testimonials.title")}
          </h2>
          <p className="text-gray-500 text-xs sm:text-sm max-w-xl mx-auto font-medium">
            {t("testimonials.subtitle")}
          </p>
          <div className="w-14 h-1 bg-emerald-500 mx-auto rounded-full mt-4" />
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-2xl p-5 shadow-sm border border-emerald-100/60 hover:shadow-xl hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between"
              style={{
                animation: `fadeUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${index * 40}ms both`
              }}
            >
              {/* Top Row: Stars & Quote Icon */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <StarRating rating={testimonial.rating} />
                  <FaQuoteRight className="text-emerald-100 group-hover:text-emerald-200 transition-colors text-lg" />
                </div>

                {/* Comment */}
                <p className="text-gray-600 text-xs leading-relaxed mb-6 italic">
                  "{testimonial.comment}"
                </p>
              </div>

              {/* Author Info Block */}
              <div className="flex items-center gap-3 pt-4 border-t border-emerald-50/60">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${testimonial.color} flex items-center justify-center text-white font-bold text-sm shadow-sm group-hover:scale-105 transition-transform`}
                >
                  {testimonial.avatar}
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-gray-800 text-xs truncate">{testimonial.name}</h4>
                  <p className="text-gray-400 text-[10px] font-semibold">{testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>



      </div>

      {/* Animation scope placeholder */}
      <style>{`
        @keyframes fadeUp { 
          from { opacity: 0; transform: translateY(10px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
      `}</style>
    </section>
  );
};

export default Testimonials;