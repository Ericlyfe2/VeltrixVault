import { cn } from "@/lib/utils";

const styles: Record<string, string> = {
  W: "bg-brand text-on-brand dark:bg-lime dark:text-[#0b1f18]",
  D: "bg-gold/25 text-[#7a5208] dark:text-gold",
  L: "bg-coral/15 text-coral",
};

export function FormPills({
  form,
  className,
  label = true,
}: {
  form: string;
  className?: string;
  label?: boolean;
}) {
  if (!form) return <span className="text-xs text-muted">—</span>;

  return (
    <span
      className={cn("inline-flex items-center gap-1", className)}
      aria-label={label ? `Recent form: ${form.split("").join(", ")}` : undefined}
    >
      {form.split("").map((result, index) => (
        <span
          key={`${result}-${index}`}
          className={cn(
            "inline-flex h-6 w-6 items-center justify-center rounded-[7px] text-[10px] font-bold",
            styles[result] ?? "bg-paper-2 text-muted",
          )}
        >
          {result}
        </span>
      ))}
    </span>
  );
}
