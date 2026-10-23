import { useEffect, useRef, useState } from "react";
import { FileText, X, ChevronLeft, ChevronRight, RotateCcw, Loader2 } from "lucide-react";

// Lazily load pdfjs on the client only; configure a matching CDN worker so
// the browser can render pages without bundler worker glue.
async function loadPdfjs() {
  const pdfjs = await import("pdfjs-dist");
  // @ts-ignore - version is exposed at runtime
  const version = (pdfjs as any).version || "4.7.76";
  (pdfjs as any).GlobalWorkerOptions.workerSrc =
    `https://cdn.jsdelivr.net/npm/pdfjs-dist@${version}/build/pdf.worker.min.mjs`;
  return pdfjs;
}

type Props = {
  /** Absolute URL to the PDF (preview or unlocked). */
  src: string;
  /** Unique storage key (slug) used to remember resume page. */
  storageKey: string;
  /** Optional label shown above the gallery. */
  label?: string;
  /** Max thumbs to render (defaults to 8 for previews). */
  maxThumbs?: number;
  /** Force render all pages regardless of maxThumbs. */
  showAll?: boolean;
};

const RESUME_KEY = "tricube.materials.resume";

function readResume(): Record<string, number> {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(RESUME_KEY) || "{}") || {}; } catch { return {}; }
}
function writeResume(key: string, page: number) {
  const all = readResume();
  all[key] = page;
  localStorage.setItem(RESUME_KEY, JSON.stringify(all));
}
export function getResumePage(key: string): number | null {
  const p = readResume()[key];
  return typeof p === "number" && p > 0 ? p : null;
}

export default function PdfPreviewGallery({ src, storageKey, label, maxThumbs = 8, showAll }: Props) {
  const [thumbs, setThumbs] = useState<string[]>([]);
  const [total, setTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [openPage, setOpenPage] = useState<number | null>(null);
  const [resume, setResume] = useState<number | null>(null);
  const cancelled = useRef(false);

  useEffect(() => {
    cancelled.current = false;
    setResume(getResumePage(storageKey));
    setThumbs([]);
    setTotal(null);
    setErr(null);
    setLoading(true);
    (async () => {
      try {
        const pdfjs = await loadPdfjs();
        const doc = await (pdfjs as any).getDocument({ url: src, withCredentials: false }).promise;
        if (cancelled.current) return;
        setTotal(doc.numPages);
        const count = showAll ? doc.numPages : Math.min(maxThumbs, doc.numPages);
        const out: string[] = [];
        for (let i = 1; i <= count; i++) {
          if (cancelled.current) return;
          const page = await doc.getPage(i);
          const viewport = page.getViewport({ scale: 0.35 });
          const canvas = document.createElement("canvas");
          canvas.width = Math.ceil(viewport.width);
          canvas.height = Math.ceil(viewport.height);
          const ctx = canvas.getContext("2d");
          if (!ctx) continue;
          await page.render({ canvasContext: ctx, viewport }).promise;
          out.push(canvas.toDataURL("image/jpeg", 0.7));
          setThumbs([...out]);
        }
      } catch (e: any) {
        if (!cancelled.current) setErr(e?.message || "Failed to load PDF preview");
      } finally {
        if (!cancelled.current) setLoading(false);
      }
    })();
    return () => { cancelled.current = true; };
  }, [src, maxThumbs, showAll, storageKey]);

  function open(page: number) {
    setOpenPage(page);
    writeResume(storageKey, page);
    setResume(page);
  }
  function close() { setOpenPage(null); }
  function step(delta: number) {
    if (openPage == null || total == null) return;
    const next = Math.min(total, Math.max(1, openPage + delta));
    if (next !== openPage) {
      setOpenPage(next);
      writeResume(storageKey, next);
      setResume(next);
    }
  }
  function clearResume() {
    const all = readResume();
    delete all[storageKey];
    localStorage.setItem(RESUME_KEY, JSON.stringify(all));
    setResume(null);
  }

  return (
    <div className="mt-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          {label && <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">{label}</h3>}
          <p className="mt-1 text-xs text-muted-foreground">
            {total ? `${total} page${total === 1 ? "" : "s"} · Tap a thumbnail to open the reader` : loading ? "Rendering thumbnails…" : ""}
          </p>
        </div>
        {resume != null && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => open(resume)}
              className="inline-flex items-center gap-2 rounded-full bg-[var(--gradient-gold)] px-4 py-2 text-xs font-semibold text-primary-foreground"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Resume page {resume}
            </button>
            <button onClick={clearResume} className="text-xs text-muted-foreground underline-offset-4 hover:underline">
              Clear
            </button>
          </div>
        )}
      </div>

      {err ? (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-xs text-destructive">
          <FileText className="h-4 w-4" /> {err}
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {thumbs.map((t, i) => {
            const page = i + 1;
            const isResume = resume === page;
            return (
              <button
                key={i}
                onClick={() => open(page)}
                className={`group relative overflow-hidden rounded-xl border bg-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                  isResume ? "border-primary ring-2 ring-primary/40" : "border-border"
                }`}
              >
                <img src={t} alt={`Page ${page}`} className="aspect-[3/4] w-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/70 to-transparent px-2 py-1.5 text-[11px] font-medium text-white">
                  <span>Page {page}</span>
                  {isResume && <span className="rounded-full bg-primary px-1.5 py-0.5 text-[10px] text-primary-foreground">Last read</span>}
                </div>
              </button>
            );
          })}
          {loading && thumbs.length < (showAll ? total ?? 0 : maxThumbs) && (
            <div className="grid aspect-[3/4] place-items-center rounded-xl border border-dashed border-border">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>
      )}

      {total != null && !showAll && total > thumbs.length && !loading && (
        <p className="mt-3 text-xs text-muted-foreground">
          Showing first {thumbs.length} of {total} pages.
        </p>
      )}

      {openPage != null && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/80 backdrop-blur">
          <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3 text-white">
            <div className="flex items-center gap-2 text-sm">
              <FileText className="h-4 w-4 text-primary" />
              <span>Page {openPage}{total ? ` / ${total}` : ""}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => step(-1)}
                disabled={openPage <= 1}
                className="grid h-8 w-8 place-items-center rounded-full border border-white/20 disabled:opacity-40"
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => step(1)}
                disabled={total != null && openPage >= total}
                className="grid h-8 w-8 place-items-center rounded-full border border-white/20 disabled:opacity-40"
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <button onClick={close} className="ml-2 grid h-8 w-8 place-items-center rounded-full bg-white/10" aria-label="Close">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
          <iframe
            key={openPage}
            title="PDF preview"
            src={`${src}#page=${openPage}&view=FitH`}
            className="flex-1 bg-white"
          />
        </div>
      )}
    </div>
  );
}