module.exports = {
  parserPreset: "conventional-changelog-conventionalcommits",
  extends: [ "@commitlint/config-conventional" ],
  rules: {
    "header-max-length": [ 0, "always", 72 ],
    "scope-case": [ 2, "always", [ "lower-case" ]],
    "scope-min-length": [ 2, "always", 4 ],
    "scope-empty": [ 2, "never" ],
    "type-case": [ 2, "always", "lower-case" ],
    "type-empty": [ 2, "never" ],
    "type-enum": [
      2,
      "always",
      [
        "build",
        "chore",
        "ci",
        "docs",
        "feat",
        "fix",
        "perf",
        "refactor",
        "revert",
        "style",
        "test",
      ],
    ],
  },
};
