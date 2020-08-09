import React, { useMemo, useReducer } from 'react'
import FileLists from '~/pages/FileLists'
import Editor from '~/pages/Editor'
import useMount from '~/hooks/useMount'
import ConfigContext from '~/context/ConfigContext'
import LazyRequest from '~/utils/Lazy'
import BaseDBStore from '~/db/DBStore'
import createAction from '~/utils/createAction'
import { IFileListItem } from '~/definition/Main'
import IFileType from '~/enum/FileType'

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
    case 'setCurrent':
      return { ...state, current: action.payload }
    default:
      return state
  }
}

function App() {
  const [state, setState] = useReducer(AppReducer, {
    loading: false,
    fileList: [],
    config: {},
    current: {},
    setCurrent: (item: IFileListItem) => {
      setState(createAction('setCurrent', item))
    },
  })

  console.log('%c render App', 'background:yellow;', state)

  const listen = useMemo(() => {
    return {
      insert: event => {
        const payload =
          event.fileType === IFileType.folder
            ? {
                fileList: BaseDBStore.getFileView()?.data(),
              }
            : {
                fileList: BaseDBStore.getFileView()?.data(),
                current: event,
              }
        setState(createAction('updateFile', payload))
      },
      delete: () => {
        setState(
          createAction('updateFile', {
            fileList: BaseDBStore.getFileView()?.data(),
          })
        )
      },
      update: () => {
        setState(
          createAction('updateFile', {
            fileList: BaseDBStore.getFileView()?.data(),
          })
        )
      },
    }
  }, [])

  useMount(() => {
    // 此操作放入主渲染程序
    console.log('loading...')

    LazyRequest({
      request: async () => {
        const result = await BaseDBStore.appInit(listen)
        result && setState(createAction('setFileList', { fileList: result.data(), dynamicData: result }))
      },
      msg: '环境加载中...',
      errorCallback: e => {
        console.error(e)
        alert('项目初始化失败')
      },
    })
  })

  return (
    <Provider value={state}>
      <FileLists />
      <Editor />
    </Provider>
  )
}

export default App
