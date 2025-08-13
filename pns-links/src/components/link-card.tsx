"use client";

import { ExternalLink, Pin, PinOff, Copy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { LinkItem } from "@/lib/types";
import { isPinned, togglePinned } from "@/lib/storage";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function LinkCard({
  item,
  compact = false,
  onPinnedChange, // <<--- tambahkan ini
}: {
  item: LinkItem;
  compact?: boolean;
  onPinnedChange?: () => void; // dipanggil setelah toggle pin biar parent resort
}) {
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    setPinned(isPinned(item.id));
  }, [item.id]);

  function onTogglePin() {
    const next = togglePinned(item.id);
    setPinned(next);
    toast[next ? "success" : "message"](next ? "Pinned" : "Unpinned");
    onPinnedChange?.(); // <<--- beritahu parent supaya resort
  }

  async function copyUrl() {
    try {
      await navigator.clipboard.writeText(item.url);
      toast.success("URL disalin");
    } catch {
      toast.error("Gagal menyalin URL");
    }
  }

  return (
    <Card className={cn("group", pinned && "ring-2 ring-primary/50")}>
      <CardHeader className={cn("pb-2", compact && "py-2")}>
        <div className="flex items-center justify-between gap-2">
          <CardTitle className={cn("text-base md:text-lg", compact && "text-sm")}>
            {item.title}
          </CardTitle>
          <div className="flex items-center gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={copyUrl}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Salin URL</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Button variant="ghost" size="icon" asChild>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Buka link"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={onTogglePin}
              aria-label={pinned ? "Unpin" : "Pin"}
            >
              {pinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className={cn("pt-0", compact && "py-2")}>
        {item.description && (
          <p className={cn("text-sm text-muted-foreground", compact && "text-xs")}>
            {item.description}
          </p>
        )}

        <div className="mt-2 flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{item.category}</Badge>
          {item.agency && <Badge variant="outline">{item.agency}</Badge>}
          {item.tags?.map((t) => (
            <Badge key={t} className="capitalize">
              {t}
            </Badge>
          ))}
          {pinned && <Badge>Pinned</Badge>}
        </div>
      </CardContent>
    </Card>
  );
}
