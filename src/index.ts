import type { App,Plugin } from 'vue';
import ETable from './components/ETable.vue';

const ETablePlugin: Plugin = {
  install(app: App) {
    app.component('ETable', ETable);
  }
}
export { ETable };
export default ETablePlugin;