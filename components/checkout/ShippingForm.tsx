"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

type Props = {
  onSaved: () => void;
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
  onSaved,
}: Props) {
  const { data: session } = useSession();

  const [form, setForm] = useState<FormData>({
    fullName: "",
    phone: "",
    email: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pinCode: "",
    country: "India",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (session?.user?.email) {
      setForm((prev) => ({
        ...prev,
        email: session.user.email!,
      }));
    }

    // NAYA: Product page se save kiya hua WhatsApp number yahan auto-fill ho jayega!
    const savedWhatsapp = localStorage.getItem("checkout_whatsapp");
    if (savedWhatsapp) {
      setForm((prev) => ({
        ...prev,
        phone: savedWhatsapp,
      }));
    }
  }, [session]);

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

      const response = await fetch(
        "/api/checkout/shipping",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        setError(
          result.error ??
            "Failed to save shipping information."
        );
        return;
      }

      setSuccess(
        "Shipping information saved."
      );

      onSaved();
    } catch {
      setError(
        "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <h2 className="text-2xl font-semibold text-[#1F1816]">
        Shipping Information
      </h2>

      {error && (
        <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-xl bg-green-50 p-3 text-sm text-green-700">
          {success}
        </div>
      )}

      {[
        {
          label: "Full Name",
          name: "fullName",
        },
        {
          label: "Phone Number (WhatsApp)",
          name: "phone",
        },
        {
          label: "Email",
          name: "email",
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
        },
        {
          label: "Country",
          name: "country",
        },
      ].map((field) => (
        <div key={field.name}>
          <label className="mb-2 block text-sm font-medium text-[#2C2320]">
            {field.label}
          </label>

          <input
            type="text"
            name={field.name}
            value={
              form[
                field.name as keyof FormData
              ]
            }
            onChange={handleChange}
            className="w-full rounded-xl border border-[#D8CFC8] bg-white px-4 py-3 outline-none focus:border-[#2C2320]"
          />
        </div>
      ))}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-[#1F1816] px-6 py-3 text-white transition hover:bg-[#2C2320] disabled:cursor-not-allowed disabled:bg-gray-400"
      >
        {loading
          ? "Saving..."
          : "Save & Continue"}
      </button>
    </form>
  );
}