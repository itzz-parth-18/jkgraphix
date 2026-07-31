import { auth, signOut } from "@/lib/auth";
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
      <h1 className="mb-4 font-serif text-3xl font-bold text-espresso">
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

      <form
        action={async () => {
          "use server";
          await signOut({
            redirectTo: "/admin/login",
          });
        }}
      >
        <button
          type="submit"
          className="mt-6 rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
        >
          Logout
        </button>
      </form>
    </div>
  );
}