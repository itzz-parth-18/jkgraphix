import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Rahul Sharma",
    review:
      "Excellent print quality and very fast delivery. Highly recommended.",
  },
  {
    name: "Priya Das",
    review:
      "The custom design came out exactly how I imagined. Great experience.",
  },
  {
    name: "Amit Kumar",
    review:
      "Affordable pricing with premium quality. Will definitely order again.",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-white px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 text-center sm:mb-12">
          <h2 className="text-2xl font-bold text-[#1F1816] sm:text-3xl">
            What Our Customers Say
          </h2>

          <p className="mt-2 text-sm text-[#6E625C] sm:mt-3">
            A preview of customer feedback.
          </p>
        </div>

        {/* Mobile: horizontal swipe | Desktop: 3 columns */}
        <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden] sm:gap-4 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:pb-0">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="w-[82%] shrink-0 snap-start rounded-2xl border border-[#EFE8E2] bg-[#F9F6F2] p-4 sm:w-[70%] sm:p-6 md:w-auto"
            >
              <div className="mb-3 flex sm:mb-4">
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    className="h-4 w-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              <p className="mb-5 text-sm leading-6 text-[#6E625C] sm:mb-6">
                &ldquo;{testimonial.review}&rdquo;
              </p>

              <h3 className="text-sm font-semibold text-[#1F1816] sm:text-base">
                {testimonial.name}
              </h3>
            </div>
          ))}
        </div>

        {/* Mobile swipe hint */}
        <p className="mt-3 text-center text-[11px] text-[#A3958E] md:hidden">
          Swipe to see more reviews →
        </p>
      </div>
    </section>
  );
}