import { LogIn } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
     <button className="px-6 py-2 rounded shadow flex items-center gap-2 bg-sky-500 text-white">Login <LogIn/></button>
    </main>
  );
}
