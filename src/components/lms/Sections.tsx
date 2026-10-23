import { motion } from "framer-motion";
import {
  Award,
  Briefcase,
  CalendarCheck,
  FileCheck2,
  LineChart,
  MessagesSquare,
  ShieldCheck,
  Users,
} from "lucide-react";
import { PARTNERS, WHY_US } from "@/lib/site-data";
import { Reveal, motionConfig } from "./motion";

/** TrustedBy — hiring-partner wordmark row. */
export function TrustedBy() {
  return (
    <section className="border-y border-[#E8E1DD] bg-[#F8F6F4] py-10">
      <div className="mx-auto w-full max-w-[1280px] px-4 md:px-6">
        <Reveal>
          <p className="text-center text-[12px] font-bold tracking-[0.14em] text-[#6B625D] uppercase">
            Graduates hired by 120+ partners
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
            {PARTNERS.map((p) => (
              <span
                key={p}
                className="text-[17px] font-bold tracking-tight text-[#0E263A]/35 transition-colors hover:text-[#0E263A]/70"
              >
                {p}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const FEATURES = [
  {
    icon: CalendarCheck,
    label: "Cohorts",
    title: "Live mentor-led cohorts",
    body: "Scheduled sessions with working engineers — not a wall of pre-recorded slides.",
    metric: "92% completion",
  },
  {
    icon: Briefcase,
    label: "Projects",
    title: "Real client-grade projects",
    body: "Every course ends with a capstone built to production standards, reviewed line by line.",
    metric: "1 capstone / course",
  },
  {
    icon: LineChart,
    label: "Analytics",
    title: "Progress you can see",
    body: "Streaks, module analytics and placement readiness tracked in one calm dashboard.",
    metric: "Live metrics",
  },
  {
    icon: Award,
    label: "Placement",
    title: "Placement support built-in",
    body: "Resume reviews, mock interviews and referrals into our hiring-partner network.",
    metric: "120+ partners",
  },
  {
    icon: MessagesSquare,
    label: "Mentors",
    title: "1:1 doubt clearing",
    body: "Personal mentor calls until every concept clicks — no queue, no tickets.",
    metric: "< 4h response",
  },
  {
    icon: ShieldCheck,
    label: "Certificates",
    title: "QR-verifiable certificates",
    body: tamperProof(),
  },
];

function tamperProof() {
  return "Every certificate carries a QR seal recognised by hiring partners — verify in seconds.";
}

/** Features — icon/label/heading/body/metric cards with hover lift. */
export function Features() {
  return (
    <section id="features" className="scroll-mt-20 bg-white py-24 md:py-32">
      <div className="mx-auto w-full max-w-[1280px] px-4 md:px-6">
        <Reveal className="max-w-[640px]">
          <p className="text-[13px] font-bold tracking-[0.12em] text-[#247F7C] uppercase">
            Product
          </p>
          <h2 className="mt-3 text-[32px] leading-tight font-bold tracking-[-0.03em] text-[#0E263A] md:text-[44px]">
            Everything a serious learner needs.
          </h2>
          <p className="mt-4 text-[17px] leading-[1.6] text-[#6B625D]">
            The platform stays out of the way; the learning does the talking.
          </p>
        </Reveal>

        <motion.div
          className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
        >
          {FEATURES.map((f) => (
            <motion.article
              key={f.title}
              className="rounded-[16px] border border-[#E8E1DD] bg-white p-6 transition-colors hover:border-[#2EA5A1]/40"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: motionConfig.reveal, ease: motionConfig.ease }}
              whileHover={{ y: -6 }}
              variants={{}}
            >
              <span className="grid h-11 w-11 place-items-center rounded-[10px] bg-[#2EA5A1]/12">
                <f.icon size={20} className="text-[#247F7C]" aria-hidden />
              </span>
              <p className="mt-4 text-[11px] font-bold tracking-[0.12em] text-[#6B625D] uppercase">
                {f.label}
              </p>
              <h3 className="mt-1.5 text-[19px] font-bold tracking-tight text-[#0E263A]">
                {f.title}
              </h3>
              <p className="mt-2 text-[15px] leading-[1.6] text-[#6B625D]">{f.body}</p>
              <p className="mt-4 inline-flex rounded-full bg-[#F8F6F4] px-2.5 py-1 text-[12px] font-bold text-[#247F7C]">
                {f.metric}
              </p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/** Benefits — split panel on the warm neutral with the WHY_US list. */
export function Benefits() {
  return (
    <section className="bg-[#F8F6F4] py-24 md:py-32">
      <div className="mx-auto grid w-full max-w-[1280px] items-center gap-12 px-4 md:px-6 lg:grid-cols-2">
        <Reveal>
          <p className="text-[13px] font-bold tracking-[0.12em] text-[#247F7C] uppercase">
            Why TRI CUBE
          </p>
          <h2 className="mt-3 text-[32px] leading-tight font-bold tracking-[-0.03em] text-[#0E263A] md:text-[44px]">
            Built for outcomes, not watch-time.
          </h2>
          <p className="mt-4 max-w-[48ch] text-[17px] leading-[1.6] text-[#6B625D]">
            Most platforms count hours. We count offer letters — and every feature exists
            to move that number.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-4">
            {[
              { v: "92%", l: "Placement rate" },
              { v: "48", l: "Courses" },
              { v: "4.9", l: "Avg. rating" },
            ].map((s) => (
              <div key={s.l} className="rounded-[16px] border border-[#E8E1DD] bg-white p-4">
                <p className="text-[24px] font-bold tracking-tight text-[#247F7C]">{s.v}</p>
                <p className="mt-0.5 text-[12px] font-medium text-[#6B625D]">{s.l}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <motion.ul
          className="grid gap-4 sm:grid-cols-2"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
        >
          {WHY_US.map((w) => (
            <motion.li
              key={w.title}
              className="rounded-[16px] border border-[#E8E1DD] bg-white p-5"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: motionConfig.reveal, ease: motionConfig.ease }}
            >
              <FileCheck2 size={18} className="text-[#2EA5A1]" aria-hidden />
              <h3 className="mt-3 text-[16px] font-bold tracking-tight text-[#0E263A]">
                {w.title}
              </h3>
              <p className="mt-1.5 text-[14px] leading-[1.55] text-[#6B625D]">{w.body}</p>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}

/** HowItWorks — three numbered steps. */
export function HowItWorks() {
  const steps = [
    {
      icon: Users,
      title: "Join a cohort",
      body: "Pick a track, get a schedule, and meet your mentor and peer group on day one.",
    },
    {
      icon: LineChart,
      title: "Build weekly",
      body: "Short lessons, hands-on labs and weekly reviews keep progress visible and honest.",
    },
    {
      icon: Award,
      title: "Launch your career",
      body: "Capstone, certificate, mock interviews and referrals — until the offer lands.",
    },
  ];
  return (
    <section className="bg-white py-24 md:py-32">
      <div className="mx-auto w-full max-w-[1280px] px-4 md:px-6">
        <Reveal className="mx-auto max-w-[560px] text-center">
          <p className="text-[13px] font-bold tracking-[0.12em] text-[#247F7C] uppercase">
            How it works
          </p>
          <h2 className="mt-3 text-[32px] leading-tight font-bold tracking-[-0.03em] text-[#0E263A] md:text-[44px]">
            Three steps to an offer letter.
          </h2>
        </Reveal>
        <motion.div
          className="relative mt-14 grid gap-10 md:grid-cols-3 md:gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
        >
          <div
            aria-hidden
            className="absolute top-6 right-[16%] left-[16%] hidden border-t-2 border-dashed border-[#E8E1DD] md:block"
          />
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              className="relative text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: motionConfig.reveal, ease: motionConfig.ease }}
            >
              <div className="relative mx-auto grid h-12 w-12 place-items-center rounded-full border border-[#E8E1DD] bg-white">
                <s.icon size={20} className="text-[#247F7C]" aria-hidden />
                <span className="absolute -top-1.5 -right-1.5 grid h-5 w-5 place-items-center rounded-full bg-[#2EA5A1] text-[11px] font-bold text-white">
                  {i + 1}
                </span>
              </div>
              <h3 className="mt-4 text-[18px] font-bold tracking-tight text-[#0E263A]">
                {s.title}
              </h3>
              <p className="mx-auto mt-2 max-w-[34ch] text-[15px] leading-[1.6] text-[#6B625D]">
                {s.body}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
