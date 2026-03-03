import type { DefineComponent } from 'vue';
import type { TableProps } from './components/ETable/props';
import type { ETableSlots, ETableProps } from './components/ETable';

// export component type so consumers have correct typing
export const ETable: DefineComponent<{}, {}, any>;

export type { ETableSlots, ETableProps, TableProps };

export default ETable;


