/** @type {import('prettier-plugin-tailwindcss').options & import('@trivago/prettier-plugin-sort-imports').PrettierConfig} */
module.exports = {
	plugins: [
		"@trivago/prettier-plugin-sort-imports",
		"prettier-plugin-tailwindcss",
	],
	semi: true,
	trailingComma: "all",
	singleQuote: false,
	printWidth: 80,
	tabWidth: 2,
	useTabs: true,

	overrides: [
		{
			files: "*.html",
			options: {
				parser: "angular",
			},
		},
	],

	importOrder: ["^(~/)", "^[./]"],
	importOrderSeparation: true,
	importOrderSortSpecifiers: true,
	importOrderParserPlugins: ["typescript", "decorators"],
};
