const convict = require("convict");

// Define a schema
const config = convict({
  env: {
    doc: "The application environment.",
    format: ["production", "development", "test"],
    default: "development",
    env: "NODE_ENV"
  },
  credentials: {
    vk: {
      login: {
        doc: "Login",
        format: String,
        default: "",
        env: "CREDENTIALS_VK_LOGIN"
      },
      password: {
        doc: "Password",
        format: String,
        default: "",
        env: "CREDENTIALS_VK_PASSWORD"
      },
      client_id: {
        doc: "Application client_id",
        format: String,
        default: "",
        env: "CREDENTIALS_VK_CLIENT_ID"
      },
      client_secret: {
        doc: "Application client_secret",
        format: String,
        default: "",
        env: "CREDENTIALS_VK_CLIENT_SECRET"
      },
      redirect_uri: {
        doc: "Redirect url (you should have some web app to response it)",
        format: "url",
        default: "",
        env: "CREDENTIALS_VK_REDIRECT_URI"
      }
    }
  }
});

// Load environment dependent configuration
let env = config.get("env");
config.loadFile("./config/" + env + ".json");

// Perform validation
config.validate({ allowed: "strict" });

// custom functions
config.isProductionEnv = function() {
  return this.get("env") === "production";
};

config.isDevelopmentEnv = function() {
  return this.get("env") === "development";
};

module.exports = config;
