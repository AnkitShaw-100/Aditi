import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";

export default function SectionReveal({ children, className, delay = 0 }) {
  const [ref, inView] = useInView();

  return (
    <div
      ref={ref}
      className={cn("section-reveal", inView && "section-reveal--visible", className)}
      style={{ "--reveal-delay": `${delay}ms` }}
    >
      {children}
    </div>
  );
}
