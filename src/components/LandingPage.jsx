import { motion } from "framer-motion";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] text-white font-sans">
      {/* Header */}
      <header className="flex justify-between items-center px-10 py-6 sticky top-0 bg-[#0f2027]/80 backdrop-blur-md z-50">
        <motion.h1
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-2xl font-bold"
        >
          YourSaaS
        </motion.h1>

        <motion.nav
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="space-x-6"
        >
          <a href="#" className="hover:text-cyan-400 transition">
            Home
          </a>
          <a href="#" className="hover:text-cyan-400 transition">
            Pricing
          </a>
          <a href="#" className="hover:text-cyan-400 transition">
            About
          </a>
          <a href="/login">
            <button className="bg-white text-[#203a43] px-4 py-1 rounded-full hover:bg-gray-200 transition-all">
              Login
            </button>
          </a>
        </motion.nav>
      </header>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-4 pt-16 pb-24">
        <motion.h2
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="text-4xl md:text-6xl font-bold leading-tight mb-4"
        >
          AI That <span className="text-[#00c6ff]">Understands</span> Your Notes
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="text-lg md:text-xl max-w-xl mb-8 text-gray-200"
        >
          Convert paragraphs into meaningful Q&A, highlight key points, and
          build smart summaries — all in one click.
        </motion.p>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex gap-4"
        >
          <a href="/signup">
            <button className="bg-[#00c6ff] hover:bg-[#0072ff] text-white font-semibold px-6 py-3 rounded-full transition hover:scale-105">
              Try Free
            </button>
          </a>
          <a href="#features">
            <button className="border border-white px-6 py-3 rounded-full hover:bg-white hover:text-[#203a43] transition hover:scale-105">
              Learn More
            </button>
          </a>
        </motion.div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="grid md:grid-cols-3 gap-10 px-10 py-16 bg-white text-[#203a43]"
      >
        {[
          {
            title: "Auto Q&A",
            desc: "AI extracts relevant questions and answers instantly from any note.",
          },
          {
            title: "Key Point Highlighter",
            desc: "Summarizes and highlights most important concepts smartly.",
          },
          {
            title: "Export & Share",
            desc: "Download as PDF, or share your results with your team in one click.",
          },
        ].map((f, i) => (
          <motion.div
            key={i}
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.2 }}
            className="p-6 bg-[#f3f4f6] rounded-2xl shadow-xl hover:shadow-2xl transition"
          >
            <h3 className="text-xl font-bold mb-2">{f.title}</h3>
            <p>{f.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* CTA */}
      <section className="text-center py-20 bg-gradient-to-r from-[#00c6ff] to-[#0072ff] text-white">
        <motion.h2
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold mb-4"
        >
          Ready to get started?
        </motion.h2>
        <a href="/signup">
          <button className="bg-white text-[#0072ff] px-6 py-3 rounded-full font-semibold hover:opacity-90 transition hover:scale-105">
            Create Free Account
          </button>
        </a>
      </section>

      {/* Footer */}
      <footer className="bg-[#0f2027] text-gray-400 text-center py-6 text-sm">
        © {new Date().getFullYear()} YourSaaS. Built for students & creators ✦
      </footer>
    </div>
  );
};

export default Landing;
