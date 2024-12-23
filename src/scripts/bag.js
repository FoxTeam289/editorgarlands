/** @format */

export const bag = () => {
  const obj = { productsWrapper: null, priceValue: null };

  document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const encryptedData = urlParams.get("data");
    const order = document.querySelector('a[href="#order"]');

    if (encryptedData && order) {
      await getDecryptedDataFromUrl();
      window.history.replaceState({}, document.title, window.location.pathname);

      setTimeout(() => {
        order.click();
      }, 1500);
    }
  });

  const createProductOption = (name, value) => {
    const productOption = document.createElement("div");
    productOption.classList.add("t-product__option", "js-product-option");

    const optionTitle = document.createElement("div");
    optionTitle.classList.add("t-product__option-title", "t-descr", "t-descr_xxs", "js-product-option-name");
    optionTitle.textContent = name;

    const optionVariants = document.createElement("div");
    optionVariants.classList.add("t-product__option-variants");

    const select = document.createElement("select");
    select.classList.add("t-product__option-select", "t-descr", "t-descr_xxs", "js-product-option-variants");

    const optionElement = document.createElement("option");
    optionElement.value = value;
    optionElement.textContent = value;

    select.appendChild(optionElement);
    optionVariants.appendChild(select);
    productOption.appendChild(optionTitle);
    productOption.appendChild(optionVariants);

    return productOption;
  };

  const decryptData = async (encryptedData, iv) => {
    const decoder = new TextDecoder();
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode("f7a8c9d4e5b6g7h8"), // Должен быть тот же 16-символьный ключ
      { name: "AES-GCM" },
      false,
      ["decrypt"]
    );
    const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, encryptedData);
    return decoder.decode(decrypted);
  };

  const blocksChecking = (nameBlock) => {
    const block = document.querySelector(nameBlock);
    if (!block) return obj;

    const info = block.querySelector(`${nameBlock}__info`);
    if (!info) return obj;

    const productsWrapper = info.querySelector(".js-product-controls-wrapper");
    const priceValue = info.querySelector(`${nameBlock}__price-value`);

    obj.productsWrapper = productsWrapper;
    obj.priceValue = priceValue;

    return obj;
  };

  const getDecryptedDataFromUrl = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const encryptedData = urlParams.get("data");

    if (!encryptedData) {
      console.log("No data found in URL");
      return null;
    }

    const [ivBase64, dataBase64] = encryptedData.split(".");
    const iv = Uint8Array.from(atob(ivBase64), (c) => c.charCodeAt(0));
    const encrypted = Uint8Array.from(atob(dataBase64), (c) => c.charCodeAt(0));

    const decryptedData = await decryptData(encrypted, iv);
    const { productsWrapper, priceValue } = blocksChecking(".t762");

    const data = JSON.parse(decryptedData);

    priceValue.innerHTML = data.total;
    priceValue.setAttribute("data-product-price-def", data.total);
    priceValue.setAttribute("data-product-price-def-str", data.total);

    productsWrapper.innerHTML = "";

    for (const [key, value] of Object.entries(data)) {
      const name = key;

      if (name !== "total") {
        const productOptionElement = createProductOption(name, value);
        productsWrapper.appendChild(productOptionElement);
      }
    }
  };
};
