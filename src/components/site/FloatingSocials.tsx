import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronUp } from "lucide-react";
import { COMPANY } from "@/lib/site-data";

export function FloatingSocials() {
  const [isOpen, setIsOpen] = useState(false);

  const whatsappNumber = COMPANY.whatsapp.replace(/[^0-9]/g, "");
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    "Hi TRI CUBE! I'd like to know more about your courses and internships."
  )}`;
  const linkedinUrl = COMPANY.socials.linkedin;

  return (
    <div className="fixed bottom-6 right-7 z-50 flex flex-col items-center gap-3 iso-social-wrapper">
      <style>{`
        .iso-social-wrapper .card {
          max-width: fit-content;
          border-radius: 15px;
          display: flex;
          flex-direction: column;
          align-content: center;
          justify-content: center;
          gap: 1rem;
          backdrop-filter: blur(15px);
          background: rgba(255, 255, 255, 0.35);
          box-shadow: inset 0 0 20px rgba(255, 255, 255, 0.192),
            inset 0 0 5px rgba(255, 255, 255, 0.274), 0 5px 5px rgba(0, 0, 0, 0.164);
          transition: 0.5s;
        }

        .iso-social-wrapper .card:hover {
          animation: ease-out 5s;
          background: rgba(173, 173, 173, 0.08);
        }

        .iso-social-wrapper .card ul {
          padding: 0.85rem;
          margin: 0;
          display: flex;
          list-style: none;
          gap: 1rem;
          align-items: center;
          justify-content: center;
          align-content: center;
          flex-wrap: wrap;
          flex-direction: column;
        }

        .iso-social-wrapper .card ul li {
          cursor: pointer;
          position: relative;
        }

        .iso-social-wrapper .svg {
          transition: all 0.3s;
          padding: 0.9rem;
          height: 54px;
          width: 54px;
          border-radius: 100%;
          fill: currentColor;
          box-shadow: inset 0 0 20px rgba(255, 255, 255, 0.3),
            inset 0 0 5px rgba(255, 255, 255, 0.5), 0 5px 5px rgba(0, 0, 0, 0.164);
        }

        .iso-social-wrapper .text {
          opacity: 0;
          border-radius: 5px;
          padding: 5px 8px;
          font-size: 12px;
          font-weight: 700;
          white-space: nowrap;
          pointer-events: none;
          transition: all 0.3s;
          background-color: rgba(255, 255, 255, 0.92);
          position: absolute;
          right: 68px;
          top: 50%;
          transform: translateY(-50%);
          z-index: 9999;
          box-shadow: -5px 0 1px rgba(153, 153, 153, 0.2),
            -10px 0 1px rgba(153, 153, 153, 0.2),
            inset 0 0 20px rgba(255, 255, 255, 0.3),
            inset 0 0 5px rgba(255, 255, 255, 0.5), 0 5px 5px rgba(0, 0, 0, 0.082);
        }

        /* Isometric projection */
        .iso-social-wrapper .iso-pro {
          transition: 0.5s;
        }

        .iso-social-wrapper .iso-pro:hover a > .svg {
          transform: translate(12px, -12px);
          border-radius: 100%;
        }

        .iso-social-wrapper .iso-pro:hover .text {
          opacity: 1;
          transform: translateY(-50%) skew(-5deg);
        }

        .iso-social-wrapper .iso-pro:hover .svg {
          transform: translate(5px, -5px);
        }

        .iso-social-wrapper .iso-pro span {
          opacity: 0;
          position: absolute;
          top: 0;
          left: 0;
          pointer-events: none;
          box-shadow: inset 0 0 20px rgba(255, 255, 255, 0.3),
            inset 0 0 5px rgba(255, 255, 255, 0.5), 0 5px 5px rgba(0, 0, 0, 0.164);
          border-radius: 50%;
          transition: all 0.3s;
          height: 54px;
          width: 54px;
        }

        .iso-social-wrapper .iso-pro:hover span {
          opacity: 1;
        }

        .iso-social-wrapper .iso-pro:hover span:nth-child(1) {
          opacity: 0.2;
        }

        .iso-social-wrapper .iso-pro:hover span:nth-child(2) {
          opacity: 0.4;
          transform: translate(4px, -4px);
        }

        .iso-social-wrapper .iso-pro:hover span:nth-child(3) {
          opacity: 0.6;
          transform: translate(8px, -8px);
        }

        /* WhatsApp Green Theme */
        .iso-social-wrapper .iso-whatsapp .svg {
          color: #ffffff;
          background: #25D366;
        }
        .iso-social-wrapper .iso-whatsapp .text {
          color: #16a34a;
        }
        .iso-social-wrapper .iso-whatsapp span {
          color: #25D366;
          border: 1px solid #25D366;
          background: rgba(37, 211, 102, 0.28);
        }

        /* LinkedIn Blue Theme */
        .iso-social-wrapper .iso-linkedin .svg {
          color: #ffffff;
          background: #0A66C2;
        }
        .iso-social-wrapper .iso-linkedin .text {
          color: #0A66C2;
        }
        .iso-social-wrapper .iso-linkedin span {
          color: #0A66C2;
          border: 1px solid #0A66C2;
          background: rgba(10, 102, 194, 0.28);
        }
      `}</style>

      {/* Popup with WhatsApp & LinkedIn icons when arrow button is clicked */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.85 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="card origin-bottom"
          >
            <ul>
              {/* WhatsApp (Green) */}
              <li className="iso-pro iso-whatsapp">
                <span />
                <span />
                <span />
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Chat on WhatsApp"
                >
                  <svg
                    viewBox="0 0 448 512"
                    xmlns="http://www.w3.org/2000/svg"
                    className="svg"
                  >
                    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
                  </svg>
                </a>
                <div className="text">WhatsApp</div>
              </li>

              {/* LinkedIn (Blue) */}
              <li className="iso-pro iso-linkedin">
                <span />
                <span />
                <span />
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Connect on LinkedIn"
                >
                  <svg
                    viewBox="0 0 448 512"
                    xmlns="http://www.w3.org/2000/svg"
                    className="svg"
                  >
                    <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z" />
                  </svg>
                </a>
                <div className="text">LinkedIn</div>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fixed Bottom-Right Arrow Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-label={isOpen ? "Hide social links" : "Show WhatsApp and LinkedIn links"}
        className="group relative flex h-13 w-13 items-center justify-center rounded-full bg-gradient-to-br from-[#E09A3B] to-[#C88225] text-white shadow-[0_10px_25px_rgba(224,154,59,0.45),inset_0_1px_2px_rgba(255,255,255,0.4)] ring-2 ring-white/80 dark:ring-zinc-800 transition-all duration-300 hover:scale-105 hover:shadow-[0_14px_30px_rgba(224,154,59,0.6)] active:scale-95 cursor-pointer"
      >
        <ChevronUp
          className={`h-6 w-6 stroke-[2.5] transition-transform duration-300 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>
    </div>
  );
}
