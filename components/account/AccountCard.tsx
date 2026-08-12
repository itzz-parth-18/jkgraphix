import Link from "next/link";

type Props = {
  title: string;
  description: string;
  href: string;
};

export default function AccountCard({
  title,
  description,
  href,
}: Props) {
  return (
    <Link
      href={href}
      className="block rounded-2xl border border-taupe-border bg-white p-6 shadow-sm transition hover:shadow-lg hover:border-[#C89A84]"
    >
      <h3 className="text-xl font-semibold text-espresso">
        {title}
      </h3>
      <p className="mt-2 text-sm text-taupe">
        {description}
      </p>
    </Link>
  );
}