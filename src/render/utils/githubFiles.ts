const key = process.env.github_key
const { Octokit } = require('@octokit/rest')

const octokit = new Octokit({
  auth: key,
})

// https://www.npmjs.com/package/octokit-commit-multiple-files 调研下次库
const createCommit = async ({
  owner = 'Grewer',
  repo = 'snippetDB',
  base = 'main',
  changes,
}: {
  owner?: string
  repo?: string
  base?: string
  changes: { files: Record<string, string>; commit: string }
}) => {
  let response

  // if (!base) {
  //   response = await octokit.repos.get({ owner, repo })
  //   base = response.data.default_branch
  // }

  response = await octokit.repos.listCommits({
    owner,
    repo,
    sha: base,
    per_page: 1,
  })
  let latestCommitSha = response.data[0].sha
  const treeSha = response.data[0].commit.tree.sha

  response = await octokit.git.createTree({
    owner,
    repo,
    base_tree: treeSha,
    tree: Object.keys(changes.files).map(path => {
      return {
        path,
        mode: '100644',
        content: changes.files[path],
      }
    }),
  })
  const newTreeSha = response.data.sha

  response = await octokit.git.createCommit({
    owner,
    repo,
    message: changes.commit,
    tree: newTreeSha,
    parents: [latestCommitSha],
  })
  latestCommitSha = response.data.sha

  await octokit.git.updateRef({
    owner,
    repo,
    sha: latestCommitSha,
    ref: `heads/main`,
    force: true,
  })

  console.log('Project saved')
}

/**
 * 拉取文件的思路
 * 1. 首先要保证的是本地每次修改/更新文件都要在 Main.json 中更新此文件的时间戳
 * 2. 对比 本地 Main 和远端 Main 中的时间戳
 * 3. 如果本地文件数和远端文件  数量一致, 则针对时间先后  选择更新
 * 4. 如果本地比远端多,  只比较远端的那一部分的时间
 * 5 如果本地比远端少, 先比较远端的那一部分, 剩余部分直接拉取
 */
const fetchFiles = () => {

}

export { createCommit }
