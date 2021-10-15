import React, { memo } from 'react'
import styles from '~/pages/FileLists.less'
import AddFileOrDir from '~/modals/AddFileOrDir'
import { IconJia } from '~/components/iconfont'

const addFileOrDir = () => {
  AddFileOrDir({
    global: true,
  }).open()
}

const FileListHeader = memo(() => {
  const test = async () => {
    // process.env.github_key  // 后续此值是用户获取
    const key = process.env.github_key
    const { Octokit } = require('@octokit/rest')

    const octokit = new Octokit({
      auth: key,
    })

    console.log({ octokit })

    const { data } = await octokit.rest.repos.get({
      owner: 'Grewer',
      repo: 'snippetDB',
      // mediaType: {
      //   previews: ["symmetra"],
      // },
    }) // 获取状态
    if (!data) {
      console.log('网络连接啥的问题, 或者 GitHub 问题')
      return
    }
    console.log(data)

    await octokit.rest.repos.createOrUpdateFileContents({
      owner: 'Grewer',
      repo: 'snippetDB',
      path: 'Main.json',
      message: '更新文件',
      content: btoa('test'),
      author: {
        name: 'snippet app',
        email: 'grewer@grewer.cn',
      },
    })
  }
  return (
    <>
      <DragArea />
      <div>
        <button type="button" onClick={test}>
          配置请求尝试
        </button>
      </div>
      <div className={styles.title}>
        文件夹列表
        <IconJia color="#C7C6C2" onClick={addFileOrDir} />
      </div>
    </>
  )
})

const DragArea = memo(() => <div className={styles.header}>{/* 这里是拖曳区域 */}</div>)

export default FileListHeader
