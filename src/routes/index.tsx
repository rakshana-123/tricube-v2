import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowRight, Sparkles, Star, PlayCircle, CheckCircle2, MapPin, ChevronDown } from "lucide-react";
import { COMPANY, STATS, WHY_US, EVENTS, PARTNERS } from "@/lib/site-data";
import { listEvents, type EventDTO } from "@/lib/events-api";
import { listCourses, type CourseDTO } from "@/lib/courses-api";
import { listTestimonials, listFaqs, listGallery, listBlogs, type TestimonialDTO, type FAQDTO, type GalleryDTO, type BlogDTO } from "@/lib/content-api";
import { SectionHeading } from "@/components/site/SectionHeading";
import { StatCounter } from "@/components/site/StatCounter";
import logoAsset from "@/assets/tricube-logo.jpeg.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TRI CUBE Digital Solutions â€” Premium IT Training & LMS" },
      { name: "description", content: "Live cohort training, real internships, verified certificates. Learn Python, MERN, Data Science, AI and more at TRI CUBE." },
    ],
  }),
  component: Index,
});

function Index() {
  const [courses, setCourses] = useState<CourseDTO[]>([]);
  const [events, setEvents] = useState<EventDTO[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialDTO[]>([]);
  const [faqs, setFaqs] = useState<FAQDTO[]>([]);
  const [blogs, setBlogs] = useState<BlogDTO[]>([]);
  const [gallery, setGallery] = useState<GalleryDTO[]>([]);

  useEffect(() => {
    // Fetch data for homepage
    listCourses().then(res => setCourses(res.items.slice(0, 3))).catch(() => {});
    listEvents().then(res => setEvents(res.items.slice(0, 3))).catch(() => {});
    listTestimonials().then(res => setTestimonials(res.items.slice(0, 4))).catch(() => {});
    listFaqs().then(res => setFaqs(res.items)).catch(() => {});
    listBlogs().then(res => setBlogs(res.items.slice(0, 3))).catch(() => {});
    listGallery().then(res => setGallery(res.items.slice(0, 4))).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden hero-bg pt-32 pb-28 md:pt-48 md:pb-40 flex flex-col items-center justify-center text-center px-4">
        {/* Animated Blobs */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }} 
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -top-32 -left-32 w-96 h-96 bg-[var(--teal-soft)] opacity-20 blur-[100px] rounded-full pointer-events-none"
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], rotate: [0, -90, 0] }} 
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 -right-32 w-[30rem] h-[30rem] bg-indigo-500 opacity-20 blur-[120px] rounded-full pointer-events-none"
        />

        <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
          <div className="neo-card p-4 rounded-full mb-8 inline-flex items-center justify-center bg-background/50 shadow-[0_0_40px_rgba(212,175,55,0.3)]">
            <img src={logoAsset.url} alt="TRI CUBE Logo" className="h-16 w-16 rounded-full object-cover" />
          </div>
          
          <div className="neo-badge mb-8 flex items-center gap-2 text-sm px-4 py-2">
            <Sparkles className="w-4 h-4 text-[var(--teal)]" />
            <span>New cohorts open Â· Aug 2026</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-semibold tracking-[-0.035em] leading-[1.02] text-foreground mb-6">
            Learn. Build. <br className="hidden md:block" />
            <span className="teal-text">Launch.</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mb-10 leading-relaxed font-light">
            Premium IT training, live cohorts, and real-world internships designed to accelerate your tech career.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 mb-12">
            <Link to="/courses" className="neo-btn-primary px-8 py-4 text-lg font-medium w-full sm:w-auto text-center rounded-2xl flex items-center justify-center gap-2">
              Explore courses <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/services" className="neo-btn px-8 py-4 text-lg font-medium w-full sm:w-auto text-center rounded-2xl flex items-center justify-center gap-2">
              Our services <PlayCircle className="w-5 h-5" />
            </Link>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground neo-card px-6 py-3 rounded-full">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-[var(--teal)] text-[var(--teal)]" />
              ))}
            </div>
            <span>4.9/5 Â· 4,200+ students</span>
          </div>
        </div>
      </section>

      {/* Marquee / Partners Strip */}
      <section className="px-4 -mt-10 relative z-20 max-w-7xl mx-auto">
        <div className="neo-inset rounded-3xl py-6 px-8 flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden bg-background">
          <p className="font-semibold text-muted-foreground whitespace-nowrap uppercase tracking-wider text-sm">Hiring Partners</p>
          <div className="flex items-center gap-12 overflow-x-auto no-scrollbar w-full md:w-auto pb-4 md:pb-0">
            {PARTNERS.map((partner, i) => (
              <span key={i} className="text-xl font-bold text-muted-foreground/50 whitespace-nowrap">{partner}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-28 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((stat, i) => (
            <div key={i} className="neo-card p-8 rounded-3xl flex flex-col items-center justify-center text-center transition-transform hover:-translate-y-2 duration-300">
              <span className="text-5xl md:text-6xl font-bold teal-text mb-2 tracking-tighter">
                <StatCounter value={parseInt(stat.value.replace(/[^0-9]/g, '')) || 0} />
                {stat.value.replace(/[0-9]/g, '')}
              </span>
              <span className="text-sm md:text-base text-muted-foreground font-medium uppercase tracking-wide">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-28 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          <SectionHeading title="Our Purpose" align="center" subtitle="Why we do what we do" />
          <div className="grid md:grid-cols-2 gap-8 mt-16">
            <div className="neo-card p-10 md:p-14 rounded-3xl relative overflow-hidden group">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[var(--teal)] to-[var(--teal-soft)]" />
              <div className="neo-badge inline-block mb-6 bg-[var(--teal-soft)]/10 text-[var(--teal)] border-none">VISION</div>
              <h3 className="text-2xl md:text-3xl font-semibold leading-snug text-foreground">
                To be the global leader in shaping the future of IT education.
              </h3>
              <p className="mt-6 text-muted-foreground text-lg leading-relaxed">
                Empowering individuals with cutting-edge digital skills, transforming them into innovators who drive tomorrow's technological advancements.
              </p>
            </div>
            <div className="neo-card p-10 md:p-14 rounded-3xl relative overflow-hidden group">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[var(--teal)] to-[var(--teal-soft)]" />
              <div className="neo-badge inline-block mb-6 bg-[var(--teal-soft)]/10 text-[var(--teal)] border-none">MISSION</div>
              <h3 className="text-2xl md:text-3xl font-semibold leading-snug text-foreground">
                Bridging the gap between academia and industry.
              </h3>
              <p className="mt-6 text-muted-foreground text-lg leading-relaxed">
                We deliver world-class training and real-world internships, creating a continuous pipeline of highly skilled, industry-ready professionals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Us (Feature Grid) */}
      <section className="py-32 px-4 max-w-7xl mx-auto">
        <SectionHeading title="Why TRI CUBE?" align="center" subtitle="The advantage of learning with us" />
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          {WHY_US.map((feature, i) => (
            <div key={i} className="neo-card p-10 rounded-3xl transition-all duration-300 hover:-translate-y-2 hover:shadow-neo-card flex flex-col items-start">
              <div className="neo-btn-primary w-16 h-16 rounded-full flex items-center justify-center mb-8">
                <CheckCircle2 className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-bold mb-4">{feature.title}</h4>
              <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Courses */}
      <section className="py-32 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <SectionHeading title="Popular Courses" subtitle="Start your journey today" align="left" />
          <Link to="/courses" className="teal-text font-semibold flex items-center gap-2 hover:opacity-80 transition-opacity pb-2">
            All courses <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div key={course.id} className="neo-card rounded-3xl overflow-hidden flex flex-col group">
              <div className="aspect-video relative overflow-hidden bg-muted">
                {course.thumbnail ? (
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50" />
                )}
                <div className="absolute top-4 left-4 neo-badge bg-background/80 backdrop-blur-md border-none">{course.category}</div>
              </div>
              <div className="p-8 flex flex-col flex-1">
                <h4 className="text-2xl font-bold mb-3 line-clamp-2">{course.title}</h4>
                <div className="flex items-center gap-2 mb-6">
                  <Star className="w-4 h-4 text-[var(--teal)] fill-[var(--teal)]" />
                  <span className="text-sm font-medium">{course.rating || "4.8"}</span>
                  <span className="text-muted-foreground text-sm">({course.reviews || 120} reviews)</span>
                </div>
                <div className="mt-auto flex items-center justify-between pt-6 border-t border-border/50">
                  <span className="text-xl font-bold">${course.price}</span>
                  <Link to={`/courses/${course.id}`} className="neo-btn-primary px-5 py-2 rounded-full text-sm font-medium">
                    View
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Events Section */}
      <section className="py-32 px-4 neo-inset my-10 mx-4 md:mx-auto max-w-7xl rounded-[3rem]">
        <SectionHeading title="Upcoming Events" align="center" subtitle="Join our workshops and webinars" />
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          {events.map((event) => (
            <div key={event.id} className="neo-card p-6 rounded-3xl flex flex-col group">
              <div className="aspect-video rounded-2xl overflow-hidden mb-6 relative">
                {event.thumbnail ? (
                  <img src={event.thumbnail} alt={event.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20" />
                )}
                <div className="absolute top-3 right-3 neo-badge bg-background/90 text-xs py-1 px-3">
                  {event.status}
                </div>
              </div>
              <h4 className="text-xl font-bold mb-3">{event.title}</h4>
              <p className="text-muted-foreground text-sm mb-6 flex-1 line-clamp-2">{event.description}</p>
              <div className="flex flex-col gap-3 text-sm font-medium mb-6">
                <div className="flex items-center gap-2 text-[var(--teal)]">
                  <div className="w-8 h-8 rounded-full neo-inset flex items-center justify-center">
                    <span className="text-xs">ðŸ“…</span>
                  </div>
                  {new Date(event.startDate).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <div className="w-8 h-8 rounded-full neo-inset flex items-center justify-center">
                    <MapPin className="w-4 h-4" />
                  </div>
                  {event.venue || "Online"}
                </div>
              </div>
              <Link to={`/events/${event.id}`} className="teal-text font-semibold flex items-center justify-center gap-2 mt-auto hover:opacity-80 py-2">
                Register <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 px-4 max-w-7xl mx-auto">
        <SectionHeading title="Student Success" align="center" subtitle="Hear from our alumni" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          {testimonials.map((test, i) => (
            <div key={i} className="neo-card p-8 rounded-3xl flex flex-col">
              <div className="flex items-center gap-1 mb-6">
                {[...Array(test.rating || 5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[var(--teal)] text-[var(--teal)]" />
                ))}
              </div>
              <p className="italic text-muted-foreground mb-8 flex-1 leading-relaxed">
                "{test.content}"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full neo-inset bg-muted overflow-hidden">
                  {test.avatar && <img src={test.avatar} alt={test.authorName} className="w-full h-full object-cover" />}
                </div>
                <div>
                  <p className="font-bold text-sm">{test.authorName}</p>
                  <p className="text-xs text-muted-foreground">{test.authorRole}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Latest Blog */}
      <section className="py-28 px-4 max-w-7xl mx-auto">
        <SectionHeading title="Latest Insights" align="left" subtitle="From our blog" />
        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {blogs.map((blog) => (
            <Link key={blog.id} to={`/blog/${blog.id}`} className="neo-card p-6 rounded-3xl group cursor-pointer block">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-6 relative">
                {blog.coverImage ? (
                  <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full bg-muted" />
                )}
                <div className="absolute top-4 left-4 neo-badge bg-background/80 backdrop-blur-md">{blog.category}</div>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{new Date(blog.publishedAt).toLocaleDateString()}</p>
              <h4 className="text-xl font-bold mb-3 group-hover:text-[var(--teal)] transition-colors">{blog.title}</h4>
              <p className="text-muted-foreground line-clamp-2">{blog.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="py-28 px-4 max-w-7xl mx-auto">
        <SectionHeading title="Life at TRI CUBE" align="center" subtitle="A glimpse into our campus and culture" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
          {gallery.map((img) => (
            <div key={img.id} className="neo-card p-2 rounded-2xl overflow-hidden group">
              <div className="aspect-square rounded-xl overflow-hidden">
                <img src={img.url} alt={img.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-32 px-4 max-w-3xl mx-auto">
        <SectionHeading title="Common Questions" align="center" subtitle="Everything you need to know" />
        <div className="mt-16 space-y-6">
          {faqs.map((faq) => (
            <details key={faq.id} className="neo-card rounded-2xl group cursor-pointer overflow-hidden marker:content-['']">
              <summary className="px-8 py-6 flex items-center justify-between font-semibold text-lg outline-none select-none">
                {faq.question}
                <div className="w-8 h-8 rounded-full neo-inset flex items-center justify-center shrink-0 transition-transform duration-300 group-open:rotate-45">
                  <span className="text-[var(--teal)] text-xl leading-none font-light">+</span>
                </div>
              </summary>
              <div className="px-8 pb-6 text-muted-foreground leading-relaxed animate-in slide-in-from-top-2">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="neo-card p-12 md:p-20 rounded-[3rem] relative overflow-hidden text-center flex flex-col items-center">
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--teal-soft)]/5 to-transparent pointer-events-none" />
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Stay ahead of the curve.</h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl">
            Subscribe to our newsletter for the latest insights, course updates, and exclusive tech resources.
          </p>
          <div className="flex flex-col sm:flex-row items-center w-full max-w-lg gap-4 p-2 neo-inset rounded-full bg-background">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 bg-transparent border-none outline-none px-6 py-4 text-lg w-full"
            />
            <button className="neo-btn-primary px-8 py-4 rounded-full font-medium whitespace-nowrap w-full sm:w-auto">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Contact & Map Strip */}
      <section className="py-20 px-4 max-w-7xl mx-auto mb-20">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="neo-card p-10 rounded-3xl flex flex-col justify-center">
            <h3 className="text-3xl font-bold mb-8">Get in touch</h3>
            <div className="space-y-6 mb-10">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full neo-inset flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-[var(--teal)]" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-1">Visit Us</h4>
                  <p className="text-muted-foreground">{COMPANY.address}</p>
                </div>
              </div>
            </div>
            <button className="neo-btn-primary py-4 px-8 rounded-2xl font-medium text-lg w-full sm:w-max">
              Contact Support
            </button>
          </div>
          <div className="neo-card p-4 rounded-3xl h-[400px] overflow-hidden">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d11342.34567!2d-122.419415!3d37.774929!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085809c6c8f4459%3A0xb10ed6d9b5050f14!2sSan+Francisco%2C+CA!5e0!3m2!1sen!2sus!4v1" 
              width="100%" 
              height="100%" 
              style={{ border: 0, borderRadius: '1.25rem' }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
}


