# @eclou/e-table 使用说明

`@eclou/e-table` 是一个基于 Vue 3 + Element Plus 的 CRUD 表格组件，内置：
- 列表查询 + 分页 + 排序
- 新增/编辑弹窗
- 删除确认
- 过滤区、工具栏、操作列、表单槽位扩展

## 安装

```bash
npm i @eclou/e-table element-plus axios
```

## 快速开始

### 全局注册

```ts
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import { ETablePlugin } from '@eclou/e-table'
import 'element-plus/dist/index.css'

const app = createApp(App)
app.use(ElementPlus)
app.use(ETablePlugin)
app.mount('#app')
```

### 局部注册

```vue
<script setup lang="ts">
import { ETable } from '@eclou/e-table'
</script>
```

## 后端返回格式约定

列表请求（`listUrl`）默认按以下结构读取数据：

```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "count": 100,
    "page": 1,
    "data": []
  }
}
```

`data.data` 会作为表格数据，`data.count` 用于分页总数。

## Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `pk` | `string` | `"_id"` | 主键字段名，删除时会用到 |
| `page` | `number` | `1` | 当前版本未直接使用 |
| `row` | `number` | `10` | 每页条数 |
| `query` | `object` | `{}` | 固定查询参数，会和过滤条件合并 |
| `initFilter` | `object` | `{}` | 初始过滤条件 |
| `layout` | `string` | `"prev, pager, next"` | 分页布局，透传给 `el-pagination` |
| `defualtFilter` | `boolean` | `true` | 是否显示默认过滤区（字段名按源码拼写） |
| `defaultAction` | `boolean` | `true` | 是否显示默认操作列 |
| `defaultEdit` | `boolean` | `true` | 是否显示默认编辑按钮 |
| `defaultDelete` | `boolean` | `true` | 是否显示默认删除按钮 |
| `listUrl` | `string` | - | 列表接口地址（必填） |
| `addUrl` | `string` | - | 新增提交地址 |
| `submitUrl` | `string` | - | 编辑提交地址 |
| `deleteUrl` | `string` | - | 删除接口地址 |
| `filterLazy` | `number` | `600` | 过滤防抖毫秒数 |
| `noticeFiled` | `string` | `""` | 删除确认文案展示字段（字段名按源码拼写） |
| `requestMethod` | `object` | `{ addUrl:'POST', submitUrl:'POST', deleteUrl:'POST' }` | 各接口请求方法 |
| `formFullScreen` | `boolean` | `false` | 表单弹窗是否全屏 |
| `axios` | `AxiosInstance` | `null` | 自定义请求实例，不传则内部创建实例 |

## 组件事件（`emits`）

| 事件名 | 回调参数 | 用途 |
| --- | --- | --- |
| `beforeFilter` | `(params)` | 列表请求前触发 |
| `afterFilter` | `(res, setItems)` | 列表成功后触发，可二次处理列表 |
| `beforeAdd` | `(form, setForm)` | 打开新增弹窗前初始化表单 |
| `beforeEdit` | `(form, setForm)` | 打开编辑弹窗前处理表单 |
| `beforeSubmit` | `(submitForm, next)` | 提交前改写数据或中断提交 |
| `afterSubmit` | `(errors)` | 提交后触发（成功/失败都会触发） |
| `afterDelete` | `(data, success)` | 删除请求完成后触发 |

`beforeSubmit` 中的 `next` 用法：
- `next(true)`：中断提交
- `next(newFormObject)`：替换提交数据

## 暴露函数与引用（`defineExpose`）

可通过 `ref` 调用：

| 名称 | 类型 | 说明 |
| --- | --- | --- |
| `fetchList` | `() => void` | 手动刷新列表 |
| `submit` | `() => void` | 手动触发表单提交 |
| `clear` | `() => void` | 清空过滤并重置列表 |
| `initFormValue` | `(formValue) => void` | 批量设置表单值 |
| `items` | `Ref<any[]>` | 当前表格数据 |
| `formRef` | `Ref<FormInstance>` | 表单实例引用 |
| `TableRef` | `Ref<ElTable>` | 表格实例引用 |

## 插槽

| 插槽名 | 作用域参数 | 说明 |
| --- | --- | --- |
| 默认插槽 | - | 放 `el-table-column` |
| `filter` | `{ filter, add }` | 自定义查询区与新增按钮 |
| `toolbar` | - | 表格上方工具栏 |
| `action` | - | 整体替换操作列 |
| `actionMore` | `{ row, edit, delete }` | 默认编辑/删除按钮前插入内容 |
| `actionMoreAfter` | `{ row, edit, delete }` | 默认编辑/删除按钮后插入内容 |
| `form` | `{ setFormRef, form, action, errors, loading, close, submit }` | 自定义新增/编辑表单 |

## 使用用例

### 用例 1：标准 CRUD（查询 + 新增/编辑 + 删除）

```vue
<template>
  <ETable
    ref="tableRef"
    list-url="/api/user/list"
    add-url="/api/user/add"
    submit-url="/api/user/edit"
    delete-url="/api/user/delete"
    pk="id"
    notice-filed="name"
    :query="{ status: 1 }"
    :request-method="{ addUrl: 'POST', submitUrl: 'PUT', deleteUrl: 'DELETE' }"
    @before-submit="handleBeforeSubmit"
  >
    <template #filter="{ filter, add }">
      <el-form-item label="姓名">
        <el-input v-model="filter.name" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="add">新增</el-button>
      </el-form-item>
    </template>

    <el-table-column prop="id" label="ID" width="80" />
    <el-table-column prop="name" label="姓名" />
    <el-table-column prop="email" label="邮箱" />

    <template #form="{ setFormRef, form, action, submit, close }">
      <el-form :model="form" :ref="setFormRef">
        <el-form-item label="姓名" prop="name" required>
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email" required>
          <el-input v-model="form.email" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit">
            {{ action === 'add' ? '创建' : '保存' }}
          </el-button>
          <el-button @click="close">取消</el-button>
        </el-form-item>
      </el-form>
    </template>
  </ETable>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const tableRef = ref()

const handleBeforeSubmit = (form: Record<string, unknown>, next: (arg: unknown) => void) => {
  const payload = { ...form, updatedAt: Date.now() }
  next(payload)
}
</script>
```

### 用例 2：通过 expose 手动控制

```vue
<template>
  <div>
    <el-button @click="refresh">手动刷新</el-button>
    <el-button @click="resetTable">清空筛选</el-button>
    <ETable ref="tableRef" list-url="/api/order/list" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const tableRef = ref<{
  fetchList: () => void
  clear: () => void
}>()

const refresh = () => tableRef.value?.fetchList()
const resetTable = () => tableRef.value?.clear()
</script>
```

## 注意事项

- 当前源码字段名为 `defualtFilter`、`noticeFiled`，使用时请按该拼写传参。
- 组件会把未声明的属性通过 `$attrs` 透传到 `el-table`，可直接使用 Element Plus 的表格属性和事件。

## 对外发布

维护者发布与回滚流程见：[对外发布文档](./docs/RELEASE.md)
