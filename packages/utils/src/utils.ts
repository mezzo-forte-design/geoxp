/**
 * GeoXpUtils provides some utilities shared between all modules
 * @module GeoXpUtils
 * */

/**
 * Checks if the given value is a number.
 *
 * @param value - The value to check.
 * @returns `true` if the value is of type `number`, otherwise `false`.
 */
export const isNumber = (value: unknown) => typeof value === 'number';

/**
 * Checks if the given value is a positive number.
 *
 * @param value - The value to check.
 * @returns `true` if the value is a positive number (> 0), otherwise `false`.
 */
export const isPositiveNumber = (value: unknown) => typeof value === 'number' && value > 0;

/**
 * Checks if the given value is a positive number.
 *
 * @param value - The value to check.
 * @returns `true` if the value is a positive or null number (>= 0), otherwise `false`.
 */
export const isPositiveOrNullNumber = (value: unknown) => typeof value === 'number' && value >= 0;

/**
 * Sanitizes a numeric input by ensuring it is valid and falls back to a default value if not.
 *
 * @param input - An object containing the input properties.
 * @param input.inputValue - The numeric value to sanitize (optional).
 * @param input.inputLabel - A label describing the input (used in warnings).
 * @param input.defaultValue - The default value to return if the input is invalid.
 * @param input.excludeZero - Whether to include 0 as valid input value or not (default is false)
 * @returns A valid number. Either the provided `inputValue` if valid, or the `defaultValue`.
 */
export const sanitiseNumber = ({
  inputValue,
  inputLabel,
  defaultValue,
  excludeZero = false,
}: {
  inputValue?: number;
  inputLabel: string;
  defaultValue: number;
  excludeZero?: boolean;
}): number => {
  if (inputValue === undefined || inputValue === null || isNaN(inputValue)) return defaultValue;
  const chechMethod = excludeZero ? isPositiveNumber : isPositiveOrNullNumber;
  if (!chechMethod(inputValue)) {
    console.warn(`[GeoXp.config] Provided ${inputLabel} is not valid. Using default value (${defaultValue})`);
    return defaultValue;
  }
  return inputValue;
};

/**
 * Checks if the given value is object-like.
 *
 * An object-like value is not `null`, is of type `object`, is not a function, and is not an array.
 *
 * @param value - The value to check.
 * @returns `true` if the value is object-like, otherwise `false`.
 */
export const isObjectLike = (value: unknown) =>
  value !== null && typeof value === 'object' && typeof value !== 'function' && !Array.isArray(value);
