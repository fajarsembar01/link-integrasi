"use client";
import { useMemo } from "react";
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

  return (
    <div className="flex flex-col md:flex-row gap-3 items-center">
      <div className="w-full md:flex-1">
        <Input
          placeholder="Cari judul, deskripsi, tags..."
          value={value.q}
          onChange={(e) => onChange({ ...value, q: e.target.value })}
        />
      </div>

      <Select
        value={value.category}
        onValueChange={(v) => onChange({ ...value, category: v })}
      >
        <SelectTrigger className="w-[180px]">
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

      <div className="flex items-center gap-2">
        <Switch
          id="onlyPinned"
          checked={value.onlyPinned}
          onCheckedChange={(v) => onChange({ ...value, onlyPinned: v })}
        />
        <Label htmlFor="onlyPinned">Pinned</Label>
      </div>

      <div className="flex items-center gap-2">
        <Switch
          id="compact"
          checked={value.compact}
          onCheckedChange={(v) => onChange({ ...value, compact: v })}
        />
        <Label htmlFor="compact">Compact</Label>
      </div>

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
  );
}
