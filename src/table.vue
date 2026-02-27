<template>
    <div>
    <el-card v-if="defualtFilter" class="search-wrapper" shadow="never">
      <el-form :inline="true">
        <slot name="filter" :filter="filter" :add="showAdd" />
      </el-form>
    </el-card>

    <el-card shadow="never">
      <slot name="toolbar" />
      <div class="table-wrapper">
        <el-table v-bind="$attrs" ref="TableRef" :data="items" @sort-change="sortChange">
          <slot />
          <slot name="action">
            <el-table-column v-if="defaultAction" label="操作" class-name="action">
              <template #default="scope">
                <slot name="actionMore" :row="scope.row" :edit="showEdit" :delete="deleteItem" />
                <el-button
                  v-if="defaultEdit"
                  size="small"
                  type="primary"
                  @click="showEdit(scope.row)"
                >
                  编辑
                </el-button>
                <el-button
                  v-if="defaultDelete"
                  size="small"
                  type="danger"
                  @click="deleteItem(scope.row)"
                >
                  删除
                </el-button>
                <slot
                  name="actionMoreAfter"
                  :row="scope.row"
                  :edit="showEdit"
                  :delete="deleteItem"
                />
              </template>
            </el-table-column>
          </slot>
        </el-table>
      </div>
      <div class="pagger-wrapper">
        <el-pagination
          v-model:current-page="pageNow"
          v-model:page-size="pageSize"
          :hide-on-single-page="true"
          :total="totalCount"
          :layout="PageLayout"
          @current-change="pageChange"
        />
      </div>
    </el-card>

    <el-dialog
      v-model="formVisiable"
      destroy-on-close
      :modal="false"
      align-center
      :fullscreen="formFullScreen"
      @closed="closeForm"
    >
      <slot
        name="form"
        :set-form-ref="setFormRef"
        :form="form"
        :action="action"
        :errors="errors"
        :loading="loading"
        :close="toggleFormVisible"
        :submit="submit"
      />
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import {
  ElTable,
  ElMessage,
  ElMessageBox,
  ElCard,
  ElForm,
  type FormInstance,
  type TableColumnCtx,
} from 'element-plus'

import { ref } from 'vue'
import { computed } from 'vue'
import { watch } from 'vue'
import axios from 'axios'

import { tableProps} from './table'

defineOptions({
  name: 'ETable',
})


const props = defineProps(tableProps)
const emit = defineEmits([
  'beforeFilter',
  'afterFilter',
  'beforeAdd',
  'beforeEdit',
  'beforeSubmit',
  'afterSubmit',
  'afterDelete',
])

const pageNow = ref(1)
const pageSize = computed(() => props.row)

const items = ref<[]>([])
const totalCount = ref<number>(0)
const filter = ref<{ [key: string]: unknown }>({})
const sortFiled = ref<string>('')
const formVisiable = ref(false)
const form = ref<{ [key: string]: unknown }>({})
const action = ref<string>('')
const errors = ref<{ [key: string]: unknown }>({})
const formRef = ref<FormInstance>()
const TableRef = ref<InstanceType<typeof ElTable>>()
const loading = ref(false)
const submiting = ref(false)
const filterTimer = ref<number>()

const request = props.axios || axios.create()

const setFormRef = (form: FormInstance) => {
  formRef.value = form
}

const breakSubmit = ref(false)
const PageLayout = computed(() => {
  if (props.layout) {
    return props.layout
  } else {
    return 'prev, pager, next'
  }
})


if (props.initFilter) {
  filter.value = props.initFilter
}

interface ElSortProp {
  order: string
  prop: string
  column: TableColumnCtx
}
const sortChange = (sort: ElSortProp) => {
  if (sort.prop && sort.order) {
    const order = sort.order === 'ascending' ? '+' : '-'
    sortFiled.value = order + sort.prop
  } else {
    sortFiled.value = ''
  }

  fetchList()
}

interface apiListData {
  code: number
  message: string
  data: {
    count: number
    page: number
    data: []
  }
}

