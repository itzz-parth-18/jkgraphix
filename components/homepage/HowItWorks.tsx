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
    <section className="bg-[#F9F6F2] px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 text-center sm:mb-12">
          <h2 className="text-2xl font-bold text-[#1F1816] sm:text-3xl">
            How It Works
          </h2>

          <p className="mt-2 text-sm text-[#6E625C] sm:mt-3">
            Ordering from JK Graphix is simple.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div
                key={step.title}
                className="rounded-2xl border border-[#EFE8E2] bg-white p-4 text-center sm:p-6"
              >
                <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#EFE8E2] sm:mb-5 sm:h-14 sm:w-14">
                  <Icon className="h-5 w-5 text-[#1F1816] sm:h-6 sm:w-6" />
                </div>

                <p className="mb-1.5 text-xs font-semibold text-[#C89A84] sm:mb-2 sm:text-sm">
                  Step {index + 1}
                </p>

                <h3 className="mb-2 text-sm font-semibold leading-5 text-[#1F1816] sm:mb-3 sm:text-lg">
                  {step.title}
                </h3>

                <p className="text-xs leading-5 text-[#6E625C] sm:text-sm sm:leading-normal">
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