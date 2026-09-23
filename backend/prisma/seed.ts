import { PrismaClient, Role, EventStatus, CourseLevel } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPass = await bcrypt.hash(process.env.SEED_ADMIN_PASSWORD || "Admin@12345", 10);

  // Super admin + admin + trainer + students
  const superAdmin = await prisma.user.upsert({
    where: { email: process.env.SEED_ADMIN_EMAIL || "tricubedigitalsolutions@gmail.com" },
    update: {},
    create: {
      name: "TRI CUBE Admin",
      email: process.env.SEED_ADMIN_EMAIL || "tricubedigitalsolutions@gmail.com",
      passwordHash: adminPass,
      role: Role.super_admin,
      emailVerified: true,
      admin: { create: { title: "Founder" } },
    },
  });

  const trainer = await prisma.user.upsert({
    where: { email: "trainer@tricube.local" },
    update: {},
    create: { name: "Aditya R.", email: "trainer@tricube.local", passwordHash: adminPass, role: Role.trainer, emailVerified: true },
  });

  for (let i = 1; i <= 5; i++) {
    await prisma.user.upsert({
      where: { email: `student${i}@tricube.local` },
      update: {},
      create: {
        name: `Student ${i}`,
        email: `student${i}@tricube.local`,
        passwordHash: await bcrypt.hash("Student@123", 10),
        role: Role.student,
        emailVerified: true,
        student: { create: { college: "PES University", branch: "CSE", yearOfStudy: 3 } },
      },
    });
  }

  // Categories
  const cats = ["Programming", "Web", "Data", "AI", "Marketing"];
  for (const name of cats) {
    await prisma.courseCategory.upsert({
      where: { slug: name.toLowerCase() },
      update: {},
      create: { name, slug: name.toLowerCase() },
    });
  }

  // Courses
  const courseSeed = [
    { slug: "python-mastery", title: "Python Mastery", trainer: "Aditya R.", duration: "40 hrs", price: 7999, category: "programming", level: CourseLevel.beginner },
    { slug: "full-stack-mern", title: "Full Stack MERN", trainer: "Priya S.", duration: "72 hrs", price: 16999, category: "web", level: CourseLevel.intermediate },
    { slug: "data-science-pro", title: "Data Science Pro", trainer: "Rahul K.", duration: "96 hrs", price: 19999, category: "data", level: CourseLevel.advanced },
    { slug: "power-bi-analyst", title: "Power BI Analyst", trainer: "Sneha M.", duration: "28 hrs", price: 6999, category: "data", level: CourseLevel.beginner },
    { slug: "ai-prompt-eng", title: "AI & Prompt Engineering", trainer: "Kabir V.", duration: "24 hrs", price: 8999, category: "ai", level: CourseLevel.beginner },
    { slug: "java-spring", title: "Java + Spring Boot", trainer: "Meera J.", duration: "60 hrs", price: 14999, category: "programming", level: CourseLevel.intermediate },
    { slug: "sql-deep-dive", title: "SQL Deep Dive", trainer: "Rahul K.", duration: "20 hrs", price: 4999, category: "data", level: CourseLevel.beginner },
    { slug: "digital-marketing-360", title: "Digital Marketing 360", trainer: "Ishaan D.", duration: "32 hrs", price: 9999, category: "marketing", level: CourseLevel.beginner },
  ];
  for (const c of courseSeed) {
    const cat = await prisma.courseCategory.findUnique({ where: { slug: c.category } });
    await prisma.course.upsert({
      where: { slug: c.slug },
      update: {},
      create: {
        slug: c.slug,
        title: c.title,
        trainer: c.trainer,
        duration: c.duration,
        price: c.price,
        level: c.level,
        description: `Comprehensive ${c.title} program with live mentorship, projects and placement support.`,
        categoryId: cat?.id,
      },
    });
  }

  // Services
  const services = [
    { slug: "resume-review", title: "Resume Review by Expert", category: "Career", price: 499, offerPrice: 99, duration: "3–4 working days", features: "Upload your existing resume|Line-by-line expert notes|Delivered to your email", featured: true },
    { slug: "resume-revision", title: "Resume Revision", category: "Career", price: 1499, offerPrice: 799, duration: "3–4 working days", features: "Full rewrite|ATS-friendly|2 revisions" },
    { slug: "portfolio-linkedin", title: "Portfolio & LinkedIn Setup", category: "Career", price: 2999, offerPrice: 1799, duration: "5–7 working days", features: "Portfolio site|LinkedIn optimisation|GitHub polish" },
    { slug: "python-training", title: "Python Training", category: "Training", price: 12000, offerPrice: 7999, duration: "8 weeks", features: "Core + OOP|DSA basics|Live projects" },
    { slug: "sql-training", title: "SQL & Databases", category: "Training", price: 8000, offerPrice: 4999, duration: "4 weeks", features: "MySQL deep dive|Joins & indexing|Real datasets" },
    { slug: "java-fullstack", title: "Java Full Stack", category: "Training", price: 25000, offerPrice: 17999, duration: "16 weeks", features: "Spring Boot|React|MySQL|Deployment" },
    { slug: "mern-stack", title: "MERN Stack", category: "Training", price: 24000, offerPrice: 16999, duration: "14 weeks", features: "MongoDB|Express|React|Node" },
    { slug: "internship", title: "Internship Program", category: "Career", price: 5000, offerPrice: 2999, duration: "8 weeks", features: "Live client work|Certificate|LOR" },
    { slug: "digital-marketing", title: "Digital Marketing", category: "Marketing", price: 15000, offerPrice: 9999, duration: "8 weeks", features: "SEO|Ads|Analytics" },
  ];
  for (const s of services) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: {},
      create: { ...s, description: `${s.title} — mentor-led with real projects.`, active: true },
    });
  }

  // Events
  const events = [
    { slug: "ai-bootcamp-2026", title: "AI & Prompt Engineering Bootcamp", date: new Date("2026-08-15"), time: "10:00 AM IST", venue: "TRI CUBE HQ + Online", status: EventStatus.upcoming, description: "Hands-on bootcamp on AI agents and RAG." },
    { slug: "full-stack-hackathon", title: "48-Hour Full Stack Hackathon", date: new Date("2026-07-25"), time: "6:00 PM IST", venue: "Online", status: EventStatus.live, description: "48-hour sprint. Prizes worth ₹1L." },
    { slug: "data-careers-summit", title: "Data Careers Summit", date: new Date("2026-06-10"), time: "9:30 AM IST", venue: "TRI CUBE HQ", status: EventStatus.completed, description: "Recruiters, mocks and portfolio reviews." },
  ];
  for (const e of events) {
    await prisma.event.upsert({ where: { slug: e.slug }, update: {}, create: e });
  }

  // Testimonials
  const testimonials = [
    { name: "Ananya P.", role: "SDE-1, Fintech", quote: "TRI CUBE turned my confusion into a career." },
    { name: "Rohit S.", role: "Data Analyst", quote: "Power BI + SQL combo was practical from day one." },
    { name: "Meera K.", role: "AI Engineer Intern", quote: "Mentors reviewed every PR I opened." },
  ];
  for (const t of testimonials) {
    const exists = await prisma.testimonial.findFirst({ where: { name: t.name } });
    if (!exists) await prisma.testimonial.create({ data: t });
  }

  // FAQs
  const faqs = [
    { question: "Do I need prior coding experience?", answer: "No. Most courses start from fundamentals." },
    { question: "Are the certificates recognised?", answer: "Yes, QR-verifiable and accepted by 120+ hiring partners." },
    { question: "Do you offer EMI?", answer: "Yes, via Razorpay for eligible cards." },
    { question: "Refund policy?", answer: "Full refund within 7 days if <20% of the course is completed." },
  ];
  for (const f of faqs) {
    const exists = await prisma.fAQ.findFirst({ where: { question: f.question } });
    if (!exists) await prisma.fAQ.create({ data: f });
  }

  // Blogs
  const blogs = [
    { slug: "why-full-stack-in-2026", title: "Why Full Stack still wins in 2026", excerpt: "Playbook for a durable engineering career.", content: "# Full Stack in 2026\n\nContent...", category: "Career", authorName: "TRI CUBE" },
    { slug: "sql-cheatsheet", title: "The SQL cheatsheet every analyst needs", excerpt: "20% that solves 80% of problems.", content: "# SQL", category: "Data", authorName: "TRI CUBE" },
  ];
  for (const b of blogs) {
    await prisma.blog.upsert({ where: { slug: b.slug }, update: {}, create: b });
  }

  console.log("Seed complete. Super admin:", superAdmin.email);
}

