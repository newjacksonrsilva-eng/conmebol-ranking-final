import { useTheme } from "@/contexts/ThemeContext";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  if (!toggleTheme) return null; // Should not happen if switchable is true

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-muted hover:bg-muted-foreground/20 transition-colors"
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <Moon className="h-5 w-5 text-muted-foreground" />
      ) : (
        <Sun className="h-5 w-5 text-muted-foreground" />
      )}
    </button>
  );
}

