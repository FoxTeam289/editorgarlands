import { addSelect } from "../addSelect";
import { blocksChecking } from "../blocksChecking";
import { addToBag } from "../addToBag";

const totalPrice = document.querySelector("[data-total]");
const inputs = document.querySelectorAll("[data-input]");
const inputText = document.querySelector("[data-input-text]");
const symbols = document.querySelectorAll("[data-symbol]");
const data = {};
const dataPrice = {};

let fasteningQuantity = 0;

const colors = { black: "черный", white: "белый", red: "оранжевый" };

const checkForActivity = (input, productsWrapper) => {
  if (!input.checked) return;

  data[input.name] = input.value;
  addSelect(productsWrapper, data);
};

const checkForEmptyText = (input) => {
  if (input.value !== "") return;

  delete data[input.name];
};

const totalSum = (input, priceValue, type = false) => {
  if (type === "text") {
    const countVisibleCharacters = (el) => {
      if (!el.trim()) {
        return 0;
      }

      const visibleCharPattern =
        /[\uD800-\uDBFF][\uDC00-\uDFFF]|[\u0020-\u007E\u00A0-\uD7FF\uE000-\uFEFE]/g;
      const matches = el.match(visibleCharPattern);

      return matches ? matches.filter((char) => !/^\s*$/.test(char)).length : 0;
    };

    dataPrice[input.name] = Number(countVisibleCharacters(input.value)) * 55;
  } else if (type === "counter") {
    dataPrice[input.name] = fasteningQuantity * 55;
  } else {
    if (!input.checked) return;

    dataPrice[input.name] = Number(input.dataset.price);
  }

  const sum = Object.values(dataPrice).reduce(
    (acc, currentValue) => acc + currentValue,
    0,
  );

  totalPrice.innerHTML = sum;

  if (priceValue) {
    priceValue.innerHTML = sum;
    priceValue.setAttribute("data-product-price-def", sum);
    priceValue.setAttribute("data-product-price-def-str", sum);
  }
};

const changeColor = () => {
  if (!symbols.length) return;

  const typeColor = data["type-color"];

  symbols.forEach((symbol) => {
    const color = symbol.dataset.symbolColor;

    colors[color] !== typeColor
      ? symbol.classList.add("hide")
      : symbol.classList.remove("hide");
  });
};

const emojiSelection = (productsWrapper, priceValue) => {
  if (!symbols.length) return;

  symbols.forEach((symbol) => {
    symbol.addEventListener("click", () => {
      const text = symbol.textContent;
      const inputElement = inputText;

      const currentValue = inputElement.value;

      let cursorStart = inputElement.selectionStart;
      let cursorEnd = inputElement.selectionEnd;

      const newValue =
        currentValue.slice(0, cursorStart) +
        text +
        currentValue.slice(cursorEnd);

      inputElement.value = newValue;

      cursorStart += text.length;
      cursorEnd = cursorStart;

      inputElement.setSelectionRange(cursorStart, cursorEnd);
      inputElement.focus();

      totalSum(inputText, priceValue, "text");
      data[inputText.name] = inputText.value;
      addSelect(productsWrapper, data);
    });
  });
};

const setupCounter = (priceValue, productsWrapper) => {
  const counterEl = document.querySelector("[data-counter]");
  if (!counterEl) return;

  const btnMinus = counterEl.querySelector("[data-counter-btn-minus]");
  const btnPlus = counterEl.querySelector("[data-counter-btn-plus]");
  const number = counterEl.querySelector("[data-counter-number]");

  const setCounter = (count) => {
    btnMinus.disabled = count <= 0;

    if (count < 0) return;

    fasteningQuantity = count;
    number.innerHTML = fasteningQuantity;

    totalSum({ name: "fastening-quantity" }, priceValue, "counter");
    console.log(fasteningQuantity);

    if (count > 0) {
      data["fastening-quantity"] = fasteningQuantity;
      addSelect(productsWrapper, data);
    } else {
      delete data["fastening-quantity"];
      addSelect(productsWrapper, data);
    }
  };

  setCounter(0);

  btnMinus.addEventListener("click", () => setCounter(fasteningQuantity - 1));
  btnPlus.addEventListener("click", () => setCounter(fasteningQuantity + 1));
};

const slider = () => {
  const photosWrap = document.querySelector(".photos__wrap");
  const images = photosWrap.querySelectorAll("img");
  const navButtons = document.querySelectorAll(".photos__nav span");
  const time = 3000;

  let currentIndex = 0;
  let timer;

  const showImage = (index) => {
    images[currentIndex].classList.remove("show");
    navButtons[currentIndex].classList.remove("show");

    currentIndex = index;
    images[currentIndex].classList.add("show");
    navButtons[currentIndex].classList.add("show");

    clearTimeout(timer);
    timer = setTimeout(nextImage, time); // Автоматическое переключение через 1 секунду
  };

  const nextImage = () => {
    const nextIndex = (currentIndex + 1) % images.length;
    showImage(nextIndex);
  };

  navButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
      showImage(index);
    });
  });

  const handleTouchStart = (event) => {
    xStart = event.touches[0].clientX;
  };

  const handleTouchMove = (event) => {
    if (!xStart) {
      return;
    }

    const xEnd = event.touches[0].clientX;
    const deltaX = xEnd - xStart;

    if (deltaX > 50) {
      // Swipe вправо
      xStart = null;
      showImage((currentIndex - 1 + images.length) % images.length);
    } else if (deltaX < -50) {
      // Swipe влево
      xStart = null;
      showImage((currentIndex + 1) % images.length);
    }
  };

  let xStart = null;

  photosWrap.addEventListener("touchstart", handleTouchStart);
  photosWrap.addEventListener("touchmove", handleTouchMove);

  timer = setTimeout(nextImage, time); // Автоматическое переключение изображений при загрузке страницы
};

export const initGarlands = () => {
  if (!totalPrice || !inputs.length || !inputText) return;

  const { productsWrapper, priceValue } = blocksChecking(".t762");

  inputs.forEach((input) => {
    checkForActivity(input, productsWrapper);
    totalSum(input, priceValue);

    input.addEventListener("change", () => {
      data[input.name] = input.value;

      input.dataset.inputColor === "true" && changeColor();

      totalSum(input, priceValue);
      addSelect(productsWrapper, data);
    });
  });

  inputText.addEventListener("input", () => {
    totalSum(inputText, priceValue, "text");

    checkForEmptyText(inputText);

    data[inputText.name] = inputText.value;
    addSelect(productsWrapper, data);
  });

  emojiSelection(productsWrapper, priceValue);
  changeColor();
  setupCounter(priceValue, productsWrapper);
  slider();
  addToBag();
};
