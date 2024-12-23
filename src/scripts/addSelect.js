const optionNames = {
  "your-phrase": "Фраза",
  "type-color": "Цвет",
  "fastening-quantity": "Количество креплений",
};

const createProductOption = (name, value) => {
  const productOption = document.createElement("div");
  productOption.classList.add("t-product__option", "js-product-option");

  const optionTitle = document.createElement("div");
  optionTitle.classList.add(
    "t-product__option-title",
    "t-descr",
    "t-descr_xxs",
    "js-product-option-name",
  );
  optionTitle.textContent = name;

  const optionVariants = document.createElement("div");
  optionVariants.classList.add("t-product__option-variants");

  const select = document.createElement("select");
  select.classList.add(
    "t-product__option-select",
    "t-descr",
    "t-descr_xxs",
    "js-product-option-variants",
  );

  const optionElement = document.createElement("option");
  optionElement.value = value;
  optionElement.textContent = value;

  select.appendChild(optionElement);
  optionVariants.appendChild(select);
  productOption.appendChild(optionTitle);
  productOption.appendChild(optionVariants);

  return productOption;
};

export const addSelect = (block, data = null) => {
  if (!data) return;

  block.innerHTML = "";

  for (const [key, value] of Object.entries(data)) {
    const name = optionNames[key] || "Ошибка";
    const productOptionElement = createProductOption(name, value);
    block.appendChild(productOptionElement);
  }
};
