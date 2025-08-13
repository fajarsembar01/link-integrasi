"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { LinksData } from "@/lib/types";
import { toast } from "sonner";

export function ImportExport({
  data,
  onImport,
}: {
  data: LinksData;
  onImport: (next: LinksData) => void;
}) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function download() {
    try {
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "links.json";
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Berhasil export links.json");
    } catch {
      toast.error("Gagal export JSON");
    }
  }

  function handleImport() {
    try {
      const parsed = JSON.parse(text) as LinksData;
      onImport(parsed);
      setOpen(false);
      setText("");
      toast.success("Import JSON berhasil");
    } catch {
      toast.error("JSON tidak valid");
    }
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as LinksData;
        onImport(parsed);
        toast.success(`Import dari file "${file.name}" berhasil`);
      } catch {
        toast.error("JSON tidak valid");
      } finally {
        // reset supaya bisa pilih file yang sama lagi
        if (inputRef.current) inputRef.current.value = "";
      }
    };
    reader.readAsText(file);
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="secondary" onClick={download}>
        Export JSON
      </Button>

      <input
        ref={inputRef}
        type="file"
        accept="application/json"
        className="hidden"
        onChange={handleFile}
      />
      <Button variant="outline" onClick={() => inputRef.current?.click()}>
        Import (File)
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Import (Paste)</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import JSON</DialogTitle>
            <DialogDescription>
              Paste JSON kamu di bawah ini lalu klik <b>Import</b>.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            rows={12}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleImport}>Import</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
