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
    <section className="bg-white px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 text-center sm:mb-12">
          <h2 className="text-2xl font-bold text-[#1F1816] sm:text-3xl">
            Why Choose JK Graphix
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#6E625C] sm:mt-3">
            Quality printing and custom designs you can trust.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="rounded-2xl border border-[#EFE8E2] bg-[#F9F6F2] p-4 sm:p-6"
              >
                <div className="mb-3 inline-flex rounded-xl bg-[#EFE8E2] p-2.5 sm:mb-5 sm:p-3">
                  <Icon className="h-5 w-5 text-[#1F1816] sm:h-6 sm:w-6" />
                </div>

                <h3 className="mb-1.5 text-sm font-semibold leading-5 text-[#1F1816] sm:mb-2 sm:text-lg">
                  {feature.title}
                </h3>

                <p className="text-xs leading-5 text-[#6E625C] sm:text-sm sm:leading-normal">
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