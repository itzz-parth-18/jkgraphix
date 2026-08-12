type ShopHeaderProps = {
  title?: string;
};

export default function ShopHeader({ title = "Shop" }: ShopHeaderProps) {
  return (
    <section className="mb-12 text-center">
      <h1 className="font-serif text-4xl font-bold text-[#1F1816]">
        {title}
      </h1>

      <p className="mt-3 text-[#6E625C] max-w-2xl mx-auto">
        Browse our collection of premium custom printing and personalized
        products.
      </p>
    </section>
  );
}