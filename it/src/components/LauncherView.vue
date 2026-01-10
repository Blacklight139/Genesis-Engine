<template>
  <n-form :model="form" label-placement="left" :label-width="120">
    <n-grid :cols="2" :x-gap="24">
      <n-gi>
        <n-form-item label="游戏版本">
          <n-input v-model:value="form.version" placeholder="例如: 1.21.3" />
        </n-form-item>
      </n-gi>
      <n-gi>
        <n-form-item label="内存分配">
          <n-input v-model:value="form.memory" placeholder="例如: 4G" />
        </n-form-item>
      </n-gi>
    </n-grid>

    <n-form-item label="模组加载器（可选）">
      <n-select
        v-model:value="form.loader"
        :options="loaderOptions"
        clearable
        placeholder="选择 Forge / Fabric / Quilt 或留空使用原版"
      />
    </n-form-item>

    <n-space justify="end">
      <n-button type="primary" size="large" :loading="loading" @click="startClient">
        启动 Minecraft
      </n-button>
    </n-space>
  </n-form>
</template>

<script setup>
import { ref, inject } from 'vue'
import { useMessage } from 'naive-ui'
import {
  NForm, NFormItem, NGrid, NGi, NInput, NSelect, NSpace, NButton
} from 'naive-ui'
import { launchClient } from '@/utils/launcher'

const message = useMessage()
const terminal = inject('terminal')

const form = ref({
  version: '1.21.3',
  memory: '4G',
  loader: null
})

const loaderOptions = [
  { label: 'Forge', value: 'forge' },
  { label: 'Fabric', value: 'fabric' },
  { label: 'Quilt', value: 'quilt' }
]

const loading = ref(false)

const startClient = async () => {
  if (loading.value) return
  loading.value = true
  terminal.value.clear()
  terminal.value.write('正在准备启动客户端，请稍候...\r\n')

  try {
    await launchClient({
      version: form.value.version,
      loader: form.value.loader,
      memory: { max: form.value.memory, min: '1G' }
    }, (log) => terminal.value.write(log + '\r\n'))
    message.success('启动指令已发送，游戏即将运行')
  } catch (err) {
    terminal.value.write(`§c启动失败: ${err.message}§r\r\n`)
    message.error('启动失败，请检查版本、Java 或网络')
  } finally {
    loading.value = false
  }
}
</script>