"use client";

import { useEffect, useState } from "react";

type Props = {
  productId: string;
};

type CustomField = {
  id: string;
  label: string;
  fieldType: string;
  isRequired: boolean;
  placeholder: string;
  sortOrder: number;
};

export default function CustomFieldsEditor({
  productId,
}: Props) {
  const [fields, setFields] = useState<CustomField[]>([]);
  useEffect(() => {
  loadFields();
}, [productId]);

const loadFields = async () => {
  try {
    const res = await fetch(
      `/api/admin/products/${productId}/custom-fields`
    );

    if (!res.ok) return;

    const data = await res.json();

    setFields(data);
  } catch (error) {
    console.error(error);
  }
};

const saveField = async (field: CustomField) => {
  try {
    const res = await fetch(
      `/api/admin/custom-fields/${field.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(field),
      }
    );

    if (!res.ok) {
      throw new Error("Failed to save field");
    }
  } catch (error) {
    console.error(error);
  }
};

  return (
    <div className="border-t border-[#EFE8E2] pt-8 mt-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-[#1F1816]">
            Custom Fields
          </h2>

          <p className="text-sm text-[#6E625C] mt-1">
            Configure personalization fields for this product.
          </p>
        </div>

        <button
          type="button"
         onClick={async () => {
  try {
    const res = await fetch(
      `/api/admin/products/${productId}/custom-fields`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          label: "",
          fieldType: "SHORT_TEXT",
          isRequired: true,
          placeholder: "",
          sortOrder: fields.length,
        }),
      }
    );

    if (!res.ok) {
      alert("Failed to create custom field");
      return;
    }

    const newField = await res.json();

    setFields((prev) => [...prev, newField]);
  } catch (error) {
    console.error(error);
    alert("Something went wrong");
  }
}}
          className="rounded-xl bg-[#1F1816] px-4 py-2 text-sm font-medium text-white hover:bg-[#322724]"
        >
          + Add Field
        </button>
      </div>

     <div className="mt-6 space-y-4">
  {fields.map((field) => (
    <div
      key={field.id}
      className="rounded-xl border border-[#EFE8E2] bg-[#F9F6F2] p-5 space-y-4"
    >
      {/* Field Label */}
      <div>
        <label className="mb-1 block text-xs font-semibold uppercase text-[#6E625C]">
          Field Label
        </label>

        <input
          type="text"
          value={field.label}
          onChange={(e) => {
  const updatedField = {
    ...field,
    label: e.target.value,
  };

  setFields((prev) =>
    prev.map((f) =>
      f.id === field.id ? updatedField : f
    )
  );

  saveField(updatedField);
}}
          placeholder="Example: Name to Engrave"
          className="w-full rounded-xl border border-[#EFE8E2] px-3 py-2"
        />
      </div>

      {/* Field Type */}
      <div>
        <label className="mb-1 block text-xs font-semibold uppercase text-[#6E625C]">
          Field Type
        </label>

        <select
          value={field.fieldType}
         onChange={(e) => {
  const updatedField = {
    ...field,
    fieldType: e.target.value,
  };

  setFields((prev) =>
    prev.map((f) =>
      f.id === field.id ? updatedField : f
    )
  );

  saveField(updatedField);
}}
          className="w-full rounded-xl border border-[#EFE8E2] px-3 py-2"
        >
          <option value="SHORT_TEXT">Short Text</option>
          <option value="LONG_TEXT">Long Text</option>
          <option value="DATE_PICKER">Date Picker</option>
          <option value="IMAGE_UPLOAD">Image Upload</option>
          <option value="COLOR_SELECT">Color Picker</option>
        </select>
      </div>

      {/* Placeholder */}
      <div>
        <label className="mb-1 block text-xs font-semibold uppercase text-[#6E625C]">
          Placeholder
        </label>

        <input
          type="text"
          value={field.placeholder}
          onChange={(e) => {
  const updatedField = {
    ...field,
    placeholder: e.target.value,
  };

  setFields((prev) =>
    prev.map((f) =>
      f.id === field.id ? updatedField : f
    )
  );

  saveField(updatedField);
}}
          placeholder="Enter placeholder..."
          className="w-full rounded-xl border border-[#EFE8E2] px-3 py-2"
        />
      </div>

      {/* Required */}
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={field.isRequired}
          onChange={(e) => {
  const updatedField = {
    ...field,
    isRequired: e.target.checked,
  };

  setFields((prev) =>
    prev.map((f) =>
      f.id === field.id ? updatedField : f
    )
  );

  saveField(updatedField);
}}
        />

        <span className="text-sm text-[#2C2320]">
          Required Field
        </span>
      </label>

      {/* Delete */}
      <button
        type="button"
        onClick={async () => {
  try {
    const res = await fetch(
      `/api/admin/custom-fields/${field.id}`,
      {
        method: "DELETE",
      }
    );

    if (!res.ok) {
      alert("Failed to delete field");
      return;
    }

    setFields((prev) =>
      prev.filter((f) => f.id !== field.id)
    );
  } catch (error) {
    console.error(error);
  }
}}
        className="rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
      >
        Delete Field
      </button>
    </div>
  ))}
</div>
    </div>
  );
}