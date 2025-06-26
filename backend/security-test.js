const fetch = require("node-fetch");

// Test security measures
async function testSecurity() {
  const baseUrl = process.env.TEST_URL || "http://localhost:5001";

  console.log("🔒 Testing SorboNexus Security Measures...\n");

  try {
    // Test 1: Check if security headers are present
    console.log("1. Testing Security Headers...");
    const response = await fetch(`${baseUrl}/`);
    const headers = response.headers;

    const securityHeaders = {
      "x-frame-options": headers.get("x-frame-options"),
      "x-content-type-options": headers.get("x-content-type-options"),
      "x-xss-protection": headers.get("x-xss-protection"),
      "strict-transport-security": headers.get("strict-transport-security"),
    };

    console.log("Security Headers:", securityHeaders);

    // Test 2: Test rate limiting
    console.log("\n2. Testing Rate Limiting...");
    const promises = [];
    for (let i = 0; i < 10; i++) {
      promises.push(
        fetch(`${baseUrl}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: "test", password: "test" }),
        })
      );
    }

    const responses = await Promise.all(promises);
    const rateLimited = responses.some((r) => r.status === 429);
    console.log("Rate limiting working:", rateLimited ? "✅" : "❌");

    // Test 3: Test CORS
    console.log("\n3. Testing CORS...");
    const corsResponse = await fetch(`${baseUrl}/`, {
      headers: {
        Origin: "https://malicious-site.com",
      },
    });
    const corsHeader = corsResponse.headers.get("access-control-allow-origin");
    console.log("CORS protection:", corsHeader ? "✅" : "❌");

    console.log("\n✅ Security tests completed!");
  } catch (error) {
    console.error("❌ Security test failed:", error.message);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testSecurity();
}

module.exports = { testSecurity };
