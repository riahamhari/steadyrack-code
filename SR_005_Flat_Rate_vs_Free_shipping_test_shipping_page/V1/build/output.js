
					/**
Test name: SR 005 Flat Rate vs Free shipping test - V1
Developed by: Riah Amhari
**/

'use strict';

(async () => {
  try {

var queryShadowDom = (root, sel) => {
  const [h, ...rest] = sel.split("::");
  const hosts = root.querySelectorAll(h.trim());
  if (hosts.length === 0) return [];
  const remainingSelector = rest.join("::");
  if (remainingSelector === "") {
    return Array.from(hosts).map((host) => host.shadowRoot).filter((shadowRoot) => shadowRoot !== null);
  }
  const results = [];
  for (const host of hosts) {
    if (host.shadowRoot) {
      results.push(...queryAll(host.shadowRoot, remainingSelector));
    }
  }
  return results;
};
var queryAll = (root, sel) => sel.includes("::") ? queryShadowDom(root, sel) : [...root.querySelectorAll(sel)];
var queryWithAlternative = (root, selectors) => {
  for (const selector of selectors) {
    const result2 = queryAll(root, selector);
    if (result2.length > 0) return result2;
  }
  return [];
};

var watchers = window.__responseWatchers ??= /* @__PURE__ */ new Map();

var waitForSelectors = (selectors, options = {}) => {
  const { forceArray = false } = options;
  let cache = [];
  return {
    name: "selectors",
    check: () => {
      cache = selectors?.map((s) => {
        const selectorArray = Array.isArray(s) ? s : [s];
        return queryWithAlternative(document, selectorArray);
      });
      return cache?.every((arr) => arr.length > 0);
    },
    get: () => ({
      elements: cache.map((arr) => forceArray ? arr : arr.length === 1 ? arr[0] : arr)
    })
  };
};

var waitForAll = (...args) => {
  const lastArg = args.at(-1);
  const isOptions = lastArg && !("check" in lastArg);
  const sources = isOptions ? args.slice(0, -1) : args;
  const { timeout = 1e4, interval = 16, onUpdate } = isOptions ? lastArg : {};
  const startTime = Date.now();
  let prevHash = "";
  const poll = () => {
    const allReady = sources.every((s) => s.check());
    const payload = Object.assign(
      {},
      ...sources.map((s) => {
        try {
          return s.get();
        } catch {
          return {};
        }
      })
    );
    if (onUpdate) {
      const currentHash = JSON.stringify(payload);
      if (currentHash !== prevHash) {
        onUpdate(payload);
        prevHash = currentHash;
      }
    }
    if (allReady) return Promise.resolve(payload);
    if (Date.now() - startTime > timeout) {
      const notReady = sources.filter((s) => !s.check()).map((s) => s.name || "unknown");
      return Promise.reject(new Error(`Timeout after ${timeout}ms: ${notReady.join(", ")}`));
    }
    return new Promise((resolve) => setTimeout(() => resolve(poll()), interval));
  };
  return poll();
};

var variant = "V1";

var _variant;
var setVariant = (v2) => {
  _variant = v2;
};
var getVariant = () => _variant;

var freeShippingThresholds = {
  V1: {
    na: "$300",
    eu: "$300",
    uk: "\xA3300"
  },
  V2: {
    na: "$200",
    eu: "\u20AC250",
    uk: "\xA3250"
  }
};
var siteLocationMap = {
  "www.steadyrack.com": "na",
  "eu.steadyrack.com": "eu",
  "uk.steadyrack.com": "uk"
};
var copy = { freeShipping: "FREE Shipping available on orders over" };

var init = (shippingInfo, shippingHeader2) => {
  const variant2 = getVariant();
  const hostName = window.location.hostname;
  const siteLocation = siteLocationMap[hostName];
  const threshold = freeShippingThresholds[variant2][siteLocation];
  if (!threshold) return;
  shippingInfo.textContent = `
				   ${copy.freeShipping} ${threshold}${siteLocation === "na" ? " USD" : ""} to selected locations. See below for further information.`;
  shippingHeader2.textContent = `Free Shipping Locations`;
};

var tagInterval = setInterval(() => {
  if (typeof window?.clarity === "function") {
    window.clarity("set", "test-SR005", "variation-1");
    clearInterval(tagInterval);
  }
}, 300);
var v = variant;
setVariant(v);
var result = await waitForAll(
  waitForSelectors(
    [
      "#MainContent .l-richtext__text strong",
      "#Specifications--template--25801115009309__a_product_specification_columns_cFhMKA .l-specification-columns__column:first-child .l-specification-columns__column-title"
    ],
    { forceArray: true }
  )
);
var [[shippingAnnouncement], [shippingHeader]] = result.elements;
init(shippingAnnouncement, shippingHeader);

  } catch (error) {
    const stack = error.stack || '';
    const lineMatch = stack.match(/:([0-9]+):([0-9]+)/);
    const location = lineMatch ? `Line ${lineMatch[1]}, Column ${lineMatch[2]}` : 'Unknown location';

    console.error(`\u274C Opti test error | Test ID: SR_005 |`);
    console.error(`\u{1F4CD} Location: ${location}`);
    console.error(`\u{1F50D} Stack trace:`, error.stack);
  }
})();
					document.body.insertAdjacentHTML('afterbegin', `
<style>

</style>`);
				