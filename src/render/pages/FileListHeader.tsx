import React, { memo } from 'react'
import * as fs from 'fs'
import styles from '~/pages/FileLists.less'
import AddFileOrDir from '~/modals/AddFileOrDir'
import { IconJia } from '~/components/iconfont'
import { createCommit } from '~/utils/githubFiles'

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
    //
    // const { data } = await octokit.rest.repos.get({
    //   owner: 'Grewer',
    //   repo: 'snippetDB',
    //   // mediaType: {
    //   //   previews: ["symmetra"],
    //   // },
    // }) // 获取状态
    // console.log(data)

    // const response = await octokit.repos.listCommits({
    //   owner: 'Grewer',
    //   repo: 'snippetDB',
    //   sha: 'main',
    //   per_page: 1,
    // })
    //
    // const treeSha = response.data[0].commit.tree.sha
    //
    // await octokit.rest.git.getTree({
    //   owner: 'Grewer',
    //   repo: 'snippetDB',
    //   tree_sha:treeSha,
    // });


    const res = await octokit.rest.repos.getContent({
      owner: 'Grewer',
      repo: 'snippetDB',
      // path: 'testtree/全局.json',
      // path: 'testtree',
      ref: 'heads/main',
    }) // 可获取文件

    console.log(res)
    // if (!data) {
    //   console.log('网络连接啥的问题, 或者 GitHub 问题')
    //   return
    // }

    // createCommit({
    //   changes: {
    //     files: {
    //       'testtree/Main.json': fs.readFileSync('db/Main.json', 'utf8'),
    //       'testtree/全局.json': fs.readFileSync('db/全局文件夹 1.json', 'utf8'),
    //     },
    //     commit: '尝试批量提交',
    //   },
    // })

    // await octokit.rest.repos.createOrUpdateFileContents({
    //   owner: 'Grewer',
    //   repo: 'snippetDB',
    //   path: 'Main.json',
    //   message: '更新文件',
    //   content: btoa('test'),
    //   author: {
    //     name: 'snippet app',
    //     email: 'grewer@grewer.cn',
    //   },
    // })

    //
    // console.log(content)
    //
    // await octokit.rest.git.createTree({
    //   owner: 'Grewer',
    //   repo: 'snippetDB',
    //   tree: [
    //     {
    //       path: 'testtree/Main.json',
    //       mode: '100644',
    //       content,
    //     },
    //   ],
    // })
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