// Seed materials + a starter bundle so /materials renders live from DB.
async function seedMaterials() {
  const materials = [
    { slug: "python-interview-notes", title: "Python Interview Notes", category: "Interview Prep", price: 199, pages: 48, rating: 4.9, description: "Curated Python interview questions with answers, patterns, and gotchas.", highlights: "100+ Q&A|OOP + data model|Async & GIL deep dive|Real interview transcripts", featured: true },
    { slug: "dsa-cheatsheet", title: "DSA Cheatsheet (Big-O + Patterns)", category: "Interview Prep", price: 149, pages: 22, rating: 4.8, description: "Every pattern you need for coding rounds on one printable PDF.", highlights: "All 14 patterns|Complexity table|Template code|Sample problems" },
    { slug: "sql-handbook", title: "SQL Handbook for Analysts", category: "Data", price: 249, pages: 62, rating: 4.9, description: "Joins, windows, indexes, tuning — with real datasets and exercises.", highlights: "50+ solved queries|Window functions|Index tuning|Dataset downloads" },
    { slug: "resume-templates", title: "ATS Resume Template Pack", category: "Career", price: 99, pages: 12, rating: 4.7, description: "3 recruiter-approved ATS-friendly resume templates with rewrite examples.", highlights: "3 templates|Before/after examples|Bullet formulas|LinkedIn tune-up" },
    { slug: "system-design-primer", title: "System Design Primer", category: "Interview Prep", price: 299, pages: 84, rating: 4.9, description: "10 real system design case studies broken down step-by-step.", highlights: "10 case studies|Capacity math|Trade-off matrix|Diagram library", featured: true },
    { slug: "react-patterns", title: "React Patterns in Production", category: "Web", price: 199, pages: 40, rating: 4.8, description: "Composition, hooks, state, performance — patterns from real codebases.", highlights: "12 patterns|Perf checklist|Testing recipes|Migration tips" },
    { slug: "ml-quickstart", title: "ML Quickstart with scikit-learn", category: "Data", price: 179, pages: 36, rating: 4.7, description: "From CSV to trained model in one weekend. No math PhD required.", highlights: "End-to-end pipeline|Feature engineering|Model tuning|Deploy notes" },
    { slug: "aptitude-formula-book", title: "Aptitude Formula Book", category: "Career", price: 79, pages: 28, rating: 4.6, description: "All quant + logical reasoning formulas placement panels test on.", highlights: "All formulas|Shortcut tricks|Practice sets|Answer keys" },
  ];
  for (const m of materials) {
    await (prisma as any).material.upsert({ where: { slug: m.slug }, update: {}, create: m });
  }
  const interviewPrep = await (prisma as any).material.findMany({ where: { category: "Interview Prep" } });
  const existing = await (prisma as any).bundle.findUnique({ where: { slug: "interview-prep-pack" } });
  if (!existing && interviewPrep.length >= 2) {
    await (prisma as any).bundle.create({
      data: {
        slug: "interview-prep-pack",
        title: "Interview Prep Mega Pack",
        description: "Every interview prep PDF in one bundle. Save 30% vs buying individually.",
        price: Math.round(interviewPrep.reduce((s: number, x: any) => s + x.price, 0) * 0.7),
        featured: true,
        items: { create: interviewPrep.map((m: any) => ({ materialId: m.id })) },
      },
    });
  }
}

main()
  .then(seedMaterials)
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());