/** @type {import('eslint').Linter.Config} */
module.exports = {
	root: true,
	ignorePatterns: ["node_modules/**/*"],
	parserOptions: {
		project: true,
		tsconfigRootDir: __dirname,
	},
	overrides: [
		{
			files: ["*.ts"],
			extends: [
				"eslint:recommended",
				"plugin:@typescript-eslint/strict-type-checked",
				"plugin:@typescript-eslint/stylistic-type-checked",
				"plugin:@angular-eslint/recommended",
				"plugin:@angular-eslint/template/process-inline-templates",
				"plugin:prettier/recommended",
			],
			rules: {
				"@angular-eslint/directive-selector": [
					"error",
					{
						type: "attribute",
						prefix: "app",
						style: "camelCase",
					},
				],
				"@angular-eslint/component-selector": [
					"error",
					{
						type: "element",
						prefix: "app",
						style: "kebab-case",
					},
				],
				"@typescript-eslint/unbound-method": "off",
				"@typescript-eslint/consistent-type-definitions": "off",
				"@typescript-eslint/no-non-null-assertion": "off",
				"@typescript-eslint/no-extraneous-class": "off",
				"@angular-eslint/directive-selector": "off",
				"@angular-eslint/component-selector": "off",
				"@angular-eslint/no-host-metadata-property": "off",
			},
		},
		{
			files: ["*.html"],
			extends: [
				"plugin:@angular-eslint/template/recommended",
				"plugin:@angular-eslint/template/accessibility",
				"plugin:prettier/recommended",
			],
			rules: {},
		},
	],
};
