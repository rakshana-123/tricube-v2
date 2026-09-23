import { Router } from "express";
import { prisma } from "../db.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const r = Router();
r.use(requireAuth, requireRole("admin", "super_admin"));

r.get("/dashboard", async (_req, res) => {
  const [
    students,
    admins,
    courses,
    publishedCourses,
    services,
    materials,
    bundles,
    events,
    upcomingEvents,
    blogs,
    galleryItems,
    testimonials,
    faqs,
    orders,
    paidOrders,
    materialOrdersPaid,
    serviceRequests,
    pendingRequests,
    contactMessages,
    unreadMessages,
    newsletter,
    certificates,
    courseRevenueAgg,
    materialRevenueAgg,
    serviceRevenueAgg,
    recentPayments,
    recentOrders,
    recentRequests,
    recentUsers,
  ] = await Promise.all([
    prisma.user.count({ where: { role: "student" } }),
    prisma.user.count({ where: { role: { in: ["admin", "super_admin"] } } }),
    prisma.course.count(),
    prisma.course.count({ where: { published: true } }),
    prisma.service.count(),
    prisma.material.count(),
    prisma.bundle.count(),
    prisma.event.count(),
    prisma.event.count({ where: { status: "upcoming" } }),
    prisma.blog.count(),
    prisma.gallery.count(),
    prisma.testimonial.count(),
    prisma.fAQ.count(),
    prisma.order.count(),
    prisma.order.count({ where: { status: "paid" } }),
    prisma.materialOrder.count({ where: { status: "paid" } }),
    prisma.serviceRequest.count(),
    prisma.serviceRequest.count({ where: { status: { in: ["pending", "paid", "in_review"] } } }),
    prisma.contactMessage.count(),
    prisma.contactMessage.count({ where: { read: false } }),
    prisma.newsletterSubscriber.count(),
    prisma.certificate.count(),
    prisma.payment.aggregate({ _sum: { amount: true }, where: { status: "paid" } }),
    prisma.materialOrder.aggregate({ _sum: { amount: true }, where: { status: "paid" } }),
    prisma.serviceRequest.aggregate({ _sum: { amount: true }, where: { status: { in: ["paid", "in_review", "delivered"] } } }),
    prisma.payment.findMany({ orderBy: { createdAt: "desc" }, take: 5, include: { user: { select: { name: true, email: true } }, order: { include: { course: { select: { title: true } } } } } }),
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 5, include: { user: { select: { name: true, email: true } }, course: { select: { title: true } } } }),
    prisma.serviceRequest.findMany({ orderBy: { createdAt: "desc" }, take: 5, select: { id: true, serviceTitle: true, name: true, email: true, status: true, amount: true, createdAt: true } }),
    prisma.user.findMany({ where: { role: "student" }, orderBy: { createdAt: "desc" }, take: 5, select: { id: true, name: true, email: true, createdAt: true } }),
  ]);

  const courseRevenue = courseRevenueAgg._sum.amount || 0;
  const materialRevenue = materialRevenueAgg._sum.amount || 0;
  const serviceRevenue = serviceRevenueAgg._sum.amount || 0;

  res.json({
    stats: {
      students,
      admins,
      courses,
      publishedCourses,
      services,
      materials,
      bundles,
      events,
      upcomingEvents,
      blogs,
      galleryItems,
      testimonials,
      faqs,
      orders,
      paidOrders,
      materialOrdersPaid,
      serviceRequests,
      pendingRequests,
      contactMessages,
      unreadMessages,
      newsletter,
      certificates,
      revenue: courseRevenue + materialRevenue + serviceRevenue,
      courseRevenue,
      materialRevenue,
      serviceRevenue,
    },
    recent: {
      payments: recentPayments,
      orders: recentOrders,
      requests: recentRequests,
      users: recentUsers,
    },
  });
});

r.get("/students", async (_req, res) => {
  const students = await prisma.user.findMany({ where: { role: "student" }, include: { student: true }, orderBy: { createdAt: "desc" } });
  res.json({ students });
});

r.get("/payments", async (_req, res) => {
  const payments = await prisma.payment.findMany({ include: { user: true, order: { include: { course: true } } }, orderBy: { createdAt: "desc" } });
  res.json({ payments });
});

r.get("/activity", async (_req, res) => {
  const logs = await prisma.activityLog.findMany({ orderBy: { createdAt: "desc" }, take: 200, include: { user: true } });
  res.json({ logs });
});

r.get("/email-logs", async (_req, res) => res.json({ logs: await prisma.emailLog.findMany({ orderBy: { createdAt: "desc" }, take: 200 }) }));

export default r;
