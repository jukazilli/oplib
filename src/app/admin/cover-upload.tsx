"use client";

import { upload } from "@vercel/blob/client";
import Image from "next/image";
import { useRef, useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { adminSignInUrl } from "@/modules/identity/redirect";
import { validateCoverFile } from "@/modules/media/cover-policy";

type UploadedCover = { pathname: string; url: string };

export function CoverUpload() {
  const formRef = useRef<HTMLFormElement>(null);
  const [cover, setCover] = useState<UploadedCover | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsUploading(true);
    setMessage(null);

    try {
      const file = new FormData(event.currentTarget).get("file");
      if (!(file instanceof File))
        throw new Error("Selecione uma imagem válida.");

      await validateCoverFile(file);
      const pathnameResponse = await fetch("/api/admin/covers/pathname", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentType: file.type }),
      });
      const prepared = (await pathnameResponse.json()) as {
        pathname?: string;
        error?: string;
      };

      if (pathnameResponse.status === 401) {
        window.location.assign(adminSignInUrl(window.location.pathname, true));
        return;
      }

      if (!pathnameResponse.ok || !prepared.pathname) {
        throw new Error(prepared.error ?? "Não foi possível preparar o envio.");
      }

      const blob = await upload(prepared.pathname, file, {
        access: "public",
        contentType: file.type,
        handleUploadUrl: "/api/admin/covers",
      });

      setCover(blob);
      setMessage("Capa enviada.");
      formRef.current?.reset();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Não foi possível enviar a capa.",
      );
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <section className="mt-12 grid max-w-2xl gap-5 rounded-card border bg-surface p-5 sm:p-7">
      <div>
        <h2 className="font-editorial text-2xl font-medium">Nova capa</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          JPEG, PNG, WebP ou AVIF · até 5 MB
        </p>
      </div>
      <form
        ref={formRef}
        className="flex flex-wrap gap-3"
        onSubmit={handleSubmit}
      >
        <input
          className="min-h-11 min-w-0 flex-1 rounded-control border bg-background px-3 py-2 text-sm file:mr-3 file:border-0 file:bg-transparent file:font-semibold"
          type="file"
          name="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          required
        />
        <Button type="submit" disabled={isUploading}>
          {isUploading ? "Enviando…" : "Enviar capa"}
        </Button>
      </form>
      {message ? (
        <p className="text-sm text-muted-foreground" role="status">
          {message}
        </p>
      ) : null}
      {cover ? (
        <Image
          className="h-auto w-full rounded-card border object-cover"
          src={cover.url}
          alt="Prévia da capa enviada"
          width={960}
          height={540}
          sizes="(max-width: 768px) 100vw, 672px"
        />
      ) : null}
    </section>
  );
}
