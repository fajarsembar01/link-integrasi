"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { LinkItem } from "@/lib/types";

export function QuickAddDialog({
  categories,
  onAdd,
}: {
  categories: string[];
  onAdd: (item: LinkItem) => void;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Partial<LinkItem>>({});

  function submit() {
    if (!form.title || !form.url || !form.category) {
      toast.error("Judul, URL, dan Kategori wajib diisi");
      return;
    }
    const id = (form.title + "-" + Date.now())
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-");

    onAdd({
      id,
      title: form.title!,
      url: form.url!,
      category: form.category!,
      description: form.description || "",
      tags: form.tags || [],
      agency: form.agency || "",
    });

    setOpen(false);
    setForm({});
    toast.success("Link ditambahkan");
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Tambah Link</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Link Cepat</DialogTitle>
        </DialogHeader>

        <div className="grid gap-3">
          <div className="grid gap-1">
            <Label htmlFor="title">Judul</Label>
            <Input
              id="title"
              value={form.title || ""}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Contoh: MySAPK BKN"
            />
          </div>

          <div className="grid gap-1">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              value={form.url || ""}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              placeholder="https://..."
            />
          </div>

          <div className="grid gap-1">
            <Label htmlFor="category">Kategori</Label>
            {/* pakai datalist supaya bisa pilih/ketik kategori */}
            <Input
              id="category"
              list="kategori-options"
              value={form.category || ""}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              placeholder="Kepegawaian / SPMB / Latsar / ..."
            />
            <datalist id="kategori-options">
              {categories.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>

          <div className="grid gap-1">
            <Label htmlFor="desc">Deskripsi</Label>
            <Textarea
              id="desc"
              value={form.description || ""}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Keterangan singkat"
              rows={3}
            />
          </div>

          <div className="grid gap-1">
            <Label htmlFor="tags">Tags (pisahkan dengan koma)</Label>
            <Input
              id="tags"
              value={(form.tags as string[] | undefined)?.join(", ") || ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  tags: e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                })
              }
              placeholder="asn, bkn, kinerja"
            />
          </div>

          <div className="grid gap-1">
            <Label htmlFor="agency">Instansi</Label>
            <Input
              id="agency"
              value={form.agency || ""}
              onChange={(e) => setForm({ ...form, agency: e.target.value })}
              placeholder="BKN / Pemprov DKI / dsb."
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button onClick={submit}>Simpan</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
