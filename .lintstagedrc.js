const path = require("path");

const buildEslintCommand = (filenames) =>
  `eslint --max-warnings=0 --fix ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(" --file ")}`;

module.exports = {
  "*.{ts,tsx}": [buildEslintCommand, "prettier --write"],
};