const fetchList = () => {
  if (loading.value) {
    return
  }

  if (!props.listUrl) {
    ElMessage.error('List url not set')
    return
  }

  loading.value = true
  const tmpFilter: { [key: string]: string } = {}
  Object.assign(tmpFilter, props.query, filter.value)
  tmpFilter['page'] = String(pageNow.value)
  tmpFilter['row'] = String(props.row)
  if (sortFiled.value) {
    tmpFilter['sort'] = sortFiled.value
  }

  emit('beforeFilter', tmpFilter.value)
  request({
    url: props.listUrl,
    params: tmpFilter,
  })
    .then((res: any) => {
      const apiData = res.data as apiListData
      console.log(apiData);
      
      if (apiData.code === 0) {
        const tmpList: [] = []
        Object.assign(tmpList, apiData.data.data)
        items.value = tmpList

        totalCount.value = apiData.data.count

        emit('afterFilter', res, (newItem: []) => {
          items.value = newItem
        })
      }
    })
    .finally(() => {
      loading.value = false
    })
}

const pageChange = (currPage: number) => {
  pageNow.value = currPage
  fetchList()
}

const showAdd = () => {
  action.value = 'add'
  formVisiable.value = true
  emit('beforeAdd', form.value, (asyncRow: { [key: string]: unknown }) => {
    form.value = asyncRow
  })
}

const closeForm = () => {
  errors.value = {}
  form.value = {}
  action.value = ''
}

const toggleFormVisible = () => {
  if (formVisiable.value) {
    formVisiable.value = false
  } else {
    formVisiable.value = true
  }
}

const showEdit = (row: unknown) => {
  form.value = Object.assign({}, row)
  formVisiable.value = true
  action.value = 'edit'
  emit('beforeEdit', form.value, (asyncRow: { [key: string]: unknown }) => {
    form.value = asyncRow
  })
}

const submit = () => {
  if (!formRef.value) {
    ElMessage.error('Not set form ref')
    return
  }

  let submitUrl = props.submitUrl
  let submitMethod = props.requestMethod.submitUrl || 'POST'
  if (action.value === 'add' && props.addUrl) {
    submitUrl = props.addUrl
    submitMethod = props.requestMethod.addUrl || 'POST'
  }

  errors.value = {}
  formRef.value.validate((valid) => {
    if (valid) {
      if (!submitUrl) {
        ElMessage.error('Not set submit url')
        // return
      }

      let submitForm = Object.assign({}, form.value)
      emit('beforeSubmit', submitForm, (isBreak: boolean | { [key: string]: unknown }) => {
        if (typeof isBreak === 'boolean') {
          breakSubmit.value = isBreak
        } else {
          submitForm = isBreak
        }
      })

      if (breakSubmit.value) {
        return
      }

      if (loading.value) {
        return
      }
      submiting.value = true

      request({
        url: submitUrl,
        method: submitMethod,
        data: submitForm,
      })
        .then((res: unknown) => {
          const apiData = res as apiListData
          ElMessage.success(apiData.message || '操作成功')
          formVisiable.value = false
          fetchList()
        })
        .catch((err) => {
          if (err.response.data.data && err.response.data.data.errors) {
            errors.value = err.response.data.data.errors
          }
        })
        .finally(() => {
          submiting.value = false
          emit('afterSubmit', errors.value)
        })
    } else {
      // return false
    }
  })
}

const deleteItem = (row: { [key: string]: unknown }) => {
  const pk = row[props.pk] || ''
  const noticeField = row[props.noticeFiled] || ''
  const requestMethod = props.requestMethod.deleteUrl || 'POST'
  ElMessageBox.confirm(
    'are you sure continue to del this item' + (noticeField ? `[${noticeField}]?` : '?'),
    'Warning',
    {
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      type: 'warning',
    },
  )
    .then(() => {
      const data: { [key: string]: unknown } = {}
      data[props.pk] = pk
      request({
        url: props.deleteUrl,
        method: requestMethod,
        data: data,
        params: requestMethod === 'GET' ? data : null,
      })
        .then(() => {
          fetchList()
          emit('afterDelete', data.value, true)
        })
        .catch(() => {
          emit('afterDelete', data.value, false)
        })
    })
    .catch(() => {})
}

const initFormValue = (formValue: { [key: string]: unknown }) => {
  for (const i in formValue) {
    form.value[i] = formValue[i]
  }
}

const clear = () => {
  filter.value = {}
  pageNow.value = 1
  items.value = []
}

watch(
  [() => filter.value],
  () => {
    if (filterTimer.value) {
      clearTimeout(filterTimer.value)
    }
    filterTimer.value = setTimeout(() => {
      filterTimer.value = 0
      pageNow.value = 1
      fetchList()
    }, props.filterLazy)
  },
  { deep: true },
)

defineExpose({
  fetchList,
  formRef,
  TableRef,
  items,
  initFormValue,
  clear,
  submit,
})

fetchList()
</script>
