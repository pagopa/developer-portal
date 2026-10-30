const { URL } = require("url");
const synthetics = require("@aws/synthetics-puppeteer");
const log = require("@aws/synthetics-logger");
const syntheticsLogHelper = require("@aws/synthetics-log-helper");

const loadBlueprint = async function () {
  const urls = JSON.parse(process.env.URLS);
  const takeScreenshot = false;
  const hostnameCounts = new Map();
  const hostnameCounters = new Map();

  urls.forEach((url) => {
    try {
      const hostname = new URL(url).hostname.toLowerCase();
      hostnameCounts.set(hostname, (hostnameCounts.get(hostname) || 0) + 1);
    } catch (e) {
      // Invalid URLs are reported by loadUrl.
    }
  });

  const page = await synthetics.getPage();
  for (const url of urls) {
    await loadUrl(page, url, takeScreenshot, hostnameCounts, hostnameCounters);
  }
};

const resetPage = async function (page) {
  try {
    await page.goto("about:blank", {
      waitUntil: ["load", "networkidle0"],
      timeout: 30000,
    });
  } catch (e) {
    synthetics.addExecutionError("Unable to open a blank page. ", e);
  }
};

const loadUrl = async function (
  page,
  url,
  takeScreenshot,
  hostnameCounts,
  hostnameCounters
) {
  let stepName = null;
  let domcontentloaded = false;

  try {
    const hostname = new URL(url).hostname;
    const lowerHostname = hostname.toLowerCase();
    const count = hostnameCounts.get(lowerHostname) || 1;

    if (count > 1) {
      const counter = (hostnameCounters.get(lowerHostname) || 0) + 1;
      hostnameCounters.set(lowerHostname, counter);
      stepName = hostname + "_" + counter;
    } else {
      stepName = hostname;
    }
  } catch (e) {
    log.error(`Error parsing url: ${url}. ${e}`);
    throw e;
  }

  await synthetics.executeStep(stepName, async function () {
    const sanitizedUrl = syntheticsLogHelper.getSanitizedUrl(url);
    const response = await page.goto(url, {
      waitUntil: ["domcontentloaded"],
      timeout: 30000,
    });

    if (response) {
      domcontentloaded = true;
      const status = response.status();
      const statusText = response.statusText();
      log.info(
        `Response from url: ${sanitizedUrl}  Status: ${status}  Status Text: ${statusText}`
      );

      if (status < 200 || status > 299) {
        throw new Error(
          `Failed to load url: ${sanitizedUrl} ${status} ${statusText}`
        );
      }
    } else {
      const message = `No response returned for url: ${sanitizedUrl}`;
      log.error(message);
      throw new Error(message);
    }
  });

  if (domcontentloaded && takeScreenshot) {
    await new Promise((resolve) => setTimeout(resolve, 15000));
    await synthetics.takeScreenshot(stepName, "loaded");
  }

  await resetPage(page);
};

exports.handler = async () => {
  return await loadBlueprint();
};
