type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function SortSelect({ value, onChange }: Props) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-xl border border-[#EFE8E2] bg-white px-4 py-3 text-sm outline-none focus:border-[#C89A84]"
    >
      <option value="newest">Newest</option>
      <option value="price-asc">Price: Low to High</option>
      <option value="price-desc">Price: High to Low</option>
      <option value="alphabetical">Alphabetical</option>
    </select>
  );
}