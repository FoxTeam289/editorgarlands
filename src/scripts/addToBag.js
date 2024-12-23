/** @format */

export const addToBag = async () => {
  const btn = document.querySelector("[data-add-to-bag]");
  const input = document.querySelector("[data-input-text]");

  if (!btn || !input) return;

  btn.addEventListener("click", async () => {
    if (input.value === "") {
      btn.disabled = true;
    } else {
      btn.disabled = false;

      const text = document.querySelector('[data-input-text="your-phrase"]');
      const wallMount = document.querySelector("[data-counter-number]");
      const total = document.querySelector("[data-total]");
      const colors = document.querySelectorAll(".color__items .item__input");

      const data = {
        "Ваша фраза": text.value,
        "Добавить крепление": Number(wallMount.textContent),
        total: Number(total.textContent),
      };

      for (const color of colors) {
        color.checked && (data["Цвет"] = color.value);
      }

      const encryptedData = await encryptData(JSON.stringify(data));
      const newUrl = `https://astrostori.ru/girlyndi?data=${encodeURIComponent(encryptedData)}`;
      window.location.href = newUrl;
    }
  });
};

const encryptData = async (data) => {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode("f7a8c9d4e5b6g7h8"), // Секретный ключ
    { name: "AES-GCM" },
    false,
    ["encrypt"]
  );
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encoder.encode(data));
  return `${btoa(String.fromCharCode(...new Uint8Array(iv)))}.${btoa(String.fromCharCode(...new Uint8Array(encrypted)))}`;
};
