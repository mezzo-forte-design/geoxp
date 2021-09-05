export const isObjectLike = (value) => {
  return (
    value != null &&
    typeof value === 'object' &&
    !(typeof value === 'function') &&
    !Array.isArray(value)
  );
};

export const isNumber = value => typeof value == 'number';

export const isPositiveNumber = value => typeof value == 'number' && value >= 0;