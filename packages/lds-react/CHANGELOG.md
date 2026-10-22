# Changelog

## [2.0.0](https://github.com/matthewlew/lds/compare/lds-react-v1.0.1...lds-react-v2.0.0) (2026-10-22)


### ⚠ BREAKING CHANGES

* **lds-react:** requires React 19 and no longer uses react-dom. setIconSprite, getIconSprite, resolveSprite and toSlot are no longer exported; icons reference an in-document sprite (render <IconSprite>, or pass iconHref). Components render no wrapper element. The package ships dist/ instead of .jsx source. See the README's migration table.

### Features

* **lds-react:** render the templates' markup as JSX, server-first ([7c0c507](https://github.com/matthewlew/lds/commit/7c0c507b16c70e78cdbd6fe54c5774d0e9653f13))
* **lds:** core fixes for server rendering, and a subset-sprite helper in open-icons ([4a27a3c](https://github.com/matthewlew/lds/commit/4a27a3c93810befb022135423c076a0bbc62e40f))


### Bug Fixes

* **lds-react:** review fixes for CodeField, Tooltip, IconButton and Textarea ([2a6e685](https://github.com/matthewlew/lds/commit/2a6e6852c30b1fbbc913f10adb439993e7aae510))

## [1.0.1](https://github.com/matthewlew/lds/compare/lds-react-v1.0.0...lds-react-v1.0.1) (2026-08-10)


### Bug Fixes

* **lds-react:** support React 19 slot portals ([45be4db](https://github.com/matthewlew/lds/commit/45be4dba68667c542e96f1d9e3c7c4d46a93d072))
