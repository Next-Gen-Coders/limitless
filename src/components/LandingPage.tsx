import { landingFeatures, heroContent, stats } from "../constants/landing";

const LandingPage = () => {
  const handleConnectWallet = () => {
    console.log("Connect wallet clicked");
  };

  return (
    <div className="min-h-screen bg-black-100 text-white-100">
      {/* Header */}
      <header className="border-b border-white-100/10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo-white.png" alt="Limitless" className="h-8 w-auto" />
            <span className="text-xl font-bold">Limitless</span>
          </div>
          <button
            onClick={handleConnectWallet}
            className="bg-white-100 hover:bg-white-90 text-black-100 px-6 py-2 rounded-lg transition-colors duration-200"
          >
            Connect Wallet
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-white-100 to-white-70 bg-clip-text text-transparent">
            {heroContent.title}
          </h1>
          <h2 className="text-2xl text-white-70 mb-6">
            {heroContent.subtitle}
          </h2>
          <p className="text-lg text-white-60 mb-8 max-w-2xl mx-auto">
            {heroContent.description}
          </p>
          <button
            onClick={handleConnectWallet}
            className="bg-white-100 hover:bg-white-90 text-black-100 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-white-60/25"
          >
            {heroContent.ctaText}
          </button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-xl bg-white-100/5 border border-white-100/10"
            >
              <div className="text-3xl font-bold text-white-100 mb-2">
                {stat.value}
              </div>
              <div className="text-white-60">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Why Choose Limitless?</h2>
          <p className="text-white-60 max-w-2xl mx-auto">
            Experience the future of Web3 wallet management with AI-powered
            automation and natural language control.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {landingFeatures.map((feature) => (
            <div
              key={feature.id}
              className="p-6 rounded-xl bg-white-100/5 border border-white-100/10 hover:border-white-100/20 transition-all duration-200 hover:bg-white-100/10"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-white-60 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Experience the Future?
          </h2>
          <p className="text-white-60 mb-8 text-lg">
            Join thousands of users who are already controlling their Web3
            wallets with AI.
          </p>
          <button
            onClick={handleConnectWallet}
            className="bg-white-100 hover:bg-white-90 text-black-100 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-white-60/25"
          >
            Get Started Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white-100/10 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-white-60">
            © 2024 Limitless. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
