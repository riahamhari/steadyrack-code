
					/**
Test name: SR AU002 Buy More Save More - V1
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

var PRICE_VALUES = {
  discountPrice: "$114.99",
  strikethroughPrice: "$129.99",
  discountPercentage: "11%"
};

var init = (priceEls2) => {
  priceEls2.forEach((price) => {
    price.classList.add("au-002-price");
    price.innerHTML = `<span class="au-002-price__strikethrough-price">${PRICE_VALUES.strikethroughPrice}</span>
						<span class="au-002-price__discount-price">${PRICE_VALUES.discountPrice}</span>
						<span class="au-002-price__discountPct-label">${PRICE_VALUES.discountPercentage} OFF</span>`;
  });
};
var BREAKDOWN_ID = "au-002-cart-breakdown";
var applyCartChanges = (targetNode) => {
  const freeShippingUnlockTxt = targetNode.querySelector(".unicorn_cart_unlock span strong");
  const checkoutBtnTxt = targetNode.querySelector(".unicorn_cart_checkout_button_text");
  const priceContainer = targetNode.querySelector(".items_prices__kPZpv");
  const cartFooter = targetNode.querySelector(".unicorn_cart_footer .unicorn_cart_block");
  const price = priceContainer?.querySelector(
    "span:not(.au-002-cart-price__strikethrough):not(.au-002-cart-price__discountPrice)"
  );
  if (!freeShippingUnlockTxt || !checkoutBtnTxt || !priceContainer || !cartFooter || !price) return false;
  const priceVal = parseAmount(price.textContent);
  const discountVal = Math.floor(Math.floor(priceVal) * 0.89) + 0.99;
  const discountAmount = Math.round(priceVal - discountVal).toFixed(2);
  const strikethroughEl = priceContainer.querySelector(".au-002-cart-price__strikethrough");
  const discountEl = priceContainer.querySelector(".au-002-cart-price__discountPrice");
  if (strikethroughEl && discountEl) {
    strikethroughEl.textContent = price.textContent;
    discountEl.textContent = `$${discountVal}`;
  } else {
    console.log("inserting strikethrough price");
    priceContainer.insertAdjacentHTML(
      "beforeend",
      `<span class="au-002-cart-price__strikethrough" style="display: block; font-size: 14px; text-align: right; text-transform: none; line-height: 1.2; width: auto;">${price.textContent}</span>
			<span class="au-002-cart-price__discountPrice" style="display: block; font-size: 14px; text-align: right; text-transform: none; line-height: 1.2; width: auto;">$${discountVal}</span>`
    );
  }
  const existing = cartFooter.querySelector(`#${BREAKDOWN_ID}`);
  if (existing) {
    existing.querySelector(".au-002-bd__subtotal-val").textContent = price.textContent;
    existing.querySelector(".au-002-bd__discount-val").textContent = `-$${discountAmount}`;
    existing.querySelector(".au-002-bd__total-val").textContent = `$${discountVal}`;
  } else {
    const breakdown = document.createElement("div");
    breakdown.id = BREAKDOWN_ID;
    breakdown.innerHTML = `
			<div class="au-002-bd__row au-002-bd__row--subtotal">
				<span class="au-002-bd__label">Subtotal</span>
				<span class="au-002-bd__subtotal-val">${price.textContent}</span>
			</div>
			<div class="au-002-bd__row au-002-bd__row--discount">
				<span class="au-002-bd__label">Discount (11%)</span>
				<span class="au-002-bd__discount-val">-$${discountAmount}</span>
			</div>
			<div class="au-002-bd__row au-002-bd__row--total">
				<span class="au-002-bd__label">Total</span>
				<span class="au-002-bd__total-val">$${discountVal}</span>
			</div>
		`;
    cartFooter.prepend(breakdown);
  }
  return true;
};
var parseAmount = (text) => {
  const match = text.match(/[\$€£]([\d,.]+)/);
  return match ? parseFloat(match[1].replace(",", "")) : 0;
};
var observeUnicornCart = (targetNode) => {
  applyCartChanges(targetNode);
  const config = { attributes: true, childList: true, subtree: true };
  const observer = new MutationObserver(() => {
    observer.disconnect();
    let intervalId;
    const reconnect = () => {
      clearInterval(intervalId);
      observer.observe(targetNode, config);
    };
    intervalId = setInterval(() => {
      if (applyCartChanges(targetNode)) reconnect();
    }, 300);
    setTimeout(reconnect, 3e3);
  });
  observer.observe(targetNode, config);
};

var tagInterval = setInterval(() => {
  if (typeof window?.clarity === "function") {
    window.clarity("set", "test-AU002", "variation-1");
    clearInterval(tagInterval);
  }
}, 300);
var result = await waitForAll(
  waitForSelectors([".l-product__price-normal.l-leading-1", "#unicorn-cart-block"], { forceArray: true })
);
var [priceEls, [unicornCartBlock]] = result.elements;
document.cookie = "discount_code=DISCOUNT11; path=/";
init(priceEls);
observeUnicornCart(unicornCartBlock);

  } catch (error) {
    const stack = error.stack || '';
    const lineMatch = stack.match(/:([0-9]+):([0-9]+)/);
    const location = lineMatch ? `Line ${lineMatch[1]}, Column ${lineMatch[2]}` : 'Unknown location';

    console.error(`\u274C Opti test error | Test ID: SR_AU002 |`);
    console.error(`\u{1F4CD} Location: ${location}`);
    console.error(`\u{1F50D} Stack trace:`, error.stack);
  }
})();
					document.body.insertAdjacentHTML('afterbegin', `
<style>
#rbr-container-element-volume,
.unicorn_cart_cell:has(.items_bulk_discounts__8WDn-) {
  display: none;
}

.au-002-price {
  display: flex;
  gap: 8px;
}
.au-002-price__strikethrough-price {
  color: #636363;
  text-decoration: line-through;
}
.au-002-price__discountPct-label {
  color: #fff;
  font-size: 12px;
  background-color: #f60113;
  border-radius: 8px;
  padding: 4px;
  height: fit-content;
  align-self: center;
}

.items_prices__kPZpv {
  flex-direction: column;
}
.items_prices__kPZpv span:nth-child(1),
.items_prices__kPZpv span:nth-child(2) {
  display: none;
}
.items_prices__kPZpv .au-002-cart-price__strikethrough {
  text-decoration: line-through;
}
.items_prices__kPZpv::after {
  display: block;
  content: "11% OFF";
  color: #fff;
  font-size: 12px;
  background-color: #f60113;
  border-radius: 8px;
  padding: 4px;
  font-weight: 600;
}

.unicorn_cart_cell .unicorn_discount_tag {
  display: none;
}

#au-002-cart-breakdown {
  width: 100%;
  padding: 12px 0;
  border-bottom: 1px solid #e5e5e5;
  margin-bottom: 8px;
}

.au-002-bd__row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
  font-size: 14px;
}
.au-002-bd__row--discount {
  color: #27ae60;
}
.au-002-bd__row--total {
  font-weight: 700;
  font-size: 15px;
  border-top: 1px solid #e5e5e5;
  margin-top: 6px;
  padding-top: 10px;
}

#unicorn_checkout_submit .unicorn_cart_checkout_button_text {
  font-size: 0;
}
#unicorn_checkout_submit .unicorn_cart_checkout_button_text::after {
  content: "Checkout";
  font-size: 16px;
}
</style>`);
				