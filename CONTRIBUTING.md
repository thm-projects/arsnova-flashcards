# Contributing

ARSnova Flashcards needs you! If you are interested in helping, here is a short guide.

## Step-by-step summary

1. First, fork and clone our repository.
2. Create a topic branch.
3. Make your changes. Be sure to provide clean commits and to write [expressive commit messages][commit-message].
4. Stay up to date with our repository: Rebase to our `staging` branch using `git rebase`.
5. Push the changes to your topic branch.
6. Finally, [submit a merge request][merge-request].

If you don't feel like writing code, you could also update the documentation. And if you find any bugs, feel free to [open a new issue][new-issue].

[build-section]: https://git.thm.de/arsnova/flashcards/builds
[commit-message]: http://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html
[merge-request]: https://git.thm.de/arsnova/flashcards/merge_requests/new
[new-issue]: https://git.thm.de/arsnova/flashcards/issues/new?issue%5Bassignee_id%5D=&issue%5Bmilestone_id%5D=

## How we review merge requests

To get your merge request accepted faster, you should follow our review process before submitting your request. Here is our list of dos and don'ts.

### No merge conflicts

This is a no-brainer. Keep your branches up to date so that merges will never end up conflicting. Always test-merge your branches before submitting your pull requests. Ideally, your branches are fast-forwardable, but this is not a requirement.

### Project structure

Since Meteor is supporting ES6 (ES2015) we use the import/export statements to modularize the application.
Please take a look at our project file structure for the clients:

```
client/
  head.html
  head.js
  head.scss
i18n/
imports/
  api/
  startup/
    client/
      i18n.js
      registerhelper.js
      routes.js
    server/
      accounts-config.js
      initialize.js
  ui/
public/
server/
  main.js
```

### Use UTF-8

Sadly, some editors still do not have UTF-8 as their default setting. Using the wrong encoding will destroy non-ASCII characters like french quotation marks or umlauts.

### Summary

It all comes down to

* reviewing your own changes,
* keeping your commits clean and focused,
* and always staying up to date.

If you keep these things in mind, your merge requests will be accepted much faster. Happy coding!
