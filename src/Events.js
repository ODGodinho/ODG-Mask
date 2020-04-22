import ODGMask from "./ODGMask";
(() => {

  const validateEvent = (event) => {
    try {
      const el = event.target;

      if (!el) return false;

      const mask = el.getAttribute("odg-mask");

      if (!mask) return false;
    } catch (error) {
      return false;
    }

    return true;
  };


  document.addEventListener(
    "input",
    (event) => {

      if (!validateEvent(event)) return;

      const el = event.target;
      const mask = el.getAttribute("odg-mask");

      const nValue = ODGMask(
        el.value,
        mask
      );

      if (nValue.value !== el.value) {
        el.value = nValue.value;
        el.selectionStart = nValue.value.length;
        el.selectionEnd = nValue.value.length;
      }
    }
  );

})();