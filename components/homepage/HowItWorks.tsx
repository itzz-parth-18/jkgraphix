import { ShoppingBag, Palette, CreditCard, Truck } from "lucide-react";

const steps = [
  {
    title: "Choose Product",
    description: "Select the product that best fits your needs.",
    icon: ShoppingBag,
  },
  {
    title: "Customize",
    description: "Upload your design or personalize it with our options.",
    icon: Palette,
  },
  {
    title: "Place Order",
    description: "Review everything and complete your purchase securely.",
    icon: CreditCard,
  },
  {
    title: "Receive Delivery",
    description: "We'll print, package and deliver it to your doorstep.",
    icon: Truck,
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 bg-[#F9F6F2]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-[#1F1816]">
            How It Works
          </h2>

          <p className="mt-3 text-[#6E625C]">
            Ordering from JK Graphix is simple.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div
                key={step.title}
                className="rounded-2xl border border-[#EFE8E2] bg-white p-6 text-center"
              >
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#EFE8E2]">
                  <Icon className="h-6 w-6 text-[#1F1816]" />
                </div>

                <p className="mb-2 text-sm font-semibold text-[#C89A84]">
                  Step {index + 1}
                </p>

                <h3 className="mb-3 text-lg font-semibold text-[#1F1816]">
                  {step.title}
                </h3>

                <p className="text-sm text-[#6E625C]">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}