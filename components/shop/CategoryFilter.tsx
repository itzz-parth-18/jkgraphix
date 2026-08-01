type Props = {
  categories: string[];
  value: string;
  onChange: (value: string) => void;
};

export default function CategoryFilter({
  categories,
  value,
  onChange,
}: Props) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-xl border border-[#EFE8E2] bg-white px-4 py-3 text-sm outline-none focus:border-[#C89A84]"
    >
      <option value="all">All Categories</option>

      {categories.map((category) => (
        <option key={category} value={category}>
          {category}
        </option>
      ))}
    </select>
  );
}