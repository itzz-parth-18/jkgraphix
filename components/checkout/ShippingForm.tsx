"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

type Props = {
  cart: any;
  onSaved: (shippingCost: number) => void;
};

type FormData = {
  fullName: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pinCode: string;
  country: string;
};

export default function ShippingForm({
  cart,
  onSaved,
}: Props) {
  const { data: session } = useSession();

  const [form, setForm] = useState<FormData>({
    fullName: cart?.fullName ?? "",
    phone: cart?.phone ?? "",
    email: cart?.email ?? session?.user?.email ?? "",
    addressLine1: cart?.addressLine1 ?? "",
    addressLine2: cart?.addressLine2 ?? "",
    city: cart?.city ?? "",
    state: cart?.state ?? "",
    pinCode: cart?.pinCode ?? "",
    country: cart?.country ?? "India",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setError("");
    setSuccess("");
  }

  function validate() {
    if (
      !form.fullName ||
      !form.phone ||
      !form.email ||
      !form.addressLine1 ||
      !form.city ||
      !form.state ||
      !form.pinCode ||
      !form.country
    ) {
      return "Please fill all required fields.";
    }

    if (!/^\d{10}$/.test(form.phone)) {
      return "Enter a valid phone number.";
    }

    if (!/^\d{6}$/.test(form.pinCode)) {
      return "Enter a valid PIN Code.";
    }

    return "";
  }

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    const validation = validate();

    if (validation) {
      setError(validation);
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const response = await fetch(
        "/api/checkout/shipping",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        setError(
          result.error ??
            result.message ??
            "Failed to save shipping information."
        );
        return;
      }

      setSuccess(
        result.shippingCost === 0
          ? "Shipping information saved. Free shipping applied."
          : `Shipping information saved. Shipping charge: ₹${Number(
              result.shippingCost
            ).toFixed(2)}`
      );

      onSaved(Number(result.shippingCost ?? 0));
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const fields = [
    {
      label: "Full Name",
      name: "fullName",
    },
    {
      label: "Phone Number (WhatsApp)",
      name: "phone",
      inputMode: "numeric" as const,
    },
    {
      label: "Email",
      name: "email",
      type: "email",
      inputMode: "email" as const,
    },
    {
      label: "Address Line 1",
      name: "addressLine1",
    },
    {
      label: "Address Line 2",
      name: "addressLine2",
    },
    {
      label: "City",
      name: "city",
    },
    {
      label: "State",
      name: "state",
    },
    {
      label: "PIN Code",
      name: "pinCode",
      inputMode: "numeric" as const,
    },
    {
      label: "Country",
      name: "country",
    },
  ];

  return (
    <form className="space-y-5 sm:space-y-6" onSubmit={handleSubmit}>
      <div className="border-b border-[#EFE8E2] pb-3 sm:pb-4">
        <h2 className="text-xl font-semibold text-[#1F1816] sm:text-2xl">
          Shipping Information
        </h2>

        <p className="mt-1 text-xs leading-relaxed text-[#6E625C] sm:text-sm">
          Enter your delivery details carefully.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-xl bg-red-50 p-3 text-xs leading-relaxed text-red-600 sm:text-sm"
        >
          {error}
        </div>
      )}

      {success && (
        <div
          role="status"
          className="rounded-xl bg-green-50 p-3 text-xs leading-relaxed text-green-700 sm:text-sm"
        >
          {success}
        </div>
      )}

      <div className="space-y-4 sm:space-y-5">
        {fields.map((field) => (
          <div key={field.name}>
            <label
              htmlFor={field.name}
              className="mb-1.5 block text-xs font-medium text-[#2C2320] sm:mb-2 sm:text-sm"
            >
              {field.label}
            </label>

            <input
              id={field.name}
              type={field.type ?? "text"}
              name={field.name}
              value={
                form[field.name as keyof FormData]
              }
              onChange={handleChange}
              inputMode={field.inputMode}
              autoComplete={
                field.name === "fullName"
                  ? "name"
                  : field.name === "phone"
                  ? "tel"
                  : field.name === "email"
                  ? "email"
                  : field.name === "addressLine1"
                  ? "street-address"
                  : field.name === "city"
                  ? "address-level2"
                  : field.name === "state"
                  ? "address-level1"
                  : field.name === "pinCode"
                  ? "postal-code"
                  : field.name === "country"
                  ? "country-name"
                  : "off"
              }
              className="min-h-11 w-full rounded-xl border border-[#D8CFC8] bg-white px-3 py-2.5 text-sm text-[#2C2320] outline-none transition placeholder:text-[#9A8F88] focus:border-[#2C2320] focus:ring-1 focus:ring-[#2C2320]/10 sm:px-4 sm:py-3"
            />
          </div>
        ))}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="min-h-12 w-full rounded-xl bg-[#1F1816] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#2C2320] active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-gray-400"
      >
        {loading ? "Saving..." : "Save & Continue"}
      </button>
    </form>
  );
}