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
  reverse: null,
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
  const $mask = String(mask) || "";
  const $tokens = options.tokens || ODGMask.defaultTokens || tokens;

  const maskCount = $mask.length;

  const isReverse = Boolean(options.reverse);

  let regexMin = 0;
  let regexMax = 0;

  let $check = function () {
    return indexMask < maskCount;
  };

  if (isReverse) {
    indexMask = $mask.length - 1;
    indexValue = $value.length - 1;

    $check = function () {
      return indexMask > -1;
    };

  }

  let result = "";
  let resultNoMask = "";
  let resultNoMaskWithNoMask = "";

  let cMaskToken = "";
  let cToken = null;
  let cValue = "";
  let isCToken = null;
  let isNext = false;
  let noMaskToken = null;
  let pMask = "";
  let pToken = null;
  const i = 0;

  const saveValue = () => {
    regexMin += cToken.optional ? 0 : 1;
    regexMax += 1;
    if (cValue && isReverse) {
      result = cMaskToken + result;
      if (cToken.optional || cToken.noMask) {
        resultNoMaskWithNoMask = cMaskToken + resultNoMaskWithNoMask;
      }
    } else if (cValue && !isReverse) {
      result += cMaskToken;
      if (cToken.optional || cToken.noMask) {
        resultNoMaskWithNoMask = cMaskToken + resultNoMaskWithNoMask;
      }
    }
  };

  const nextValue = () => {
    if (isReverse) {
      indexValue--;
    } else {
      indexValue++;
    }
  };

  const nextMask = () => {
    if (isReverse) {
      indexMask--;
    } else {
      indexMask++;
    }
  };

  while ($check()) {

    // Previews tokens
    pMask = $mask[ indexMask - 1 ];
    pToken = { ...$tokens[ pMask ] };

    // Current token
    cMaskToken = $mask[ indexMask ];
    cToken = { ...$tokens[ cMaskToken ] };
    cValue = $value[ indexValue ];

    isCToken = Object.keys(cToken).length > 0;

    if (pToken && pToken.nextElement) {
      cToken = cToken ? {
        ...cToken,
        ...pToken,
      } : pToken;
      cToken.nextElement = false;
    }

    noMaskToken = Boolean(cToken.noMask);
    isNext = cToken ? cToken.nextElement : false;

    if (isNext) {
      nextMask();
      continue;
    }

    if (noMaskToken) {
      saveValue();
      nextMask();
      if (cValue === cMaskToken) nextValue();
      continue;
    }

    let valueMatch = false;

    if (cToken.pattern && cValue) {
      valueMatch = cToken.pattern.test(cValue);

      if (valueMatch) {
        const CVALUE_TRANSFORM = cToken.transform ? cToken.transform(cValue) : cValue;

        if (isReverse) {
          result = CVALUE_TRANSFORM + result;
          resultNoMask = CVALUE_TRANSFORM + resultNoMask;
          resultNoMaskWithNoMask = CVALUE_TRANSFORM + resultNoMask;
        } else {
          result += CVALUE_TRANSFORM;
          resultNoMask += CVALUE_TRANSFORM;
          resultNoMaskWithNoMask += CVALUE_TRANSFORM;
        }

        regexMin += cToken.optional ? 0 : 1;
        regexMax += 1;
      }

    } else {

      if (
        (!isCToken && !(cValue !== cMaskToken && cToken.optional)) ||
        !cValue
      ) {
        saveValue();
      }
      valueMatch = true;

    }

    if (
      (valueMatch && isCToken && cToken.pattern) ||
      (cToken.pattern && !cToken.optional) ||
      (cMaskToken === cValue && (!isCToken || cToken.optional))
    ) {
      nextValue();
    }

    if (valueMatch || cToken.optional) {
      nextMask();
    }

  }

  let position = -1;

  if (options.el && options.el.tagName === "INPUT") {
    const { el } = options;

    position = el.selectionEnd;
    const digit = el.value[ position - 1 ];


    if (isReverse) {

      if (position === $value.length) {
        position = result.length;
      } else {
        position -= 1;
      }

    } else {

      while (position <= result.length && result.charAt(position - 1) !== digit) {
        position++;
      }

    }

  }

  const size = result.length;

  return {
    value: result,
    valid: (indexMask === maskCount || (isReverse && indexMask < 0)) && size >= regexMin && size <= regexMax,
    unmaskedWithTokens: resultNoMaskWithNoMask,
    unmasked: resultNoMask,
    newPosition: position,
  };

};

ODGMask.defaultTokens = tokens;
ODGMask.prototype.defaultTokens = { ...ODGMask.defaultTokens };

window.ODGMask = ODGMask;

export default ODGMask;