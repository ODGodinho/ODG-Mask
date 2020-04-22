import { isArray } from "./helper";
import tokens from "./tokens";

const ODGMask = function (value, mask, options = {
  tokens: null,
  currentPosition: null
}) {

  if (isArray(mask)) {
    let $aMask = "";
    const masked = [];

    for (let i = 0; i < mask.length; i++) {
      $aMask = mask[ i ];
      masked[ i ] = ODGMask(
        value,
        $aMask,
        options
      );
      if (masked[ i ].valid) {
        return masked[ i ];
      }
    }

    return masked[ 0 ];
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
        ...pToken
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

  const size = result.length;

  if (this) {
    this.value = result;
    this.valid = indexMask === maskCount && size >= regexMin && size <= regexMax;
    this.unmasked = resultNoMask;

    return this;
  }

  return {
    value: result,
    valid: indexMask === maskCount && size >= regexMin && size <= regexMax,
    unmasked: resultNoMask
  };

};

ODGMask.defaultTokens = tokens;
ODGMask.prototype.defaultTokens = { ...ODGMask.defaultTokens };

window.ODGMask = ODGMask;

export default ODGMask;