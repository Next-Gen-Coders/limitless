import React, { useState } from "react";
import {
  Send,
  Paperclip,
  TrendingUp,
  ArrowLeft,
  BarChart3,
} from "lucide-react";

const MainContent: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("General");
  const [selectedModel, setSelectedModel] = useState("GPT-4");
  const [inputValue, setInputValue] = useState("");

  const suggestedPrompts = [
    "latest news",
    "Market updates",
    "Research on Tesla",
    "clear history...",
  ];

  const trendingCards = [
    {
      icon: <BarChart3 className="text-blue-500" size={24} />,
      title: "Volume Spike Detection",
      description:
        "Alert me when unusual volume spikes occur in small-cap tech stocks.",
    },
    {
      icon: <ArrowLeft className="text-green-500" size={24} />,
      title: "Mean Reversion Strategy",
      description:
        "Find stocks that tend to bounce back after dropping more than 5% in one day.",
    },
    {
      icon: <TrendingUp className="text-purple-500" size={24} />,
      title: "Compare Historical Patterns",
      description:
        "Show me how TCS and Infosys reacted to rate hikes over the past 10 years.",
    },
  ];

  return (
    <div className="flex-1 bg-gray-950 flex flex-col">
      {/* Main content area */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        {/* Main message */}
        <div className="text-center mb-12">
          <h1 className="text-white text-4xl font-bold mb-4">
            Build, test, and execute strategies
          </h1>
          <p className="text-white text-xl">Let Astryx do it all for you!</p>
        </div>

        {/* Input field */}
        <div className="w-full max-w-4xl mb-8">
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 flex items-center space-x-4">
            {/* Category dropdown */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-gray-800 text-white px-3 py-2 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
            >
              <option value="General">General</option>
              <option value="Trading">Trading</option>
              <option value="Analysis">Analysis</option>
            </select>

            {/* Model dropdown */}
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="bg-gray-800 text-white px-3 py-2 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
            >
              <option value="GPT-4">GPT-4</option>
              <option value="GPT-3.5">GPT-3.5</option>
              <option value="Claude">Claude</option>
            </select>

            {/* Main input */}
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="How may I help you?"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full bg-gray-800 text-white px-4 py-2 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Attachment button */}
            <button className="p-2 text-gray-400 hover:text-white transition-colors">
              <Paperclip size={20} />
            </button>

            {/* Send button */}
            <button className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
              <Send size={20} />
            </button>
          </div>
        </div>

        {/* Suggested prompts */}
        <div className="w-full max-w-4xl mb-8">
          <div className="flex flex-wrap gap-2">
            {suggestedPrompts.map((prompt, index) => (
              <button
                key={index}
                className="bg-gray-800 text-gray-300 px-4 py-2 rounded-full hover:bg-gray-700 transition-colors text-sm"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Trending section */}
        <div className="w-full max-w-4xl">
          <h2 className="text-white text-xl font-semibold mb-4">
            Trending today
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {trendingCards.map((card, index) => (
              <div
                key={index}
                className="bg-gray-900 border border-gray-700 rounded-lg p-6 hover:border-gray-600 transition-colors cursor-pointer"
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">{card.icon}</div>
                  <div>
                    <h3 className="text-white font-medium mb-2">
                      {card.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContent;
