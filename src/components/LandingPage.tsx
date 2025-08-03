import { landingFeatures, heroContent, stats } from "../constants/landing";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { Sun, Moon } from "lucide-react";
import { usePrivy } from "@privy-io/react-auth";

const revealVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const LandingPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { authenticated, ready, login } = usePrivy();

  const backdropBlur = useTransform(
    scrollY,
    [0, 50],
    ["blur(0px)", "blur(16px)"]
  );

  const handleConnectWallet = async () => {
    if (!ready) {
      console.log("Privy not ready yet");
      return;
    }

    if (authenticated) {
      // User is already authenticated, navigate to app
      navigate("/app");
    } else {
      // User needs to authenticate first
      try {
        await login();
        // After successful login, navigate to app
        navigate("/app");
      } catch (error) {
        console.error("Login failed:", error);
      }
    }
  };

  // Auto-navigate to app if user is already authenticated
  useEffect(() => {
    if (ready && authenticated) {
      navigate("/app");
    }
  }, [ready, authenticated, navigate]);

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

  // Show loading state while Privy is initializing
  if (!ready) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-background text-foreground relative"
      ref={containerRef}
    >
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0">
        <img
          src="/bg.png"
          alt="Background"
          className={`w-full h-full object-cover grayscale transition-opacity duration-300 ${
            theme === "dark"
              ? "opacity-15 brightness-50"
              : "opacity-10 brightness-75"
          }`}
        />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <motion.header
          className=" font-family-zilla sticky top-0 z-10 "
          style={{
            // backgroundColor: headerBackground,
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
                src="/logo.png"
                alt="Limitless"
                className="h-12 w-fit dark:invert"
              />
              <span className="text-xl font-bold font-family-zilla text-foreground">
                Limitless
              </span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg transition-colors duration-200 hover:bg-accent"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5 text-foreground" />
                ) : (
                  <Moon className="w-5 h-5 text-foreground" />
                )}
              </button>
              <button
                onClick={handleConnectWallet}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-lg transition-colors duration-200 font-family-zilla"
              >
                {authenticated ? "Launch App" : "Connect Wallet"}
              </button>
            </div>
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
              className="text-6xl font-bold mb-6 text-foreground font-family-zilla"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6, ease: "easeOut" }}
            >
              {heroContent.title}
            </motion.h1>
            <motion.h2
              className="text-2xl text-muted-foreground mb-6 font-family-zilla"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.6, ease: "easeOut" }}
            >
              {heroContent.subtitle}
            </motion.h2>
            <motion.p
              className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
            >
              {heroContent.description}
            </motion.p>
            <motion.button
              onClick={handleConnectWallet}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-lg text-xl font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-accent/25 font-family-zilla"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.55, duration: 0.6, ease: "easeOut" }}
            >
              {authenticated ? heroContent.ctaText : "Connect Wallet to Start"}
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
                className="text-center p-6 rounded-xl bg-card/50 backdrop-blur-md border border-border"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{
                  delay: index * 0.2 + 0.3,
                  duration: 0.5,
                  ease: "easeOut",
                }}
              >
                <div className="text-3xl font-bold text-foreground mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
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
              className="text-4xl font-bold mb-4 font-family-zilla text-foreground"
              variants={revealVariants}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              Why Choose Limitless?
            </motion.h2>
            <motion.p
              className="text-muted-foreground max-w-2xl mx-auto"
              variants={revealVariants}
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
                className="p-6 rounded-xl bg-card/50 backdrop-blur-lg border border-border hover:border-accent transition-all duration-200 hover:bg-accent/10"
                transition={{
                  delay: idx * 0.1,
                  duration: 0.5,
                  ease: "easeOut",
                }}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3 font-family-zilla text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
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
              className="text-4xl font-bold mb-6 font-family-zilla text-foreground"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              Ready to Experience the Future?
            </motion.h2>
            <motion.p
              className="text-muted-foreground mb-8 text-lg"
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
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-accent/25"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
            >
              {authenticated ? "Get Started Now" : "Connect Wallet to Start"}
            </motion.button>
          </div>
        </motion.section>

        {/* Footer */}
        <motion.footer
          className="border-t border-border py-8 backdrop-blur-[4px]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="container mx-auto px-4 text-center">
            <p className="text-muted-foreground">
              © 2024 Limitless. All rights reserved.
            </p>
          </div>
        </motion.footer>
      </div>
    </div>
  );
};

export default LandingPage;
