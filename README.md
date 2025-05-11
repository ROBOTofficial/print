# `gh-printer`

Outputs the results of the actions to the specified file.

## Usage

#### Hello World

```yml
name: Hello World

on:
  pull_request:
    branches:
      - main

jobs:
  test:
    name: Greet

    permissions:
      pull-requests: write
      contents: write

    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        id: checkout
        uses: actions/checkout@v4

      - name: Print
        uses: ROBOTofficial/print@1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          output-file: ./test.log
          contents: "Hi!!!"
```

#### Benchmark

```yml
name: Benchmark

on:
  pull_request:
    branches:
      - main

jobs:
  benchmark:
    name: Benchmark
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version-file: .node-version
          cache: npm

      - name: Install Dependencies
        run: npm ci

      - name: Benchmark
        run: echo "$(npm run benchmark)" > tmp.txt

      - name: Upload Artifact
        uses: actions/upload-artifact@v4
        with:
          name: benchmark
          path: tmp.txt

  printer:
    name: Printer

    permissions:
      pull-requests: write
      contents: write

    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        id: checkout
        uses: actions/checkout@v4

      - name: Download Artifact
        uses: actions/download-artifact@v4
        with:
          name: benchmark

      - name: Print
        uses: ROBOTofficial/print@1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          output-file: ./benchmark.txt
          input-file: ./tmp.txt
```

## Options

#### ignore-input-file (default: true)

If you set true for this option, This actions commits the input file.

```yml
name: Benchmark

on:
  pull_request:
    branches:
      - main

jobs:
  benchmark:
    name: Benchmark
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version-file: .node-version
          cache: npm

      - name: Install Dependencies
        run: npm ci

      - name: Benchmark
        run: echo "$(npm run benchmark)" > tmp.txt

      - name: Upload Artifact
        uses: actions/upload-artifact@v4
        with:
          name: benchmark
          path: tmp.txt

  printer:
    name: Printer

    permissions:
      pull-requests: write
      contents: write

    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        id: checkout
        uses: actions/checkout@v4

      - name: Download Artifact
        uses: actions/download-artifact@v4
        with:
          name: benchmark

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
