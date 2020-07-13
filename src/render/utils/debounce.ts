export default function debounce(fn, wait) {
  let timeout: NodeJS.Timeout | null = null
  return () => {
    if (timeout !== null) clearTimeout(timeout)
    timeout = setTimeout(fn, wait)
  }
}
