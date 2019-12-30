const puppeteer = require("puppeteer");
const qs = require("qs");
const settings = require("./config");

const {
  client_id: clientId,
  client_secret: clientSecret,
  redirect_uri: redirectUri,
  login,
  password
} = settings.get("credentials.vk");

async function loginVk(page) {
  const INPUT_LOGIN = "#index_email";
  const INPUT_PASSWORD = "#index_pass";
  const SUBMIT_SELECTOR = "#index_login_button";

  try {
    await page.goto("https://vk.com/");
    await page.waitForSelector(SUBMIT_SELECTOR);
    await page.type(INPUT_LOGIN, login);
    await page.type(INPUT_PASSWORD, password);
    await page.click(SUBMIT_SELECTOR);
    await page.waitForNavigation();
    console.log("login VK success");

    return true;
  } catch (error) {
    console.log("login VK error:", error.message);
    return false;
  }
}

async function getCode(page) {
  const codeRegex = /code=(.*)$/;
  const baseUrl = "https://oauth.vk.com/authorize";
  const queryString = qs.stringify({
    client_id: clientId,
    display: "page",
    redirect_uri: redirectUri,
    scope: "friends",
    response_type: "code",
    v: "5.103"
  });

  try {
    const url = `${baseUrl}?${queryString}`;
    await page.goto(url);
    const redirectedUrl = page.url();

    return redirectedUrl && redirectedUrl.match(codeRegex)[1];
  } catch (error) {
    console.log("getCode error:", error.message);
    return;
  }
}

async function getToken(page, code) {
  const baseUrl = "https://oauth.vk.com/access_token";
  const queryString = qs.stringify({
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    code: code
  });
  try {
    const url = `${baseUrl}?${queryString}`;
    let response = await page.goto(url);
    const body = await response.json();

    return body && body["access_token"];
  } catch (error) {
    console.log("getToken error:", error.message);
    return;
  }
}

const DEBUG = process.argv[2] === "true" || false;

(async () => {
  let slowMo = DEBUG ? 100 : 0;
  const browser = await puppeteer.launch({
    headless: !DEBUG,
    devtools: DEBUG,
    slowMo: slowMo
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 768 });

  const loginResult = await loginVk(page);
  const code = await getCode(page);
  const token = await getToken(page, code);

  console.log("Token is: ", token);
  console.log("The END");

  DEBUG ? {} : await browser.close();
})();
