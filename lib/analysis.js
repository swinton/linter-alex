const alex = require('alex')

async function processBlob(octokit, owner, repo, filename, file_sha) {
  const {data: {content: encoded}} = await octokit.gitdata.getBlob({owner, repo, file_sha})
  const decoded = Buffer.from(encoded, 'base64').toString()

  const annotations = alex.markdown(decoded).messages.map(message => {
    const {message: description, ruleId: title, location} = message
    return {
      filename: filename,  // The name of the file to add an annotation to.
      blob_href: `https://github.com/${owner}/${repo}/blob/${file_sha}/${filename}`, // The file's full blob URL.
      start_line: location.start.line, // The start line of the annotation.
      end_line: location.end.line, // The end line of the annotation.
      warning_level: 'notice', // The warning level of the annotation. Can be one of notice, warning, or failure.
      message: description, // A short description of the feedback for these lines of code. The maximum size is 64 KB.
      title: title // The title that represents the annotation. The maximum size is 255 characters.
    }
  })

  return annotations
}

async function analyzeTree(octokit, owner, repo, tree_sha) {
  let analyses = []

  const {data: {tree}} = await octokit.gitdata.getTree({owner, repo, tree_sha, recursive: 1})

  // Iterate over each path in tree
  tree.forEach(async path => {
    // Unpack path
    const {path: filename, type, sha: file_sha} = path

    // Fetch Markdown
    if (type === 'blob'  && filename.endsWith('.md')) {
      analyses.push(processBlob(owner, repo, filename, file_sha))
    }
  })

  return Promise.all(analyses)
}


module.exports = analyzeTree
