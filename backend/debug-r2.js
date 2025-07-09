const {
  S3Client,
  ListBucketsCommand,
  PutObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");

console.log("=== Railway R2 Debug Script ===");
console.log("Timestamp:", new Date().toISOString());

// Check environment variables
console.log("\n1. Environment Variables Check:");
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

// Check if all required variables are present
if (
  !process.env.R2_ENDPOINT ||
  !process.env.R2_ACCESS_KEY_ID ||
  !process.env.R2_SECRET_ACCESS_KEY
) {
  console.log(
    "\n❌ Missing required environment variables. Cannot proceed with tests."
  );
  process.exit(1);
}

// Create S3 client
console.log("\n2. Creating S3 Client...");
const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

console.log("S3 Client created successfully");

// Test 1: List buckets
console.log("\n3. Testing ListBuckets...");
s3.send(new ListBucketsCommand({}))
  .then((data) => {
    console.log("✅ ListBuckets successful!");
    console.log("Available buckets:", data.Buckets?.map((b) => b.Name) || []);

    // Test 2: Check if our bucket exists
    const bucketName = process.env.R2_BUCKET_NAME || "sorbonexus";
    const bucketExists = data.Buckets?.some((b) => b.Name === bucketName);
    console.log(
      `\n4. Bucket '${bucketName}' exists:`,
      bucketExists ? "✅ Yes" : "❌ No"
    );

    if (bucketExists) {
      // Test 3: Try to upload a test file
      console.log("\n5. Testing file upload...");
      const testKey = `test-${Date.now()}.txt`;
      const testContent = "This is a test file for debugging R2 connectivity.";

      const uploadCommand = new PutObjectCommand({
        Bucket: bucketName,
        Key: testKey,
        Body: testContent,
        ContentType: "text/plain",
      });

      return s3.send(uploadCommand);
    } else {
      console.log("❌ Cannot test upload - bucket does not exist");
      return Promise.reject(new Error("Bucket not found"));
    }
  })
  .then((uploadResult) => {
    console.log("✅ Test upload successful!");
    console.log("Upload result:", uploadResult);

    // Test 4: Try to delete the test file
    console.log("\n6. Testing file deletion...");
    const bucketName = process.env.R2_BUCKET_NAME || "sorbonexus";
    const testKey = `test-${Date.now()}.txt`;

    const deleteCommand = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: testKey,
    });

    return s3.send(deleteCommand);
  })
  .then((deleteResult) => {
    console.log("✅ Test deletion successful!");
    console.log("Delete result:", deleteResult);
    console.log(
      "\n🎉 All R2 tests passed! The configuration is working correctly."
    );
  })
  .catch((err) => {
    console.log("\n❌ R2 test failed:");
    console.log("Error message:", err.message);
    console.log("Error code:", err.code);
    console.log("Error name:", err.name);

    if (err.$metadata) {
      console.log("HTTP Status Code:", err.$metadata.httpStatusCode);
      console.log("Request ID:", err.$metadata.requestId);
      console.log("Attempts:", err.$metadata.attempts);
    }

    // Provide specific guidance based on error type
    if (err.code === "InvalidAccessKeyId") {
      console.log(
        "\n💡 Suggestion: Check your R2_ACCESS_KEY_ID - it appears to be invalid"
      );
    } else if (err.code === "SignatureDoesNotMatch") {
      console.log(
        "\n💡 Suggestion: Check your R2_SECRET_ACCESS_KEY - it appears to be invalid"
      );
    } else if (err.code === "NoSuchBucket") {
      console.log(
        "\n💡 Suggestion: Check your R2_BUCKET_NAME - the bucket doesn't exist"
      );
    } else if (err.code === "AccessDenied") {
      console.log(
        "\n💡 Suggestion: Your API token doesn't have permission to access this bucket"
      );
    } else if (err.code === "ENOTFOUND" || err.code === "ECONNREFUSED") {
      console.log(
        "\n💡 Suggestion: Check your R2_ENDPOINT - it appears to be incorrect or unreachable"
      );
    }
  });
