const obj = { productsWrapper: null, priceValue: null };

export const blocksChecking = (nameBlock) => {
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
