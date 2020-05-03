import { useEffect, useRef } from 'react'

export default function useMount(mountedFn) {
  const mountedFnRef: React.MutableRefObject<any> = useRef(null)

  mountedFnRef.current = mountedFn

  useEffect(() => {
    mountedFnRef.current()
  }, [mountedFnRef])
}
