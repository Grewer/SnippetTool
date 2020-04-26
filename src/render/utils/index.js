const json2str = (obj = {}) => {
  return Object.keys(obj).reduce((str, i) => (str += `&${encodeURIComponent(i)}=${encodeURIComponent(obj[i])}`), '')
}

const transformUrl = (url, params) => {
  const newParams = json2str(params)
  if (newParams) {
    url += `?${newParams.substr(1)}`
  }
  return url
}

const Fetch = {
  config: {
    baseUrl: '',
    transformRequest(data) {
      return data
    },
    headers: {},
    timeout: 10000,
    responseType: 'json',
    withCredentials: false,
    upload: null,
  },
  interceptor: {
    success(data) {
      return data
    },
    fail(data) {
      return data
    },
  },
  post(url, params, config) {
    params = this.config.transformRequest(params)
    params = params instanceof FormData ? params : json2str(params).substr(1)
    return this.ajax('post', url, params, config)
  },
  get(url, params, config) {
    params = this.config.transformRequest(params)
    url = transformUrl(url, params)
    return this.ajax('get', url, null, config)
  },
  put(url, params, config) {
    params = this.config.transformRequest(params)
    return this.ajax('put', url, JSON.stringify(params), config)
  },
  del(url, params, config) {
    params = this.config.transformRequest(params)
    url = transformUrl(url, params)
    return this.ajax('delete', url, null, config)
  },
  ajax(type, url, params, config = {}) {
    // 合并config
    return xhr(type, url, params, { ...this.config, ...config }, this.interceptor)
  },
  install(Vue, options) {
    try {
      options && options(this.config)
    } catch (e) {
      console.error('options 必须是一个函数')
    }
    const that = this
    Vue.prototype.$get = this.get.bind(that)
    Vue.prototype.$post = this.post.bind(that)
  },
}

function CheckIEJSON(config, xhr) {
  try {
    return config.responseType === 'json' && typeof xhr.response === 'string' ? JSON.parse(xhr.response) : xhr.response
  } catch (e) {
    return xhr.response
  }
}

function xhr(type, url, params, config, interceptor) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    url = config.baseUrl + url

    xhr.open(type, url)

    if (type === 'post' && params.length) {
      xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded;charset=UTF-8')
    }

    if (type === 'put') {
      xhr.setRequestHeader('Content-type', 'application/json')
    }

    // config start
    xhr.responseType = config.responseType
    xhr.withCredentials = config.withCredentials
    xhr.timeout = config.timeout
    const headers = config.headers || {}
    Object.keys(headers).forEach(i => {
      xhr.setRequestHeader(i, headers[i])
    })
    // config end
    const res = {
      xhr,
      config,
      url,
      params,
      timeout: false,
    }

    config.upload && (xhr.upload = config.upload)

    xhr.onload = ev => {
      res.data = CheckIEJSON(config, xhr)
      resolve(interceptor.success(res))
    }

    xhr.onerror = ev => {
      res.data = CheckIEJSON(config, xhr)
      reject(interceptor.fail(res))
    }
    xhr.ontimeout = ev => {
      res.timeout = true
      res.data = CheckIEJSON(config, xhr)
      reject(interceptor.fail(res))
    }

    xhr.send(params)
  })
}

const fetch = Object.create(Fetch)

export default fetch
