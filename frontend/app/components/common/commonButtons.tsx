import { Button } from "../ui/button"

export function PrimaryBtn({text}: {text: string}) {
  return (
    <Button className="bg-theme-primary hover:bg-theme-primary/90 text-white font-bold">{text}</Button>
  )
}

export function SecondaryBtn({text}: {text: string}) {
  return (
    <Button variant={"outline"} className="bg-surface border-main-border hover:bg-surface/70 font-bold">{text}</Button>
  )
}