import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const faqs = [
  {
    q: "What courses do you offer?",
    a: "We offer courses in Web Development, UI/UX Design, Data Science, Digital Marketing, Cloud Computing, and Cybersecurity. All courses are designed by industry experts.",
  },
  {
    q: "Do you provide certificates?",
    a: "Yes! Upon successful completion, you receive an industry-recognized certification from TRI CUBE Digital Solutions.",
  },
  {
    q: "What is the refund policy?",
    a: "We offer a 7-day money-back guarantee on all courses. Contact us for a full refund if you're not satisfied.",
  },
  {
    q: "Are there placement assistance programs?",
    a: "Premium courses include career support with resume reviews, mock interviews, and introductions to hiring partners.",
  },
  {
    q: "Can I access course materials offline?",
    a: "Yes, enrolled students can download materials and access them offline through our mobile app.",
  },
  {
    q: "Do you offer corporate training?",
    a: "Yes, we provide customized corporate training programs. Contact us for enterprise pricing.",
  },
  {
    q: "What are the prerequisites?",
    a: "Most courses require basic computer knowledge. Specific courses may have additional prerequisites listed on the course page.",
  },
  {
    q: "How long do I have access to course materials?",
    a: "You get lifetime access to all course materials, including future updates.",
  },
];

export const Route = createFileRoute("/faq")({
  component: FAQPage,
});

function FAQPage() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <>
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <span className="inline-block rounded-full bg-teal/10 px-4 py-1.5 text-sm font-medium text-teal">
              FAQ
            </span>
            <h1 className="mt-6 font-heading text-4xl font-bold text-navy md:text-5xl lg:text-6xl">
              Frequently Asked Questions
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Everything you need to know about our programs.
            </p>
          </motion.div>
        </div>
      </section>

      <section ref={ref} className="section-padding">
        <div className="container-wide mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={`item-${i}`}
                  className="rounded-2xl border border-border bg-card px-6 data-[state=open]:shadow-sm"
                >
                  <AccordionTrigger className="text-left text-base">{faq.q}</AccordionTrigger>
                  <AccordionContent>{faq.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>
    </>
  );
}
