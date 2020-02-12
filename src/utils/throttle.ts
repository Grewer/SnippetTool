const throttle = function (fn, params?: object, isClear?: boolean) {
  if (isClear) {
    fn.__throttleID && clearTimeout(fn.__throttleID)
  } else {
    const p = Object.assign({
      args: undefined,
      time: 300,
    }, params)

    throttle(fn, {}, true)

    fn.__throttleID = setTimeout(function () {
      fn(p.args)
    }, p.time)
  }
}

export default throttle
