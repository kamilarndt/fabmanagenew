#!/usr/bin/env node

/**
 * Setup Figma integration
 * This script helps set up the Figma integration for design tokens
 */

const fs = require("fs");
const path = require("path");
const readline = require("readline");

const ENV_FILE = path.join(__dirname, "..", ".env.local");
const GITHUB_SECRETS_FILE = path.join(
  __dirname,
  "..",
  ".github",
  "secrets.example"
);

/**
 * Create readline interface
 */
function createReadlineInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}

/**
 * Ask a question and return the answer
 */
function askQuestion(rl, question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

/**
 * Create environment file
 */
function createEnvFile(figmaApiToken, figmaFileKey) {
  const envContent = `# Figma Integration
FIGMA_API_TOKEN=${figmaApiToken}
FIGMA_FILE_KEY=${figmaFileKey}

# GitHub Secrets (copy these to your repository secrets)
# FIGMA_API_TOKEN=${figmaApiToken}
# FIGMA_FILE_KEY=${figmaFileKey}
`;

  fs.writeFileSync(ENV_FILE, envContent);
  console.log(`✅ Environment file created: ${ENV_FILE}`);
}

/**
 * Create GitHub secrets example file
 */
function createGitHubSecretsExample(figmaApiToken, figmaFileKey) {
  const secretsContent = `# GitHub Secrets Configuration
# Copy these values to your repository secrets at:
# https://github.com/your-username/your-repo/settings/secrets/actions

FIGMA_API_TOKEN=${figmaApiToken}
FIGMA_FILE_KEY=${figmaFileKey}

# Optional: Slack webhook for notifications
SLACK_WEBHOOK=your-slack-webhook-url
`;

  fs.writeFileSync(GITHUB_SECRETS_FILE, secretsContent);
  console.log(`✅ GitHub secrets example created: ${GITHUB_SECRETS_FILE}`);
}

/**
 * Validate Figma API token format
 */
function validateApiToken(token) {
  // Figma API tokens are typically 32 characters long
  return token && token.length >= 20;
}

/**
 * Validate Figma file key format
 */
function validateFileKey(key) {
  // Figma file keys are typically alphanumeric
  return key && /^[a-zA-Z0-9]+$/.test(key);
}

/**
 * Test Figma API connection
 */
async function testFigmaConnection(apiToken, fileKey) {
  console.log("🔍 Testing Figma API connection...");

  try {
    const https = require("https");

    const response = await new Promise((resolve, reject) => {
      const req = https.request(
        `https://api.figma.com/v1/files/${fileKey}`,
        {
          headers: {
            "X-Figma-Token": apiToken,
          },
        },
        (res) => {
          let data = "";
          res.on("data", (chunk) => (data += chunk));
          res.on("end", () => {
            try {
              const parsed = JSON.parse(data);
              resolve({ statusCode: res.statusCode, data: parsed });
            } catch (e) {
              reject(new Error("Failed to parse response"));
            }
          });
        }
      );

      req.on("error", reject);
      req.end();
    });

    if (response.statusCode === 200) {
      console.log(
        `✅ Successfully connected to Figma file: ${response.data.name}`
      );
      return true;
    } else {
      console.log(
        `❌ Failed to connect to Figma file: ${
          response.data.message || "Unknown error"
        }`
      );
      return false;
    }
  } catch (error) {
    console.log(`❌ Error testing Figma connection: ${error.message}`);
    return false;
  }
}

/**
 * Main execution
 */
async function main() {
  console.log("🚀 Setting up Figma integration for design tokens...\n");

  const rl = createReadlineInterface();

  try {
    // Get Figma API token
    console.log("📝 You need a Figma API token to access your design files.");
    console.log(
      "   Get one from: https://www.figma.com/developers/api#access-tokens\n"
    );

    const figmaApiToken = await askQuestion(rl, "Enter your Figma API token: ");

    if (!validateApiToken(figmaApiToken)) {
      console.log("❌ Invalid API token format. Please check your token.");
      process.exit(1);
    }

    // Get Figma file key
    console.log("\n📁 You need the file key from your Figma URL.");
    console.log(
      "   Example: https://www.figma.com/file/FILE_KEY/Your-File-Name\n"
    );

    const figmaFileKey = await askQuestion(rl, "Enter your Figma file key: ");

    if (!validateFileKey(figmaFileKey)) {
      console.log("❌ Invalid file key format. Please check your file key.");
      process.exit(1);
    }

    // Test connection
    const connectionOk = await testFigmaConnection(figmaApiToken, figmaFileKey);

    if (!connectionOk) {
      console.log(
        "\n❌ Failed to connect to Figma. Please check your credentials."
      );
      process.exit(1);
    }

    // Create configuration files
    console.log("\n📝 Creating configuration files...");

    createEnvFile(figmaApiToken, figmaFileKey);
    createGitHubSecretsExample(figmaApiToken, figmaFileKey);

    console.log("\n✅ Figma integration setup completed successfully!");
    console.log("\n📋 Next steps:");
    console.log(
      "   1. Copy the secrets from .github/secrets.example to your GitHub repository secrets"
    );
    console.log(
      '   2. Run "npm run sync-tokens" to fetch your first design tokens'
    );
    console.log(
      "   3. The CI/CD pipeline will automatically sync tokens daily"
    );
  } catch (error) {
    console.error("❌ Setup failed:", error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  createEnvFile,
  createGitHubSecretsExample,
  testFigmaConnection,
};
