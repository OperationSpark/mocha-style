const _ = {
  identity(value) {
    return value;
  },
  /** @type { <T>(arr: T[], index?: number) => T | T[] } */
  first(arr, index) {
    return index === 0 ? [] : index ? arr.slice(0, index) : arr[0];
  },

  /** @type {<T>(arr: T[], index?: number) => T | T[]} */
  last: (arr, index) => {
    return index === 0 ? [] : index ? arr.slice(-index) : arr[arr.length - 1];
  }
};

window['_'] = _;
