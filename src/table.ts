import type { AxiosInstance } from 'axios'
import type { PropType } from 'vue'

export const tableProps = {
  pk: {
    type: String,
    default: '_id',
  },
  page: {
    type: Number,
    default: 1,
  },
  row: {
    type: Number,
    default: 10,
  },
  query: {
    type: Object,
    default: () => {
      return {}
    },
  },
  initFilter: {
    type: Object,
    default: () => {
      return {}
    },
  },
  layout: String,
  defualtFilter: {
    type: Boolean,
    default: true,
  },
  defaultAction: {
    type: Boolean,
    default: true,
  },
  defaultEdit: {
    type: Boolean,
    default: true,
  },
  defaultDelete: {
    type: Boolean,
    default: true,
  },
  listUrl: String,
  addUrl: String,
  submitUrl: String,
  deleteUrl: String,
  filterLazy: {
    type: Number,
    default: 600,
  },
  noticeFiled: {
    type: String,
    default: '',
  },
  requestMethod: {
    type: Object,
    default: () => {
      return {
        addUrl: 'POST',
        submitUrl: 'POST',
        deleteUrl: 'POST',
      }
    },
  },
  formFullScreen: {
    type: Boolean,
    default: false,
  },
  axios: {
    type: Function as PropType<AxiosInstance>,
    default: null,
  }
}
