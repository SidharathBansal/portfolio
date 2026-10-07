import { profile } from "@/data/profile";
import { container } from "@/lib/styles";

export default function Footer() {
  return (
    <footer className="border-t border-line py-10">
      <div className={`${container} flex flex-col gap-3 font-mono text-[11.5px] text-faint sm:flex-row sm:items-center sm:justify-between`}>
        <p>
          © {new Date().getFullYear()} {profile.name}
        </p>
        <p>built with Next.js · press / for commands</p>
      </div>
    </footer>
  );
}
