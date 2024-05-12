import { SignIn } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default function Page() {
  const { userId } = auth();
  if (userId) {
    redirect("/dashboard");
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <SignIn path="/sign-in" />
    </main>
  );
}
