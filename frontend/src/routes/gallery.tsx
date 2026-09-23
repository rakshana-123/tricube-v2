import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const items = [
  {
    title: "Campus Overview",
    gradient: "from-violet-500 to-purple-600",
    span: "col-span-2 row-span-2",
  },
  { title: "Classroom Session", gradient: "from-blue-500 to-cyan-500", span: "" },
  { title: "Student Projects", gradient: "from-pink-500 to-rose-600", span: "" },
  { title: "Workshop", gradient: "from-emerald-500 to-teal-500", span: "" },
  { title: "Graduation Day", gradient: "from-amber-500 to-orange-500", span: "col-span-2" },
  { title: "Lab Session", gradient: "from-sky-500 to-blue-600", span: "" },
];

export const Route = createFileRoute("/gallery")({
  component: GalleryPage,
});

function GalleryPage() {
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
              Gallery
            </span>
            <h1 className="mt-6 font-heading text-4xl font-bold text-navy md:text-5xl lg:text-6xl">
              Our Gallery
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              A glimpse into life at TRI CUBE Digital Solutions.
            </p>
          </motion.div>
        </div>
      </section>

      <section ref={ref} className="section-padding">
        <div className="container-wide">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {items.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className={`group relative overflow-hidden rounded-2xl ${item.span} min-h-[200px] cursor-pointer`}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${item.gradient} transition-transform duration-500 group-hover:scale-110`}
                />
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="font-heading text-lg font-semibold text-white">
                    {item.title}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
