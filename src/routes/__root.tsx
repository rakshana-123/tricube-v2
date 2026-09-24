import React from "react";
import {
  createRootRoute,
  Outlet,
  ScrollRestoration,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Loader } from "@/components/site/Loader";
import { FloatingWhatsapp } from "@/components/site/FloatingWhatsapp";
import appCss from "@/styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "TRI CUBE — Premium Digital Education" },
      {
        name: "description",
        content:
          "Premium LMS and digital education platform. Expert-led courses, certifications, and career support.",
      },
      { name: "theme-color", content: "#f0f4f8" },
    ],
    links: [
      {
        rel: "icon",
        type: "image/svg+xml",
        href: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎓</text></svg>",
      },
      { rel: "stylesheet", href: appCss },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
    ],
  }),
  component: RootLayout,
});

function RootLayout() {
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body style={{ margin: 0, overflowX: "hidden", background: "#f0f4f8" }}>
        <AnimatePresence mode="wait">
          {loading ? (
            <Loader key="loader" />
          ) : (
            <motion.div
              key="main"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <Header />
              <motion.main
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                style={{ minHeight: "100vh" }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <Outlet />
                  </motion.div>
                </AnimatePresence>
              </motion.main>
              <Footer />
              <FloatingWhatsapp />
            </motion.div>
          )}
        </AnimatePresence>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
