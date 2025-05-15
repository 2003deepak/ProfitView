import { motion } from "framer-motion";
import { Star } from "lucide-react";
import themeStore from "../store/themeStore";

export default function TestimonialSection() {
  const { theme } = themeStore();
  const isDark = theme === "dark";

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Retail Investor",
      image: "/placeholder.svg?height=80&width=80",
      content:
        "Profit View helped me gain confidence in my trading decisions. The paper trading feature allowed me to test strategies without risking my savings.",
      stars: 5,
    },
    {
      name: "Michael Chen",
      role: "Finance Student",
      image: "/placeholder.svg?height=80&width=80",
      content:
        "As a finance student, this platform has been invaluable for applying theoretical knowledge in a practical setting. The real-time data is excellent.",
      stars: 5,
    },
    {
      name: "David Rodriguez",
      role: "Day Trader",
      image: "/placeholder.svg?height=80&width=80",
      content:
        "The backtesting feature is a game-changer. I've refined my trading strategy significantly since using Profit View.",
      stars: 4,
    },
  ];

  return (
    <section className={`py-20 px-4 ${isDark ? "bg-gray-900" : "bg-[#F1F5F9]"}`}>
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className={`text-3xl md:text-4xl font-bold mb-4 ${
              isDark ? "text-white" : "text-[#1E293B]"
            }`}
          >
            What our users are saying
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`text-lg max-w-2xl mx-auto ${
              isDark ? "text-gray-300" : "text-[#64748B]"
            }`}
          >
            Join thousands of traders who have improved their skills with Profit View
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`p-6 rounded-xl shadow-sm ${
                isDark ? "bg-gray-800 text-white" : "bg-white text-[#1E293B]"
              }`}
            >
              <div className="flex items-center mb-4">
                <img
                  src={testimonial.image || "/placeholder.svg"}
                  alt={testimonial.name}
                  width={50}
                  height={50}
                  className="rounded-full"
                />
                <div className="ml-4">
                  <h3 className={`font-semibold ${isDark ? "text-white" : "text-[#1E293B]"}`}>
                    {testimonial.name}
                  </h3>
                  <p className={`text-sm ${isDark ? "text-gray-400" : "text-[#64748B]"}`}>
                    {testimonial.role}
                  </p>
                </div>
              </div>

              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < testimonial.stars
                        ? "text-yellow-400 fill-yellow-400"
                        : isDark
                        ? "text-gray-600"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>

              <p className={isDark ? "text-gray-100" : "text-[#1E293B]"}>
                "{testimonial.content}"
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
