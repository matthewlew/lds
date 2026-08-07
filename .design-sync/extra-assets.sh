#!/bin/sh
# Extra static assets the design-sync converter's canonical output has no slot
# for, but that ARE real repo build output and must ship alongside ds-bundle/.
# Re-run after every package-build.mjs / resync.mjs (they regenerate ds-bundle/
# from scratch). See .design-sync/NOTES.md "Extra assets outside the converter
# contract" for why each of these exists.
set -e
cd "$(dirname "$0")/.."

cp packages/open-icons/icons.svg ds-bundle/icons.svg
mkdir -p ds-bundle/icons
cp packages/open-icons/icons.json ds-bundle/icons/icons.json
cp packages/open-icons/names.json ds-bundle/icons/names.json

mkdir -p ds-bundle/themes
cp packages/lds/css/themes/palette.css ds-bundle/themes/palette.css
cp packages/lds/css/themes/product.css ds-bundle/themes/product.css
cp packages/lds/css/themes/roadtrip.css ds-bundle/themes/roadtrip.css

echo "extra-assets: icons.svg, icons/{icons,names}.json, themes/{palette,product,roadtrip}.css"
