import { ThemeToggle } from "@/components/molecules/theme-toggle"

type AppHeaderProps = {
  title?: string
}

function AppHeader({ title = "Confer" }: AppHeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-border px-6 py-4">
      <span className="text-sm font-semibold">{title}</span>
      <ThemeToggle />
    </header>
  )
}

export { AppHeader }
