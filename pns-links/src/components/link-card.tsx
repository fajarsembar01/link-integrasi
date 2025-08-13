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
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

function faviconFrom(url: string) {
  try {
    const host = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${host}&sz=64`;
  } catch {
    return null;
  }
}

export function LinkCard({
  item,
  compact = false,
  onPinnedChange,
}: {
  item: LinkItem & { logoUrl?: string }; // tambahkan logoUrl opsional
  compact?: boolean;
  onPinnedChange?: () => void;
}) {
  const [pinned, setPinned] = useState(false);
  const logo = useMemo(
    () => item.logoUrl || faviconFrom(item.url),
    [item.logoUrl, item.url]
  );

  useEffect(() => {
    setPinned(isPinned(item.id));
  }, [item.id]);

  function onTogglePin() {
    const next = togglePinned(item.id);
    setPinned(next);
    toast[next ? "success" : "message"](next ? "Pinned" : "Unpinned");
    onPinnedChange?.();
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
    <Card
      className={cn(
        "group transform transition-transform duration-200 hover:scale-105",
        pinned && "ring-2 ring-primary/50"
      )}
    >

      <CardHeader className={cn("pb-2", compact && "py-2")}>
        <div className="flex items-center justify-between gap-2">
          <CardTitle
            className={cn(
              "flex items-center gap-2 text-base md:text-lg",
              compact && "text-sm"
            )}
            title={item.title}
          >
            {logo && (
              <img
                src={logo}
                alt=""
                loading="lazy"
                referrerPolicy="no-referrer"
                className={cn(
                  "rounded-sm object-contain shrink-0 bg-white",
                  compact ? "h-4 w-4" : "h-5 w-5"
                )}
              />
            )}
            <span className="line-clamp-1">{item.title}</span>
          </CardTitle>

          <div className="flex items-center gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={copyUrl}
                    aria-label="Salin URL"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Salin URL</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    asChild
                    aria-label="Buka link"
                  >
                    <a href={item.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Buka link</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onTogglePin}
                    aria-label={pinned ? "Unpin" : "Pin"}
                  >
                    {pinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{pinned ? "Unpin" : "Pin"}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardHeader>

      <CardContent className={cn("pt-0", compact && "py-2")}>
        {item.description && (
          <p
            className={cn(
              "text-sm text-muted-foreground",
              compact && "text-xs"
            )}
          >
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
