import type{ Route } from "./+types/home";

import Logo from "@/components/ui/logo";

import { Button } from "@/components/ui/button";
import { Link } from "react-router";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Sync" },
    { name: "description", content: "Keep Your work synchronize" },
  ];
}

export default function HomePage() {
  return <section className="w-full mx-auto h-screen flex justify-center items-center">
    
    <Logo />
    <Link to={"/login"}>
      <Button className="bg-theme-primary hover:bg-theme-primary/90 text-white font-bold">Log In</Button>
    </Link>
    <Link to={"/signup"}>
      <Button variant={"outline"} className="bg-surface border-main-border hover:bg-surface/70 font-bold">Sign Up</Button>
    </Link>

  </section>;
}
