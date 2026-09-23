import { Router } from "express";
import { prisma } from "../db.js";
import { requireAuth, requireRole, AuthedRequest } from "../middleware/auth.js";
import path from "node:path";
import { upload } from "../config/upload.js";

const r = Router();

// List courses the authenticated user has purchased, with progress + next video.
r.get("/me/enrolled", requireAuth, async (req: AuthedRequest, res) => {
  const orders = await prisma.order.findMany({
    where: { userId: req.user!.id, status: "paid", courseId: { not: null } },
    include: {
      course: {
        include: {
          category: true,
          modules: { orderBy: { position: "asc" }, include: { videos: { orderBy: { position: "asc" } } } },
          videos: { orderBy: { position: "asc" } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const progress = await prisma.courseProgress.findMany({ where: { userId: req.user!.id } });
  const seen = new Set<number>();
  const enrolled = orders
    .filter((o) => o.course && !seen.has(o.course.id) && (seen.add(o.course.id), true))
    .map((o) => {
      const course = o.course!;
      const allVideos = course.modules.flatMap((m) => m.videos.map((v) => ({ ...v, moduleTitle: m.title })));
      // Fall back to standalone videos when the course has no modules
      const flatVideos = allVideos.length ? allVideos : course.videos.map((v) => ({ ...v, moduleTitle: null as string | null }));
      const progressByVideo = new Map(
        progress.filter((p) => p.courseId === course.id && p.videoId != null).map((p) => [p.videoId!, p]),
      );
      const completedCount = flatVideos.filter((v) => progressByVideo.get(v.id)?.completed).length;
      const totalCount = flatVideos.length;
      const percent = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;
      const nextVideo =
        flatVideos.find((v) => !progressByVideo.get(v.id)?.completed) ?? flatVideos[0] ?? null;
      const lastProgress = progress
        .filter((p) => p.courseId === course.id)
        .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())[0];

      return {
        id: course.id,
        slug: course.slug,
        title: course.title,
        thumbnailUrl: course.thumbnailUrl,
        trainer: course.trainer,
        duration: course.duration,
        level: course.level,
        category: course.category?.name ?? null,
        enrolledAt: o.createdAt,
        totalVideos: totalCount,
        completedVideos: completedCount,
        percent,
        lastActivityAt: lastProgress?.updatedAt ?? null,
        nextVideo: nextVideo
          ? {
              id: nextVideo.id,
              title: nextVideo.title,
              moduleTitle: (nextVideo as any).moduleTitle ?? null,
              position: nextVideo.position,
              durationSec: nextVideo.durationSec,
            }
          : null,
      };
    });

  res.json({ enrolled });
});

r.get("/", async (req, res) => {
  const { q, category } = req.query as any;
  const where: any = { published: true };
  if (q) where.title = { contains: String(q) };
  if (category) {
    const c = String(category);
    where.category = { is: { OR: [{ slug: c }, { name: c }] } };
  }
  const courses = await prisma.course.findMany({ where, include: { category: true } });
  res.json({ courses });
});

// Admin CRUD
// ============= Admin =============
const adminOnly = [requireAuth, requireRole("admin", "super_admin")] as const;

// GET /api/courses/admin/all — every course incl. drafts with modules/videos
r.get("/admin/all", ...adminOnly, async (_req, res) => {
  const courses = await prisma.course.findMany({
    orderBy: [{ updatedAt: "desc" }],
    include: {
      category: true,
      modules: {
        orderBy: { position: "asc" },
        include: { videos: { orderBy: { position: "asc" } } },
      },
      videos: { orderBy: { position: "asc" } },
    },
  });
  res.json({ courses });
});

// GET /api/courses/admin/categories — list categories for the picker
r.get("/admin/categories", ...adminOnly, async (_req, res) => {
  const categories = await prisma.courseCategory.findMany({ orderBy: { name: "asc" } });
  res.json({ categories });
});

type ModuleInput = {
  id?: number;
  title: string;
  position?: number;
  videos?: VideoInput[];
};
type VideoInput = {
  id?: number;
  title: string;
  url: string;
  durationSec?: number;
  position?: number;
  isFreePreview?: boolean;
  pdfUrl?: string | null;
};

function bool(v: any, d = false) {
  if (v === undefined || v === null || v === "") return d;
  return v === true || v === "true" || v === 1 || v === "1";
}
function num(v: any, d = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : d;
}

function parseCourseBody(body: any) {
  const data: any = {
    slug: body.slug?.toString().trim(),
    title: body.title?.toString().trim(),
    trainer: body.trainer?.toString() || "",
    description: body.description?.toString() || "",
    duration: body.duration?.toString() || "",
    level: (body.level?.toString() || "beginner") as any,
    price: num(body.price, 0),
    discount: num(body.discount, 0),
    learningOutcomes: body.learningOutcomes?.toString() || null,
    published: bool(body.published, true),
  };
  if (body.categoryId !== undefined && body.categoryId !== "" && body.categoryId !== null) {
    data.categoryId = num(body.categoryId, 0) || null;
  }
  if (typeof body.thumbnailUrl === "string") data.thumbnailUrl = body.thumbnailUrl || null;
  return data;
}

async function syncCurriculum(courseId: number, modulesInput: ModuleInput[] | undefined) {
  if (!Array.isArray(modulesInput)) return;
  const existingModules = await prisma.courseModule.findMany({
    where: { courseId },
    include: { videos: true },
  });
  const keepModuleIds = new Set<number>();
  const keepVideoIds = new Set<number>();

  for (let mi = 0; mi < modulesInput.length; mi++) {
    const m = modulesInput[mi];
    let moduleId = m.id;
    if (moduleId && existingModules.some((x) => x.id === moduleId)) {
      await prisma.courseModule.update({
        where: { id: moduleId },
        data: { title: m.title, position: m.position ?? mi },
      });
    } else {
      const created = await prisma.courseModule.create({
        data: { courseId, title: m.title, position: m.position ?? mi },
      });
      moduleId = created.id;
    }
    keepModuleIds.add(moduleId);

    const videos = m.videos || [];
    for (let vi = 0; vi < videos.length; vi++) {
      const v = videos[vi];
      if (v.id) {
        await prisma.courseVideo.update({
          where: { id: v.id },
          data: {
            title: v.title,
            url: v.url,
            durationSec: num(v.durationSec, 0),
            position: v.position ?? vi,
            isFreePreview: !!v.isFreePreview,
            pdfUrl: v.pdfUrl || null,
            moduleId,
          },
        });
        keepVideoIds.add(v.id);
      } else {
        const created = await prisma.courseVideo.create({
          data: {
            courseId,
            moduleId,
            title: v.title,
            url: v.url,
            durationSec: num(v.durationSec, 0),
            position: v.position ?? vi,
            isFreePreview: !!v.isFreePreview,
            pdfUrl: v.pdfUrl || null,
          },
        });
        keepVideoIds.add(created.id);
      }
    }
  }

  // Delete videos & modules that were removed in the edit
  const allExistingVideoIds = existingModules.flatMap((m) => m.videos.map((v) => v.id));
  const removedVideoIds = allExistingVideoIds.filter((id) => !keepVideoIds.has(id));
  if (removedVideoIds.length) {
    await prisma.courseVideo.deleteMany({ where: { id: { in: removedVideoIds } } });
  }
  const removedModuleIds = existingModules.map((m) => m.id).filter((id) => !keepModuleIds.has(id));
  if (removedModuleIds.length) {
    await prisma.courseModule.deleteMany({ where: { id: { in: removedModuleIds } } });
  }
}

// POST /api/courses — create a course (JSON, with optional nested modules/videos)
r.post("/", ...adminOnly, async (req, res) => {
  const data = parseCourseBody(req.body);
  if (!data.slug || !data.title) {
    return res.status(400).json({ error: "slug and title are required" });
  }
  const exists = await prisma.course.findUnique({ where: { slug: data.slug } });
  if (exists) return res.status(409).json({ error: "A course with this slug already exists" });
  const course = await prisma.course.create({ data });
  if (Array.isArray(req.body.modules)) {
    await syncCurriculum(course.id, req.body.modules);
  }
  const full = await prisma.course.findUnique({
    where: { id: course.id },
    include: {
      category: true,
      modules: { orderBy: { position: "asc" }, include: { videos: { orderBy: { position: "asc" } } } },
    },
  });
  res.json({ course: full });
});

// PUT /api/courses/:id — update a course (JSON, with optional nested modules/videos)
r.put("/:id", ...adminOnly, async (req, res) => {
  const id = Number(req.params.id);
  const data = parseCourseBody(req.body);
  // Only include fields the client actually sent
  const patch: any = {};
  for (const k of Object.keys(data)) {
    if (req.body[k] !== undefined) patch[k] = (data as any)[k];
  }
  await prisma.course.update({ where: { id }, data: patch });
  if (Array.isArray(req.body.modules)) {
    await syncCurriculum(id, req.body.modules);
  }
  const full = await prisma.course.findUnique({
    where: { id },
    include: {
      category: true,
      modules: { orderBy: { position: "asc" }, include: { videos: { orderBy: { position: "asc" } } } },
    },
  });
  res.json({ course: full });
});

// PATCH /api/courses/:id/publish — toggle published
r.patch("/:id/publish", ...adminOnly, async (req, res) => {
  const id = Number(req.params.id);
  const cur = await prisma.course.findUnique({ where: { id } });
  if (!cur) return res.status(404).json({ error: "Not found" });
  const course = await prisma.course.update({
    where: { id },
    data: { published: !cur.published },
  });
  res.json({ course });
});

// POST /api/courses/:id/thumbnail — multipart upload
r.post("/:id/thumbnail", ...adminOnly, upload.single("image"), async (req, res) => {
  const id = Number(req.params.id);
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  const thumbnailUrl = `/uploads/${path.basename(req.file.filename)}`;
  const course = await prisma.course.update({ where: { id }, data: { thumbnailUrl } });
  res.json({ course });
});

// DELETE /api/courses/:id — refuses if paid orders reference the course
r.delete("/:id", ...adminOnly, async (req, res) => {
  const id = Number(req.params.id);
  const paidOrders = await prisma.order.count({ where: { courseId: id, status: "paid" } });
  if (paidOrders > 0) {
    return res
      .status(409)
      .json({ error: `Cannot delete: ${paidOrders} paid order(s) reference this course. Unpublish instead.` });
  }
  await prisma.course.delete({ where: { id } });
  res.json({ ok: true });
});

r.get("/:slug", async (req, res) => {
  const course = await prisma.course.findUnique({
    where: { slug: req.params.slug },
    include: { category: true, modules: { include: { videos: true }, orderBy: { position: "asc" } }, videos: { orderBy: { position: "asc" } } },
  });
  if (!course || !course.published) return res.status(404).json({ error: "Course not found" });
  const safeVideo = (v: any) => ({
    id: v.id,
    title: v.title,
    durationSec: v.durationSec,
    position: v.position,
    isFreePreview: v.isFreePreview,
    url: v.isFreePreview ? v.url : null,
    pdfUrl: null,
    moduleId: v.moduleId,
  });
  res.json({
    course: {
      ...course,
      modules: course.modules.map((m) => ({ ...m, videos: m.videos.map(safeVideo) })),
      videos: course.videos.map(safeVideo),
    },
  });
});

r.get("/:slug/videos", requireAuth, async (req: AuthedRequest, res) => {
  const course = await prisma.course.findUnique({ where: { slug: req.params.slug } });
  if (!course) return res.status(404).json({ error: "Not found" });
  const paid = await prisma.order.findFirst({ where: { userId: req.user!.id, courseId: course.id, status: "paid" } });
  if (!paid && req.user!.role !== "admin" && req.user!.role !== "super_admin")
    return res.status(402).json({ error: "Purchase required" });
  const videos = await prisma.courseVideo.findMany({ where: { courseId: course.id }, orderBy: { position: "asc" } });
  res.json({ videos });
});

r.post("/:slug/progress", requireAuth, async (req: AuthedRequest, res) => {
  const course = await prisma.course.findUnique({ where: { slug: req.params.slug } });
  if (!course) return res.status(404).json({ error: "Not found" });
  const { videoId, watchedSec, completed } = req.body || {};
  const p = await prisma.courseProgress.upsert({
    where: { userId_courseId_videoId: { userId: req.user!.id, courseId: course.id, videoId: videoId ?? null } },
    create: { userId: req.user!.id, courseId: course.id, videoId: videoId ?? null, watchedSec: Number(watchedSec || 0), completed: !!completed },
    update: { watchedSec: Number(watchedSec || 0), completed: !!completed },
  });
  res.json({ progress: p });
});

export default r;
