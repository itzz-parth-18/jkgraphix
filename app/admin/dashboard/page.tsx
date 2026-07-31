import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await auth();

  if (!session) {
    redirect("/admin/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="p-8">
      <h1 className="mb-4 text-3xl font-bold font-serif text-espresso">
        Workshop Dashboard
      </h1>

      <p className="text-taupe">
        Welcome back, {session.user.name}
      </p>

      <div className="mt-4 space-y-2 rounded-lg border p-4">
        <p>
          <strong>Email:</strong> {session.user.email}
        </p>

        <p>
          <strong>Role:</strong> {session.user.role}
        </p>
      </div>
    </div>
  );
}