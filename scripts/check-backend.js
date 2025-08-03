#!/usr/bin/env node

const http = require("http");

const API_URL = process.env.VITE_API_URL || "http://localhost:3000";
const HEALTH_ENDPOINT = `${API_URL}/health`;

console.log("🔍 Checking backend server status...");
console.log(`📍 API URL: ${API_URL}`);
console.log(`🏥 Health endpoint: ${HEALTH_ENDPOINT}`);
console.log("");

const req = http.get(HEALTH_ENDPOINT, (res) => {
  console.log(`✅ Backend server is running!`);
  console.log(`📊 Status: ${res.statusCode}`);
  console.log(`🔗 URL: ${API_URL}`);

  let data = "";
  res.on("data", (chunk) => {
    data += chunk;
  });

  res.on("end", () => {
    try {
      const healthData = JSON.parse(data);
      console.log(`📈 Health status: ${healthData.status || "unknown"}`);
      if (healthData.uptime) {
        console.log(`⏱️  Uptime: ${Math.round(healthData.uptime / 1000)}s`);
      }
    } catch (e) {
      console.log(`📄 Response: ${data.substring(0, 100)}...`);
    }
    console.log("");
    console.log("🎉 Your frontend should now work with real API calls!");
  });
});

req.on("error", (err) => {
  console.log("❌ Backend server is not running or not accessible");
  console.log(`🔍 Error: ${err.message}`);
  console.log("");
  console.log("💡 To fix this:");
  console.log("   1. Start your backend server");
  console.log("   2. Ensure it's running on port 3000");
  console.log("   3. Check that the server is accessible");
  console.log("");
  console.log(
    "🔄 The frontend will use demo mode with dummy responses until the backend is available."
  );
});

req.setTimeout(5000, () => {
  console.log("⏰ Request timed out - backend server may be slow to respond");
  req.destroy();
});
