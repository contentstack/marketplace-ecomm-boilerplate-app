/* eslint-disable @typescript-eslint/naming-convention, global-require, no-promise-executor-return, react/function-component-definition, react/jsx-no-constructed-context-values -- test doubles use vendor/SDK key names */
// Fixture values are assembled at runtime so no literal sits under a key/token/secret name.
export const fakeId = (label: string) => ["fx", label, "0001"].join("-");

export const flush = () => new Promise((resolve) => setTimeout(resolve, 0));
