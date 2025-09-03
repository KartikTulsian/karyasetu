"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const [colleges, setColleges] = useState(0);
  const [students, setStudents] = useState(0);
  const [events, setEvents] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Simple counter animation for stats
  useEffect(() => {
    let c = 0, s = 0, e = 0;
    const interval = setInterval(() => {
      if (c < 100) c++;
      if (s < 10000) s += 200;
      if (e < 500) e += 10;
      setColleges(c);
      setStudents(s);
      setEvents(e);
      if (c >= 100 && s >= 10000 && e >= 500) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-pink-50 text-gray-800 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />

      {/* Navbar */}
      <header className="flex items-center justify-between px-8 py-4 shadow-sm bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent">
          Karyasetu
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-8 md:px-16 lg:px-24 py-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-xl"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-gray-900">
            One Platform.{" "}
            <span className="bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent">
              Every College Event.
            </span>
          </h1>
          <p className="mt-6 text-lg text-gray-600">
            Discover, create, and celebrate college events like never before.
            Karyasetu brings students and colleges together on a single stage.
          </p>
          <div className="mt-8">
            <button
              onClick={() => router.push("/sign-in")}
              className="bg-gradient-to-r from-blue-600 to-pink-600 hover:from-blue-700 hover:to-pink-700 text-white px-8 py-3 rounded-full shadow-lg transition-transform hover:scale-105"
            >
              Get Started Free →
            </button>
          </div>
        </motion.div>
        <motion.img
          src="/karyasetu_main.png"
          alt="Karyasetu Logo"
          className="w-80 mt-12 md:mt-0 drop-shadow-lg"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        />
      </section>

      {/* Trust Stats */}
      <section className="py-16 bg-white/70 text-center backdrop-blur-md relative z-10">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent">
          Already trusted by students across India
        </h2>
        <div className="flex justify-center gap-12 mt-10 flex-wrap">
          <Stat number={`${colleges}+`} label="Colleges" color="blue" />
          <Stat number={`${students.toLocaleString()}+`} label="Students" color="pink" />
          <Stat number={`${events}+`} label="Events" color="purple" />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-to-r from-blue-50 to-pink-50 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent">
            Why Karyasetu?
          </h2>
        </div>
        <div className="grid gap-8 px-8 md:px-16 lg:px-24 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "📅 Manage Events in Minutes",
              desc: "Create and update your college events without hassle.",
            },
            {
              title: "🤝 Team Up Across Colleges",
              desc: "Find and collaborate with peers from different campuses.",
            },
            {
              title: "🎓 Discover Every Fest",
              desc: "Stay updated with all cultural & tech fests near you.",
            },
            {
              title: "🏆 Celebrate Together",
              desc: "Share memories, results, and wins with the community.",
            },
          ].map((f, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="p-6 bg-white rounded-2xl shadow-md transition-transform hover:shadow-lg"
            >
              <h3 className="text-xl font-semibold">{f.title}</h3>
              <p className="text-gray-600 mt-2">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent">
            Loved by Students
          </h2>
        </div>
        <div className="grid gap-8 px-8 md:px-16 lg:px-24 md:grid-cols-3">
          {[
            {
              name: "Priya, XYZ College",
              text: "Karyasetu made event management so easy! Our fest saw 3x participation.",
              img: "/avatar.png",
            },
            {
              name: "Rahul, ABC University",
              text: "Finally a platform that connects students across colleges. I found my hackathon team here!",
              img: "/avatar.png",
            },
            {
              name: "Simran, DEF Institute",
              text: "Super smooth and fun to use. It feels like Instagram for college events!",
              img: "/avatar.png",
            },
          ].map((t, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="p-6 border rounded-2xl shadow-sm bg-gradient-to-br from-blue-50 to-pink-50"
            >
              <div className="flex items-center gap-3 mb-3">
                <img src={t.img} alt={t.name} className="w-10 h-10 rounded-full" />
                <div>
                  <p className="font-semibold text-blue-600">{t.name}</p>
                  <p className="text-yellow-500 text-sm">★★★★★</p>
                </div>
              </div>
              <p className="text-gray-700 italic">“{t.text}”</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-20 bg-gray-50 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h2>
        </div>
        <div className="max-w-3xl mx-auto space-y-4 px-6">
          {[
            { q: "Is Karyasetu free?", a: "Yes, it’s 100% free for students and colleges." },
            { q: "Can I join events from other colleges?", a: "Absolutely! That’s the fun part." },
            { q: "What if my college isn’t listed?", a: "You can add it in minutes and start hosting." },
          ].map((faq, i) => (
            <div key={i} className="p-6 bg-white rounded-xl shadow-sm border cursor-pointer"
              onClick={() => setOpenFaq(openFaq === i ? null : i)}>
              <h3 className="font-semibold text-gray-900 flex justify-between">
                {faq.q}
                <span>{openFaq === i ? "−" : "+"}</span>
              </h3>
              {openFaq === i && <p className="text-gray-600 mt-2">{faq.a}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-pink-600 text-center text-white relative z-10">
        <h2 className="text-3xl font-bold">🚀 Ready to explore college events?</h2>
        <p className="mt-4">Join thousands of students making events unforgettable with Karyasetu.</p>
        <div className="mt-8">
          <button
            onClick={() => router.push("/auth")}
            className="bg-white text-blue-600 font-semibold px-8 py-3 rounded-full shadow-md hover:bg-gray-100 transition hover:scale-105"
          >
            Get Started Free →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8 text-center space-y-2">
        <p className="text-sm">© {new Date().getFullYear()} Karyasetu. All rights reserved.</p>
        <div className="flex justify-center gap-6 text-sm">
          <a href="/about" className="hover:text-white">About</a>
          <a href="/contact" className="hover:text-white">Contact</a>
          <a href="/privacy" className="hover:text-white">Privacy Policy</a>
        </div>
      </footer>
    </main>
  );
}

// Small Stat Component
function Stat({ number, label, color }: { number: string; label: string; color: string }) {
  return (
    <div className="transition-transform hover:scale-110">
      <div className={`text-4xl font-extrabold text-${color}-600`}>{number}</div>
      <p className="text-gray-600">{label}</p>
    </div>
  );
}