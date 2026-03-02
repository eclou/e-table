# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Component Directory Structure

Components are now organized under `src/components` with each component in its own folder. For example:

```
src/components/ETable/
  ├── ETable.vue
  ├── props.ts
  └── index.ts
```

An aggregate `src/components/index.ts` re-exports all components for easy imports. Legacy exports remain available through `src/packages/index.ts` for backward compatibility.

## Publishing to npm

Follow these steps before running `npm publish`:

1. Remove `private` from `package.json` (already done) and fill in metadata (`description`, `repository.url`, `author`, `license`).
2. Run:
   ```sh
   npm run build
   ```
   This executes `vue-tsc` to generate any type declarations and then bundles the library using Vite. A `postbuild` script copies a minimal `index.d.ts` into `dist`.
3. Verify the `dist` folder contains:
   - `index.js` (ES module)
   - `index.cjs` (CommonJS)
   - `index.d.ts` (declaration file)
4. Publish the package:
   ```sh
   npm publish --access public
   ```

Consumers can import the component via:
```js
import { ETable } from 'e-table'
// or
import ETable from 'e-table'
```



Learn more about the recommended Project Setup and IDE Support in the [Vue Docs TypeScript Guide](https://vuejs.org/guide/typescript/overview.html#project-setup).
