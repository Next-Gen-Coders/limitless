import { landingFeatures, heroContent, stats } from "../constants/landing";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";
import Lenis from "lenis";

const revealVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const LandingPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  const headerBackground = useTransform(
    scrollY,
    [0, 50],
    ["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0.8)"]
  );

  const backdropBlur = useTransform(
    scrollY,
    [0, 50],
    ["blur(0px)", "blur(8px)"]
  );

  const handleConnectWallet = () => {
    console.log("Connect wallet clicked");
  };

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div
      className="min-h-screen bg-black-100 text-white-100 relative"
      ref={containerRef}
    >
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0">
        <img
          src="/bg.png"
          alt="Background"
          className="w-full h-full object-cover opacity-15 grayscale brightness-50"
        />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <motion.header
          className=" font-family-zilla sticky top-0 z-10 "
          style={{
            backgroundColor: headerBackground,
            backdropFilter: backdropBlur,
          }}
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { duration: 0.8 } },
          }}
        >
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center ">
              <img
                src="/logo-white.png"
                alt="Limitless"
                className="h-12 w-fit"
              />
              <span className="text-xl font-bold font-family-zilla">
                Limitless
              </span>
            </div>
            <button
              onClick={handleConnectWallet}
              className="bg-white-100 hover:bg-white-90 text-black-100 px-6 py-2 rounded-lg transition-colors duration-200 font-family-zilla"
            >
              Connect Wallet
            </button>
          </div>
        </motion.header>

        {/* Hero Section */}
        <motion.section
          className="container mx-auto px-4 py-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={revealVariants}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="text-center max-w-4xl mx-auto">
            <motion.h1
              className="text-6xl font-bold mb-6 text-white-100 font-family-zilla"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6, ease: "easeOut" }}
            >
              {heroContent.title}
            </motion.h1>
            <motion.h2
              className="text-2xl text-white-70 mb-6 font-family-zilla"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.6, ease: "easeOut" }}
            >
              {heroContent.subtitle}
            </motion.h2>
            <motion.p
              className="text-lg text-white-60 mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
            >
              {heroContent.description}
            </motion.p>
            <motion.button
              onClick={handleConnectWallet}
              className="bg-white-100 hover:bg-white-90 text-black-100 px-8 py-4 rounded-lg text-xl font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-white-60/25 font-family-zilla"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.55, duration: 0.6, ease: "easeOut" }}
            >
              {heroContent.ctaText}
            </motion.button>
          </div>
        </motion.section>

        {/* Stats Section */}
        <motion.section
          className="container mx-auto px-4 py-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={revealVariants}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center p-6 rounded-xl bg-white-100/5 backdrop-blur-md border border-white-100/10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{
                  delay: index * 0.2 + 0.3,
                  duration: 0.5,
                  ease: "easeOut",
                }}
              >
                <div className="text-3xl font-bold text-white-100 mb-2">
                  {stat.value}
                </div>
                <div className="text-white-60">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Features Section */}
        <motion.section
          className="container mx-auto px-4 py-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={revealVariants}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="text-center mb-16">
            <motion.h2
              className="text-4xl font-bold mb-4 font-family-zilla"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              Why Choose Limitless?
            </motion.h2>
            <motion.p
              className="text-white-60 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: 0.15, duration: 0.6, ease: "easeOut" }}
            >
              Experience the future of Web3 wallet management with AI-powered
              automation and natural language control.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {landingFeatures.map((feature, idx) => (
              <motion.div
                key={feature.id}
                className="p-6 rounded-xl bg-white-100/5 backdrop-blur-lg border border-white-100/10 hover:border-white-100/20 transition-all duration-200 hover:bg-white-100/10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{
                  delay: idx * 0.15 + 0.3,
                  duration: 0.5,
                  ease: "easeOut",
                }}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3 font-family-zilla">
                  {feature.title}
                </h3>
                <p className="text-white-60 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          className="container mx-auto px-4 py-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={revealVariants}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="text-center max-w-3xl mx-auto">
            <motion.h2
              className="text-4xl font-bold mb-6 font-family-zilla"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              Ready to Experience the Future?
            </motion.h2>
            <motion.p
              className="text-white-60 mb-8 text-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: 0.15, duration: 0.6, ease: "easeOut" }}
            >
              Join thousands of users who are already controlling their Web3
              wallets with AI.
            </motion.p>
            <motion.button
              onClick={handleConnectWallet}
              className="bg-white-100 hover:bg-white-90 text-black-100 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-white-60/25"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
            >
              Get Started Now
            </motion.button>
          </div>
        </motion.section>

        {/* Footer */}
        <motion.footer
          className="border-t border-white-100/10 py-8 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="container mx-auto px-4 text-center">
            <p className="text-white-60">
              © 2024 Limitless. All rights reserved.
            </p>
          </div>
        </motion.footer>
      </div>
    </div>
  );
};

export default LandingPage;
