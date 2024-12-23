export const addToBag = () => {
  const order = document.querySelector('a[href="#order"]');
  const btn = document.querySelector("[data-add-to-bag]");

  if (!order && !btn) return;

  btn.addEventListener("click", () => {
    order.click();
  });
};
