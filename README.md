# linter-alex

> a GitHub App built with [probot](https://github.com/probot/probot) that integrates [Alex](http://alexjs.com/) with GitHub's [(beta) Checks API](https://developer.github.com/changes/2018-05-07-new-checks-api-public-beta/), ensuring sensitive, considerate writing before you merge your Pull Requests.

## Example

There's an example [here](https://github.com/swinton/example/runs/449335).

## Limitations

Since this is a proof-of-concept, the app is currently limited to scanning `HELLO_ALEX.md` in the root of your repository.

## Setup

```sh
# Install dependencies
npm install

# Run the bot
npm start
```

See [docs/deploy.md](docs/deploy.md) if you would like to run your own instance of this app.
