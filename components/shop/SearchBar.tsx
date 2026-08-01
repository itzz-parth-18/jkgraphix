type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function SearchBar({ value, onChange }: Props) {
  return (
    <div className="w-full">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search products..."
        className="w-full rounded-xl border border-[#EFE8E2] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#C89A84]"
      />
    </div>
  );
}