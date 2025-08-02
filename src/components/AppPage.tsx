import AppLayout from "./AppLayout";import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Wallet, TrendingUp, MessageSquare, Settings } from "lucide-react";

const AppPage = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground font-family-zilla">
            Welcome to Limitless
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Your AI-powered Web3 wallet management platform. Control your
            digital assets with natural language commands.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center space-x-2">
                <Wallet className="w-5 h-5 text-primary" />
                <span>Connect Wallet</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Link your Web3 wallet to start managing your assets
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                <span>New Chat</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Start a conversation with AI to manage your portfolio
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <span>Analytics</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                View detailed analytics and performance metrics
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center space-x-2">
                <Settings className="w-5 h-5 text-primary" />
                <span>Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Configure your preferences and security settings
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your latest wallet interactions and AI conversations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Portfolio Analysis
                    </p>
                    <p className="text-xs text-muted-foreground">
                      2 minutes ago
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  View
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Token Swap
                    </p>
                    <p className="text-xs text-muted-foreground">1 hour ago</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  View
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Market Research
                    </p>
                    <p className="text-xs text-muted-foreground">3 hours ago</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  View
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default AppPage;
