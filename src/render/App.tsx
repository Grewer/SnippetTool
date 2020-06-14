import React, { useCallback, useReducer } from 'react'
import createAction from '~/action/createAction'
import GlobalLoading from '~/components/GlobalLoading'
import DB from '~/db/db'
import FileLists from '~/pages/FileLists'
import Editor from '~/pages/Editor'
import useMount from '~/hooks/useMount'
import ConfigContext from '~/context/ConfigContext'

const { Provider } = ConfigContext
const AppReducer = (state, action: { type: string; payload: any }) => {
  console.log('AppReducer', state, action)
  switch (action.type) {
    case 'setFileList':
      return {
        ...state,
        ...action.payload,
        loading: false,
      }
    case 'setLoading':
      return {
        ...state,
        loading: action.payload,
      }
    case 'updateFile':
      return {
        ...state,
        ...action.payload,
      }
    default:
      return state
  }
}

function App() {
  const [state, setState] = useReducer(AppReducer, {
    loading: false,
    fileList: [],
    config: {},
  })

  console.log('render App', state)

  const listen = useCallback(event => {
    setState(
      createAction('updateFile', {
        fileList: DB.getFileView()?.data(),
      })
    )
  }, [])

  useMount(async () => {
    // 此操作放入主渲染程序
    console.log('loading...')
    const timeout = setTimeout(() => {
      setState(createAction('setLoading', true))
    }, 200)
    try {
      const result = await DB.appInit(listen)
      console.log(state, result)
      if (!state.loading) {
        clearTimeout(timeout)
      }
      setState(createAction('setFileList', { fileList: result.data(), dynamicData: result }))
    } catch (e) {
      console.error(e)
      alert('项目初始化失败')
    }
    console.log('loading end')
  })

  // useEffect(() => {}, [])

  return (
    <GlobalLoading loading={state.loading} text="环境加载中...">
      <Provider value={state}>
        <FileLists />
        <Editor />
      </Provider>
    </GlobalLoading>
  )
}

export default App
