This is no longer really needed as Roblox added support for string-based require to Roblox. (I think)

# luau-to-rojo

Lets you convert a pure [Luau](https://luau-lang.org/) project into a
[Rojo](https://rojo.space/) project. Automatically converts the string-based
require syntax of Luau to Roblox's require syntax, and generates a
`default.project.json`. This allows you to create testable libraries that can
also be used in Roblox by letting you write your libraries in pure Luau.

# Installation

## Deno
This script can be executed without the need for installation using the `deno` cli as follows:
```
deno run -A https://raw.githubusercontent.com/fewkz/luau-to-rojo/main/luau-to-rojo.ts --help
```
You can also install it as a shell command with `deno install` like so:
```
deno install -A https://raw.githubusercontent.com/fewkz/luau-to-rojo/main/luau-to-rojo.ts
```

## Aftman
You can install `luau-to-rojo` via [Aftman](https://github.com/LPGhatguy/aftman)
by doing `aftman add fewkz/luau-to-rojo`

## GitHub release
You can download a binary directly from [GitHub Releases](https://github.com/fewkz/luau-to-rojo/releases)

# How to use

To use, run `luau-to-rojo luau-project-dir rojo-project-dir`, where
`luau-project-dir` is a path to the directory of a Luau project. It will create
a new directory `rojo-project-dir` with a Rojo project in it.
