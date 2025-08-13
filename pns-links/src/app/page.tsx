"use client";

import seedJson from "@/data/links.json";
import { useEffect, useMemo, useState } from "react";
import { FiltersBar, type Filters } from "@/components/filters-bar";
import { LinkCard } from "@/components/link-card";
import { ImportExport } from "@/components/import-export";
import { QuickAddDialog } from "@/components/quick-add-dialog";
import { getPrefs, setPrefs, getData, setData } from "@/lib/storage";
import { isPinned } from "@/lib/storage";
import type { LinkItem, LinksData } from "@/lib/types";

export default function Page() {
  const [links, setLinks] = useState<LinksData>({ categories: [], items: [] });
  const [filters, setFilters] = useState<Filters>({
    q: "",
    category: "Semua",
    onlyPinned: false,
    compact: getPrefs().compact,
  });

  // tick untuk memicu re-render saat pin berubah dari child
  const [pinTick, setPinTick] = useState(0);

  // Load pertama: dari localStorage, kalau kosong seed dari JSON
  useEffect(() => {
    const seeded = getData<LinksData>(seedJson as LinksData);
    const categories = Array.from(
      new Set((seeded.categories || []).concat(seeded.items.map((i) => i.category)))
    );
    const normalized: LinksData = { categories, items: seeded.items || [] };
    setLinks(normalized);
    setData(normalized);
  }, []);

  // Persist preferensi compact
  useEffect(() => {
    setPrefs({ compact: filters.compact });
  }, [filters.compact]);

  // Filter dulu
  const filtered = useMemo(() => {
    const q = filters.q.toLowerCase();
    return links.items.filter((it) => {
      const hit =
        (!q ||
          it.title.toLowerCase().includes(q) ||
          it.description?.toLowerCase().includes(q) ||
          it.tags?.some((t) => t.toLowerCase().includes(q)) ||
          it.agency?.toLowerCase().includes(q)) &&
        (filters.category === "Semua" || it.category === filters.category);

      if (!hit) return false;

      if (filters.onlyPinned) {
        try {
          const raw = JSON.parse(localStorage.getItem("pns-links:pinned") || "{}");
          return !!raw[it.id];
        } catch {
          return false;
        }
      }
      return true;
    });
  }, [links.items, filters]);

  // Lalu sort: pinned dulu, lalu urutan aslinya
  const sorted = useMemo(() => {
    const byIdIndex = new Map(links.items.map((it, idx) => [it.id, idx]));
    return [...filtered].sort((a, b) => {
      const ap = isPinned(a.id) ? 1 : 0;
      const bp = isPinned(b.id) ? 1 : 0;
      if (ap !== bp) return bp - ap; // pinned (1) ke atas
      // stabil: kembali ke index asli
      return (byIdIndex.get(a.id) ?? 0) - (byIdIndex.get(b.id) ?? 0);
    });
    // dependensi pinTick supaya resort setelah toggle pin
  }, [filtered, links.items, pinTick]);

  function handleImport(next: LinksData) {
    const categories = Array.from(
      new Set((next.categories || []).concat(next.items.map((i) => i.category)))
    );
    const normalized: LinksData = { categories, items: next.items };
    setLinks(normalized);
    setData(normalized);
  }

  function handleAdd(item: LinkItem) {
    setLinks((prev) => {
      const categories = Array.from(new Set([...prev.categories, item.category]));
      const next = { categories, items: [item, ...prev.items] };
      setData(next);
      return next;
    });
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Manajer Link Pegawai
          </h1>
          <p className="text-muted-foreground">
            Satu tempat untuk semua link penting PNS
          </p>
        </div>
        <div className="flex items-center gap-2">
          <QuickAddDialog categories={links.categories} onAdd={handleAdd} />
          <ImportExport data={links} onImport={handleImport} />
        </div>
      </header>

      <FiltersBar categories={links.categories} value={filters} onChange={setFilters} />

      <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sorted.map((item) => (
          <LinkCard
            key={item.id}
            item={item}
            compact={filters.compact}
            onPinnedChange={() => setPinTick((t) => t + 1)} // <<--- trigger resort
          />
        ))}
      </main>

      {sorted.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Tidak ada hasil. Reset filter atau tambah link baru.
        </p>
      )}
    </div>
  );
}
