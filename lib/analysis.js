const alex = require('alex')

function initialize(context) {
  const processBlob = (async function processBlob(owner, repo, tree_sha, filename, file_sha) {
    const {data: {content: encoded}} = await this.github.gitdata.getBlob({owner, repo, sha: file_sha})
    const decoded = Buffer.from(encoded, 'base64').toString()

    const analysis = alex.markdown(decoded).messages.map(message => {
      const {message: description, ruleId: title, location} = message
      return {
        filename: filename,  // The name of the file to add an annotation to.
        blob_href: `https://github.com/${owner}/${repo}/blob/${tree_sha}/${filename}`, // The file's full blob URL.
        start_line: location.start.line, // The start line of the annotation.
        end_line: location.end.line, // The end line of the annotation.
        warning_level: 'notice', // The warning level of the annotation. Can be one of notice, warning, or failure.
        message: description, // A short description of the feedback for these lines of code. The maximum size is 64 KB.
        title: title // The title that represents the annotation. The maximum size is 255 characters.
      }
    })

    return analysis
  }).bind(context)

  const analyzeTree = (async function analyzeTree(owner, repo, tree_sha) {
    // Get tree, recursively
    const {data: {tree}} = await this.github.gitdata.getTree({owner, repo, sha: tree_sha, recursive: 1})
    this.log('Tree: %j', tree)

    // Filter tree, only blobs ending in '.md'
    const blobs = tree.filter(path => {
      const {path: filename, type} = path
      return type === 'blob'  && filename.endsWith('.md')
    });
    this.log('Filtered tree: %j', blobs)

    // Process each blob
    return Promise.all(blobs.map(blob => {
      const {path: filename, sha: file_sha} = blob
      return processBlob(owner, repo, tree_sha, filename, file_sha)
    }))
  }).bind(context)

  return analyzeTree
}

module.exports = initialize
