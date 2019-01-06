# Contributing to One Stoop
Welcome to One Stoop.  We are glad you have found us and are 
interested in contributing.  The core of One Stoop is being transparent and open source contributors like you make this possible.

The following is a set of guidelines for contributing to Atom and its packages, which are hosted in the [OneStoop Organization](https://github.com/OneStoop) on GitHub. These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.
#### Table Of Contents
[Code of Conduct](#code-of-conduct)
[What should I know before I get started?](#what-should-i-know-before-i-get-started)
  * [OneStoop Services](#onestoop-services)
  * [OneStoop Design Decisions](#design-decisions)

[How Can I Contribute?](#how-can-i-contribute)
  * [Reporting Bugs](#reporting-bugs)
  * [Suggesting Enhancements](#suggesting-enhancements)
  * [Your First Code Contribution](#your-first-code-contribution)
  * [Pull Requests](#pull-requests)

[Styleguides](#styleguides)
  * [Git Commit Messages](#git-commit-messages)
  * [JavaScript Styleguide](#javascript-styleguide)
  * [CoffeeScript Styleguide](#coffeescript-styleguide)
  * [Specs Styleguide](#specs-styleguide)
  * [Documentation Styleguide](#documentation-styleguide)

## Code of Conduct

This project and everyone participating in it is governed by the [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to [contact@onestoop.com](mailto:contact@onestoop.com).

## What should I know before I get started?
### OneStoop services
OneStoop is designed to work as a number of micro-services on the backend and a single UI expereance for the end user.

Today we have
* [OneStoop/os-ui](https://github.com/OneStoop/os-ui) - OneStoop's user interface
* [OneStoop/os-api](https://github.com/OneStoop/os-api) - OneStoop's backend API service

### Design Decisions
When we make a significant decision in how we maintain the project and what we can or cannot support, we will document it in the [OneStoop/design-decisions](https://github.com/OneStoop/design-decisions) repository. If you have a question around how we do things, check to see if it is documented there. If it is not documented there, please open an issue in that repo.

## How Can I Contribute?

### Reporting Bugs
If you believe you have found a security related bug please do not use the public issue system.  Email us at contact@onestoop.com  This will allow us a chance to fix the issue am protect end users.

For all other bugs:
* **Determine [which repository the problem should be reported in](#onestoop-services)**.
* **Perform a cursory search** to see if the problem has already been reported. If it has **and the issue is still open**, add a comment to the existing issue instead of opening a new one.

#### How Do I Submit A (Good) Bug Report?

Bugs are tracked as [GitHub issues](https://guides.github.com/features/issues/). After you've determined [which repository](#onestoop-services) your bug is related to, create an issue on that repository and provide the following information by filling in [the template](ISSUE_TEMPLATE.md).

Explain the problem and include additional details to help maintainers reproduce the problem:

* **Use a clear and descriptive title** for the issue to identify the problem.
* **Describe the exact steps which reproduce the problem** in as many details as possible.  When listing steps, **don't just say what you did, but explain how you did it**.
* **Describe the behavior you observed after following the steps** and point out what exactly is the problem with that behavior.
* **Explain which behavior you expected to see instead and why.**
* **Include screenshots and animated GIFs** which show you following the described steps and clearly demonstrate the problem. You can use [this tool](https://www.cockos.com/licecap/) to record GIFs on macOS and Windows, and [this tool](https://github.com/colinkeenan/silentcast) or [this tool](https://github.com/GNOME/byzanz) on Linux.
* **If the problem wasn't triggered by a specific action**, describe what you were doing before the problem happened.

### Suggesting Enhancements

This section guides you through submitting an enhancement suggestion for OneStoop, including completely new features and minor improvements to existing functionality.

Before creating enhancement suggestions, please check [this list](#before-submitting-an-enhancement-suggestion) as you might find out that you don't need to create one. When you are creating an enhancement suggestion, please [include as many details as possible](#how-do-i-submit-a-good-enhancement-suggestion). Fill in [the template](ISSUE_TEMPLATE.md), including the steps that you imagine you would take if the feature you're requesting existed.

#### Before Submitting An Enhancement Suggestion

* **Determine [which repository the enhancement should be suggested in](#onestoop-services).**
* **Perform a [cursory search](https://github.com/search?q=+is%3Aissue+user%3Aonestoop)** to see if the enhancement has already been suggested. If it has, add a comment to the existing issue instead of opening a new one.

#### How Do I Submit A (Good) Enhancement Suggestion?

Enhancement suggestions are tracked as [GitHub issues](https://guides.github.com/features/issues/). After you've determined [which repository](#onestoop-services) your enhancement suggestion is related to, create an issue on that repository and provide the following information:

* **Use a clear and descriptive title** for the issue to identify the suggestion.
* **Provide a step-by-step description of the suggested enhancement** in as many details as possible.
* **Describe the current behavior** and **explain which behavior you expected to see instead** and why.
* **Include screenshots and animated GIFs** which help you demonstrate the steps or point out the part of Atom which the suggestion is related to. You can use [this tool](https://www.cockos.com/licecap/) to record GIFs on macOS and Windows, and [this tool](https://github.com/colinkeenan/silentcast) or [this tool](https://github.com/GNOME/byzanz) on Linux.
* **Explain why this enhancement would be useful** to most OneStoop users.
* **Specify the name and version of the OS you're using.**

### Your First Code Contribution

Unsure where to begin contributing to Atom? You can start by looking through these `beginner` and `help-wanted` issues:

* [Beginner issues][beginner] - issues which should only require a few lines of code, and a test or two.
* [Help wanted issues][help-wanted] - issues which should be a bit more involved than `beginner` issues.

Both issue lists are sorted by total number of comments. While not perfect, number of comments is a reasonable proxy for impact a given change will have.

#### Local development

OneStoop and all services can be run localy.  Please see the README.md in each repo to see how to get a local version running.

### Pull Requests

* Fill in [the required template](PULL_REQUEST_TEMPLATE.md)
* Do not include issue numbers in the PR title
* Include screenshots and animated GIFs in your pull request whenever possible.
* Follow the [Styleguides](#styleguide).
* Document new code based on the [Documentation Styleguide](#documentation-styleguide)

## Styleguides

### Git Commit Messages

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally after the first line
* When only changing documentation, include `[ci skip]` in the commit title

### Python styleguide
Please use [PEP 8](https://www.python.org/dev/peps/pep-0008/)

### Vue.js styleguide
Please use [Vue.js style-guide](https://vuejs.org/v2/style-guide/)

### Documentation Styleguide
TBD




