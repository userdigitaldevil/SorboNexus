require("dotenv").config();
const { S3Client, ListObjectsV2Command } = require("@aws-sdk/client-s3");

// Cloudflare R2 config
const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

const BUCKET = process.env.R2_BUCKET_NAME;

async function testR2Connection() {
  try {
    console.log("Testing R2 connection...");
    console.log("Endpoint:", process.env.R2_ENDPOINT);
    console.log("Bucket:", BUCKET);
    console.log("Custom Domain:", process.env.R2_CUSTOM_DOMAIN);

    const command = new ListObjectsV2Command({
      Bucket: BUCKET,
      MaxKeys: 5,
    });

    const response = await s3.send(command);
    console.log("✅ R2 connection successful!");
    console.log("Objects in bucket:", response.Contents?.length || 0);

    if (response.Contents && response.Contents.length > 0) {
      console.log("Sample objects:");
      response.Contents.slice(0, 3).forEach((obj) => {
        console.log(`  - ${obj.Key} (${obj.Size} bytes)`);
      });
    }
  } catch (error) {
    console.error("❌ R2 connection failed:", error.message);
    console.error("Full error:", error);
  }
}

testR2Connection();
