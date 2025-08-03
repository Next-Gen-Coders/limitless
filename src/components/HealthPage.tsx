import { useGetHealth } from "../hooks/services/useHealth";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge-export";
import { 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Clock,
  Server,
  Database,
} from "lucide-react";

const HealthPage = () => {
  const { data, isLoading, error, refetch, isFetching } = useGetHealth();

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "healthy":
      case "limitless":
        return "bg-green-500";
      case "unhealthy":
      case "down":
        return "bg-red-500";
      case "degraded":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "healthy":
      case "limitless":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "unhealthy":
      case "down":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "degraded":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default:
        return <XCircle className="w-5 h-5 text-gray-500" />;
    }
  };



  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
          <h2 className="text-xl font-semibold">Checking Health Status...</h2>
          <p className="text-muted-foreground">Please wait while we check all services</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 max-w-md w-full text-center">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Health Check Failed</h2>
          <p className="text-muted-foreground mb-4">
            Unable to connect to health endpoint
          </p>
          <p className="text-sm text-red-600 mb-4">
            {error?.message || "Unknown error occurred"}
          </p>
          <Button onClick={() => refetch()} disabled={isFetching}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
            Retry Check
          </Button>
        </Card>
      </div>
    );
  }

  const healthData = data;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Server className="w-8 h-8" />
              Service Health Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">
              Monitor the status and performance of all services
            </p>
          </div>
          <Button 
            onClick={() => refetch()} 
            disabled={isFetching}
            variant="outline"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Overall Status */}
        <Card className="p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {getStatusIcon(healthData?.status || "unknown")}
              <div>
                <h2 className="text-2xl font-semibold">
                  System Status: {healthData?.status?.toUpperCase() || "UNKNOWN"}
                </h2>
                <p className="text-muted-foreground">
                  Last checked: {new Date().toLocaleString()}
                </p>
              </div>
            </div>
            <div className="text-right">
              <Badge 
                variant={healthData?.status?.toLowerCase() === "limitless" ? "default" : "destructive"}
                className={healthData?.status?.toLowerCase() === "limitless" ? "bg-green-500 text-white" : ""}
              >
                {healthData?.status || "UNKNOWN"}
              </Badge>
            </div>
          </div>
        </Card>

        {/* Simple Status Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Server className="w-5 h-5" />
                <h3 className="text-lg font-semibold">Main Service</h3>
              </div>
              {getStatusIcon(healthData?.status || "unknown")}
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Status:</span>
                <Badge 
                  variant={healthData?.status?.toLowerCase() === "limitless" ? "default" : "destructive"}
                  className={healthData?.status?.toLowerCase() === "limitless" ? "bg-green-500 text-white" : ""}
                >
                  {healthData?.status?.toUpperCase() || "UNKNOWN"}
                </Badge>
              </div>
            </div>

            {/* Visual status indicator */}
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${getStatusColor(healthData?.status || "unknown")}`}
                  style={{ width: healthData?.status?.toLowerCase() === "limitless" ? "100%" : "0%" }}
                ></div>
              </div>
            </div>
          </Card>

          {/* Placeholder for future services */}
          <Card className="p-6 opacity-50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Database className="w-5 h-5" />
                <h3 className="text-lg font-semibold">Database</h3>
              </div>
              <XCircle className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Status:</span>
                <Badge variant="outline">Not Configured</Badge>
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                <div className="h-2 rounded-full bg-gray-400" style={{ width: "0%" }}></div>
              </div>
            </div>
          </Card>


        </div>

        {/* API Response Information */}
        <Card className="p-6 mt-8">
          <h3 className="text-lg font-semibold mb-4">API Response</h3>
          <div className="bg-muted p-4 rounded-lg">
            <pre className="text-sm">
              <span className="text-green-600">GET /health</span>
              {'\n'}
              <span className="text-blue-600">Response:</span>
              {'\n'}
              {JSON.stringify(healthData, null, 2)}
            </pre>
          </div>
        </Card>

        {/* Auto-refresh indicator */}
        <div className="text-center mt-8 text-sm text-muted-foreground">
          <Clock className="w-4 h-4 inline mr-1" />
          Auto-refreshes every 30 seconds
        </div>
      </div>
    </div>
  );
};

export default HealthPage;