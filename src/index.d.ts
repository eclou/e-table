// minimal type declarations for NPM consumers
import { DefineComponent } from 'vue';
import type { tableProps as _tableProps } from './components/ETable/props';

export type TableProps = typeof _tableProps;

export const ETable: DefineComponent<{}, {}, any> & {
  props: TableProps;
};

export default ETable;
