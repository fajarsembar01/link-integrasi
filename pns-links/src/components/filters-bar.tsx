"use client";
import { useMemo, useId } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export type Filters = {
  q: string;
  category: string;
  onlyPinned: boolean;
  compact: boolean;
};

export function FiltersBar({
  categories,
  value,
  onChange,
}: {
  categories: string[];
  value: Filters;
  onChange: (f: Filters) => void;
}) {
  const catOptions = useMemo(() => ["Semua", ...categories], [categories]);
  const pinnedId = useId();
  const compactId = useId();

  return (
    <div
      className="
        grid items-stretch
        grid-cols-2 gap-2
        md:grid-cols-4 md:gap-3
      "
    >
      {/* Search: full di mobile & md */}
      <div className="col-span-2 md:col-span-2">
        <Input
          inputMode="search"
          placeholder="Cari judul, deskripsi, atau tag…"
          value={value.q}
          onChange={(e) => onChange({ ...value, q: e.target.value })}
          className="w-full"
        />
      </div>

      {/* Kategori: full di mobile, 1 kolom di desktop */}
      <div className="col-span-2 md:col-span-1">
        <Select
          value={value.category}
          onValueChange={(v) => onChange({ ...value, category: v })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Kategori" />
          </SelectTrigger>
          <SelectContent>
            {catOptions.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Bar switches + Reset (mobile) */}
      <div className="col-span-2 md:hidden">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Switch
                id={pinnedId}
                checked={value.onlyPinned}
                onCheckedChange={(v) => onChange({ ...value, onlyPinned: v })}
              />
              <Label htmlFor={pinnedId} className="text-sm">
                Pinned
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id={compactId}
                checked={value.compact}
                onCheckedChange={(v) => onChange({ ...value, compact: v })}
              />
              <Label htmlFor={compactId} className="text-sm">
                Compact
              </Label>
            </div>
          </div>

          {/* Reset khusus mobile, rapat di ujung kanan */}
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              onChange({
                q: "",
                category: "Semua",
                onlyPinned: false,
                compact: value.compact,
              })
            }
          >
            Reset
          </Button>
        </div>
      </div>

      {/* Bar switches (desktop) */}
      <div className="hidden md:flex md:col-span-1 md:items-center md:justify-end md:gap-4">
        <div className="flex items-center gap-2">
          <Switch
            id={pinnedId + "-md"}
            checked={value.onlyPinned}
            onCheckedChange={(v) => onChange({ ...value, onlyPinned: v })}
          />
          <Label htmlFor={pinnedId + "-md"} className="text-sm">
            Pinned
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            id={compactId + "-md"}
            checked={value.compact}
            onCheckedChange={(v) => onChange({ ...value, compact: v })}
          />
        <Label htmlFor={compactId + "-md"} className="text-sm">
            Compact
          </Label>
        </div>
      </div>

      {/* Reset (desktop) */}
      <div className="hidden md:block md:col-span-1 md:justify-self-end">
        <Button
          variant="outline"
          onClick={() =>
            onChange({
              q: "",
              category: "Semua",
              onlyPinned: false,
              compact: value.compact,
            })
          }
        >
          Reset
        </Button>
      </div>
    </div>
  );
}
