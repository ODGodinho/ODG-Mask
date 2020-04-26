import { isArray } from "./helper";
import tokens from "./tokens";

/**
 * @param {String} value
 * @param {String|Array} mask
 * @param {import('../types/ODGMask').ODGMasksOptions} options
 * @returns {import('../types/ODGMask').ODGMask}
 */
const ODGMask = function (value, mask, options = {
  tokens: null,
  el: null,
  currentPosition: null,
}) {

  if (isArray(mask)) {
    let $aMask = "";
    const masked = [];
    let useMask = null;

    for (let i = 0; i < mask.length; i++) {
      $aMask = mask[ i ];
      masked[ i ] = ODGMask(
        value,
        $aMask,
        options
      );
      if (useMask) {
        useMask = masked[ i ].unmasked.length > useMask.unmasked.length ? masked[ i ] : useMask;
      } else {
        useMask = masked[ i ];
      }

      if (options.firstMatch && masked[ i ].valid) {
        return masked[ i ];
      }
    }

    return useMask;
  }

  let indexMask = 0;
  let indexValue = 0;

  const $value = value || "";
  const $mask = mask || "";
  const $tokens = options.tokens || ODGMask.defaultTokens || tokens;
  const maskCount = $mask.length;
  let regexMin = 0;
  let regexMax = 0;

  let result = "";
  let resultNoMask = "";

  let cMask = "";
  let cToken = null;
  let cValue = "";
  let isCToken = null;
  let isNext = false;
  let noMask = null;
  let pMask = "";
  let pToken = null;

  while (indexMask < maskCount) {

    // Previews tokens
    pMask = $mask[ indexMask - 1 ];
    pToken = $tokens[ pMask ];

    // Current token
    cMask = $mask[ indexMask ];
    cToken = $tokens[ cMask ];
    cValue = $value[ indexValue ];

    if (pToken && pToken.nextElement) {
      cToken = cToken ? {
        ...cToken,
        ...pToken,
      } : pToken;
      cToken.nextElement = false;
    }

    isCToken = Boolean(cToken);

    cToken = cToken ? cToken : {};
    pToken = pToken ? pToken : {};

    noMask = Boolean(cToken.noMask);
    isNext = cToken ? cToken.nextElement : false;

    let valueMatch = false;

    if (cToken.pattern && !isNext && !noMask && cValue) {
      valueMatch = cToken.pattern.test(cValue);

      if (valueMatch) {
        const CVALUE_TRANSFORM = cToken.transform ? cToken.transform(cValue) : cValue;

        result += CVALUE_TRANSFORM;
        resultNoMask += CVALUE_TRANSFORM;

        regexMin += cToken.optional ? 0 : 1;
        regexMax += 1;
      }

    } else {

      if (
        (!isCToken && !isNext) ||
        (noMask && !isNext) ||
        !cValue
      ) {
        regexMin += cToken.optional ? 0 : 1;
        regexMax += 1;
        if (cValue) result += cMask;
      }
      valueMatch = true;

    }

    if (
      (valueMatch && isNext !== true && isCToken) ||
      (cToken.pattern && !cToken.optional) ||
      (cMask === cValue && (!isCToken || cToken.optional))
    ) {
      indexValue++;
    }

    if (valueMatch || cToken.optional) indexMask++;

  }

  let position = -1;

  if (options.el && options.el.tagName === "INPUT") {
    const { el } = options;

    position = el.selectionEnd;
    const digit = el.value[ position - 1 ];

    while (position <= result.length && result.charAt(position - 1) !== digit) {
      position++;
    }
  }

  const size = result.length;

  if (this) {
    this.value = result;
    this.valid = indexMask === maskCount && size >= regexMin && size <= regexMax;
    this.unmasked = resultNoMask;
    this.newPosition = position;

    return this;
  }

  return {
    value: result,
    valid: indexMask === maskCount && size >= regexMin && size <= regexMax,
    unmasked: resultNoMask,
    newPosition: position,
  };

};

ODGMask.defaultTokens = tokens;
ODGMask.prototype.defaultTokens = { ...ODGMask.defaultTokens };

window.ODGMask = ODGMask;

export default ODGMask;