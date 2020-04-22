/* eslint-disable valid-typeof */

const isArray = function ($var) {
  return typeof $var === "array" || $var instanceof Array;
};

/*
 * Const scapeRegExp = function (str) {
 *   return String(str).replace(
 *     /([.*+?^=!:${}()|\[\]\/\\])/gu,
 *     "\\$1"
 *   );
 * };
 */

export {
  isArray
};