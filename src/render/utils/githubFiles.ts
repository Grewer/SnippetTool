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

export { createCommit }
