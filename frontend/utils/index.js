export function tryCatch(fn, ...args) {
  // const args = [].slice.call(arguments, 1);
  try {
    return [null, fn.apply(null, args)];
  } catch (e) {
    return [e];
  }
}

export function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}