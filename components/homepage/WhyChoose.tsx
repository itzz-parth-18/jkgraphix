import {
  Truck,
  Palette,
  ShieldCheck,
  BadgeDollarSign,
} from "lucide-react";

const features = [
  {
    title: "Fast Delivery",
    description: "Quick production and reliable shipping for every order.",
    icon: Truck,
  },
  {
    title: "Premium Quality",
    description: "High-quality materials and professional finishing.",
    icon: ShieldCheck,
  },
  {
    title: "Affordable Pricing",
    description: "Competitive prices without compromising quality.",
    icon: BadgeDollarSign,
  },
  {
    title: "Professional Design",
    description: "Creative custom designs tailored to your needs.",
    icon: Palette,
  },
];

export default function WhyChoose() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-14 text-center">
          <h2 className="text-3xl font-bold text-[#1F1816]">
            Why Choose JK Graphix
          </h2>

          <p className="mt-3 text-[#6E625C]">
            Quality printing and custom designs you can trust.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="rounded-2xl border border-[#EFE8E2] bg-[#F9F6F2] p-6"
              >
                <div className="mb-5 inline-flex rounded-xl bg-[#EFE8E2] p-3">
                  <Icon className="h-6 w-6 text-[#1F1816]" />
                </div>

                <h3 className="mb-2 text-lg font-semibold text-[#1F1816]">
                  {feature.title}
                </h3>

                <p className="text-sm text-[#6E625C]">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}