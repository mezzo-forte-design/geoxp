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

export const setCookie = (name, value, duration) => {
  const exp = new Date();
  const now = new Date();
  exp.setTime(now.getTime() + (duration * 60000));
  document.cookie = name + '=' + escape(value) + '; expires=' + exp.toUTCString() + '; path=/';
};

export const getCookie = (name) => {
  if (document.cookie.length > 0) {
    let start = document.cookie.indexOf(name + "=");
    if (start !== -1) {
      start = start + name.length + 1;
      let end = document.cookie.indexOf(";", start);
      if (end === -1) {
        end = document.cookie.length;
      }
      return unescape(document.cookie.substring(start, end));
    } else {
      return '';
    }
  }
  return '';
};

export const deleteCookie = (name) => {
  document.cookie = `${name}= ; expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
};