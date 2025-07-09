const { S3Client, ListBucketsCommand } = require("@aws-sdk/client-s3");

console.log("=== Environment Variables Test ===");
console.log("R2_ENDPOINT:", process.env.R2_ENDPOINT ? "✅ Set" : "❌ Missing");
console.log(
  "R2_ACCESS_KEY_ID:",
  process.env.R2_ACCESS_KEY_ID ? "✅ Set" : "❌ Missing"
);
console.log(
  "R2_SECRET_ACCESS_KEY:",
  process.env.R2_SECRET_ACCESS_KEY ? "✅ Set" : "❌ Missing"
);
console.log(
  "R2_BUCKET_NAME:",
  process.env.R2_BUCKET_NAME || "sorbonexus (default)"
);
console.log("R2_CUSTOM_DOMAIN:", process.env.R2_CUSTOM_DOMAIN || "Not set");

// Test R2 connectivity if credentials are available
if (
  process.env.R2_ENDPOINT &&
  process.env.R2_ACCESS_KEY_ID &&
  process.env.R2_SECRET_ACCESS_KEY
) {
  console.log("\n=== Testing R2 Connectivity ===");

  const s3 = new S3Client({
    region: "auto",
    endpoint: process.env.R2_ENDPOINT,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
  });

  s3.send(new ListBucketsCommand({}))
    .then((data) => {
      console.log("✅ R2 connection successful!");
      console.log("Available buckets:", data.Buckets?.map((b) => b.Name) || []);
    })
    .catch((err) => {
      console.log("❌ R2 connection failed:");
      console.log("Error:", err.message);
      console.log("Code:", err.code);
    });
} else {
  console.log(
    "\n❌ Cannot test R2 connectivity - missing environment variables"
  );
}
