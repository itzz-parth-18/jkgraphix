type Props = {
  title: string;
  description: string;
};

export default function AccountCard({
  title,
  description,
}: Props) {
  return (
    <div className="rounded-2xl border border-taupe-border bg-white p-6 shadow-sm transition hover:shadow-lg">
      <h3 className="text-xl font-semibold text-espresso">
        {title}
      </h3>

      <p className="mt-2 text-sm text-taupe">
        {description}
      </p>
    </div>
  );
}