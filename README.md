# linter-alex

> a GitHub App built with [probot](https://github.com/probot/probot) combining [Alex](http://alexjs.com/) with GitHub's [(beta) Checks API](https://developer.github.com/changes/2018-05-07-new-checks-api-public-beta/) to ensure **sensitive, considerate writing before you merge your Pull Requests**.

### Looking for an example?

[**Here you go**](https://github.com/swinton/example/runs/449335)! :eyes:

## Installation

Want to try it out? :sparkles: :cool: :sparkles: You can install the app directly from [**this page**](https://github.com/apps/linter-alex).

See [docs/deploy.md](docs/deploy.md) if you would like to run your own instance of this app.

## Limitations

Currently, [trees](https://git-scm.com/book/en/v1/Git-Internals-Git-Objects#Tree-Objects) are fetched recursively for analysis via [this API](https://developer.github.com/v3/git/trees/#get-a-tree-recursively), which has a hard limit of 100,000 entries. If your repo has more entries than this, only the first 100,000 entries will be reachable by linter-alex.

## Feedback?

Please [**open an issue**](https://github.com/swinton/linter-alex/issues/new) :bow:
