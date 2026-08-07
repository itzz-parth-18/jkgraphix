import { OrderStatus } from "@prisma/client";

const steps: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "DESIGNING",
  "PRINTING",
  "SHIPPED",
  "DELIVERED",
  "COMPLETED",
];

type Props = {
  status: OrderStatus;
};

export default function OrderTimeline({
  status,
}: Props) {
  const currentStep = steps.indexOf(status);

  return (
    <div className="mt-10">

      <h2 className="mb-6 text-2xl font-semibold text-[#1F1816]">
        Order Progress
      </h2>

      <div className="space-y-5">

        {steps.map((step, index) => {
          const completed = index <= currentStep;

          return (
            <div
              key={step}
              className="flex items-center gap-4"
            >
              <div
                className={`h-4 w-4 rounded-full ${
                  completed
                    ? "bg-green-600"
                    : "bg-gray-300"
                }`}
              />

              <span
                className={`font-medium ${
                  completed
                    ? "text-[#1F1816]"
                    : "text-[#9A918B]"
                }`}
              >
                {step.replaceAll("_", " ")}
              </span>
            </div>
          );
        })}

      </div>

    </div>
  );
}