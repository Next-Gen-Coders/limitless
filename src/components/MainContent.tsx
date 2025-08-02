import { useState } from "react";
import {
  Send,
  TrendingUp,
  ArrowLeft,
  BarChart3,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent } from "./ui/card";

const MainContent = () => {
  const [inputValue, setInputValue] = useState("");

  const suggestedPrompts = [
    "Show my portfolio balance",
    "Send 0.1 ETH to wallet",
    "Analyze token performance",
    "Clear chat history",
  ];

  const trendingCards = [
    {
      icon: <BarChart3 className="text-blue-500" size={24} />,
      title: "Portfolio Analytics",
      description:
        "Get detailed insights into your portfolio performance and asset allocation.",
    },
    {
      icon: <ArrowLeft className="text-green-500" size={24} />,
      title: "Smart Transactions",
      description:
        "Execute trades and transfers with natural language commands and AI assistance.",
    },
    {
      icon: <TrendingUp className="text-purple-500" size={24} />,
      title: "Market Intelligence",
      description:
        "Stay updated with real-time market data and AI-powered market analysis.",
    },
  ];

  return (
    <div className="flex-1 bg-background flex flex-col min-h-full">
      {/* Main content area */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        {/* Main message */}
        <div className="text-center mb-12">
          <h1 className="text-foreground text-4xl font-bold mb-4 font-family-zilla">
            Control your Web3 wallet with AI
          </h1>
          <p className="text-muted-foreground text-xl">
            Let Limitless do it all for you!
          </p>
        </div>

        {/* Input field */}
        <div className="w-full max-w-4xl mb-4">
          <div className="bg-card border border-border rounded-2xl p-2 flex items-center space-x-4">

            {/* Main input */}
            <div className="flex-1 relative">
              <Input
                type="text"
                placeholder="Ask me anything about your Web3 wallet..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full bg-muted text-foreground border-border focus:border-ring rounded-xl"
              />
            </div>

            {/* Send button */}
            <Button
              size="sm"
              className="bg-primary hover:bg-primary/90 text-primary-foreground p-2 pr-3 rounded-2xl"
            >
              <Send size={20} />
            </Button>
          </div>
        </div>

        {/* Suggested prompts */}
        <div className="w-full max-w-4xl mb-8">
          <div className="flex flex-wrap gap-2">
            {suggestedPrompts.map((prompt, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="bg-muted/50 text-muted-foreground hover:bg-accent hover:text-accent-foreground border-border rounded-xl"
              >
                {prompt}
              </Button>
            ))}
          </div>
        </div>

        {/* Trending section */}
        <div className="w-full max-w-4xl">
          <h2 className="text-foreground text-xl font-semibold mb-4 font-family-zilla">
            Popular features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {trendingCards.map((card, index) => (
              <Card
                key={index}
                className="bg-card border-border hover:border-accent transition-colors cursor-pointer hover:shadow-md rounded-2xl p-2"
              >
                <CardContent className="px-0">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">{card.icon}</div>
                    <div>
                      <h3 className="text-foreground font-medium mb-2">
                        {card.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {card.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContent;
