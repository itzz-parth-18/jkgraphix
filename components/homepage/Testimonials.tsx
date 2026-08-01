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
    <section className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-14 text-center">
          <h2 className="text-3xl font-bold text-[#1F1816]">
            What Our Customers Say
          </h2>

          <p className="mt-3 text-[#6E625C]">
            A preview of customer feedback.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="rounded-2xl border border-[#EFE8E2] bg-[#F9F6F2] p-6"
            >
              <div className="mb-4 flex">
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    className="h-4 w-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              <p className="mb-6 text-sm leading-6 text-[#6E625C]">
                &ldquo;{testimonial.review}&rdquo;
              </p>

              <h3 className="font-semibold text-[#1F1816]">
                {testimonial.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}