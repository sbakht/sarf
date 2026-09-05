import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const STRIPE: Record<string, string> = {
  "/lessons": "bg-lam",
  "/atlas": "bg-primary",
  "/gym": "bg-energy",
  "/spotter": "bg-fa",
  "/lab": "bg-ayn",
};

export function ModeCard({
  href,
  kicker,
  title,
  arabic,
  body,
}: {
  href: string;
  kicker: string;
  title: string;
  arabic: string;
  body: string;
}) {
  return (
    <Link href={href} className="group block h-full">
      <Card className="h-full transition hover:-translate-y-0.5 hover:ring-primary/40">
        <div className={cn("h-1", STRIPE[href] ?? "bg-primary")} />
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <p className="kicker">{kicker}</p>
            <span className="font-arabic text-2xl text-muted-foreground">
              {arabic}
            </span>
          </div>
          <CardTitle className="mt-2 text-2xl font-semibold">{title}</CardTitle>
          <CardDescription className="leading-7">{body}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-energy group-hover:underline">
            Open {title}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
