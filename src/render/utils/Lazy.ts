import setupLoading from '~/components/setupLoading'

const LazyRequest = async ({
  request,
  msg = '数据加载中',
  errorCallback,
}: {
  request: () => Promise<any>
  msg: string
  errorCallback?: (e) => void
}) => {
  let loading
  const timeout = setTimeout(() => {
    loading = setupLoading(msg, 0)
  }, 100)
  try {
    await request()
  } catch (e) {
    console.info('[LazyRequest]', e)
    errorCallback && errorCallback(e)
  } finally {
    loading ? loading.close() : clearTimeout(timeout)
  }
}

export default LazyRequest
