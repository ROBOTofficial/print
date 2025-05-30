# `gh-printer`

Outputs the results of the actions to the specified file.

## Usage

#### Print Benchmark

```yml
name: Benchmark

on:
  push:
    branches:
      - main

jobs:
  print:
    name: print

    permissions:
      pull-requests: write
      contents: write

    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        id: checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        id: setup-node
        uses: actions/setup-node@v4
        with:
          node-version-file: .node-version
          cache: npm

      - name: Install Dependencies
        run: npm install

      - name: Print
        uses: ROBOTofficial/print@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          output-file: ./benchmark.log
          run: npm run benchmark
```

**If you want to see other examples, look [here](./examples/).**

## Options

#### ignore-input-file (default: true)

If you set true for this option, This actions commits the input file.

```yml
- name: Print
  uses: ROBOTofficial/print@1
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    output-file: ./benchmark.txt
    input-file: ./tmp.txt
    ignore-input-file: false
```

## For contributors

Please look [this](./.github/CONTRIBUTING.md).

## Respect

[Typescript-action](https://github.com/actions/typescript-action)

[GitHub Pages action](https://github.com/peaceiris/actions-gh-pages)

[Changesets action](https://github.com/changesets/action)
