# Learn Banano

This repository contains the source code for [learn.banano.trade](https://learn.banano.trade), a comprehensive tutorial website for Banano cryptocurrency.

## About

Learn Banano is built with Jekyll using the Minima theme and is hosted on GitHub Pages. The site provides tutorials, guides, and interactive tools for learning about and working with Banano.

## Local Development

To run this site locally:

1. Clone this repository
2. Install Ruby and Bundler
3. Run `bundle install` to install dependencies
4. Run `bundle exec jekyll serve` to start the local server
5. Visit `http://localhost:4000` in your browser

## Contributing

To contribute to this site:

1. Fork this repository
2. Create a new branch for your changes
3. Add or modify Markdown files in the `_posts` directory
4. Submit a pull request

## Adding a New Tutorial

To add a new tutorial:

1. Create a new Markdown file in the `_posts` directory with the format `YYYY-MM-DD-title.md`
2. Add front matter at the top of the file:

```yaml
---
layout: post
title: "Your Tutorial Title"
date: YYYY-MM-DD HH:MM:SS +0000
categories: tutorial
tags: [beginner, wallet, etc]
scripts:
  - /assets/js/specific-script.js  # Optional
---
```

3. Write your tutorial content in Markdown
4. If your tutorial requires JavaScript, add it to the `scripts` array in the front matter

## License

This project is licensed under the MIT License - see the LICENSE file for details.