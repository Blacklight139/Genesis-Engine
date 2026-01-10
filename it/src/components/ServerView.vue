<template>
  <n-form :model="form" label-placement="left" :label-width="120">
    <n-grid :cols="2" :x-gap="24">
      <n-gi>
        <n-form-item label="服务端 JAR 文件">
          <n-input v-model:value="form.jar" placeholder="例如: server.jar" />
        </n-form-item>
      </n-gi>
      <n-gi>
        <n-form-item label="内存分配">
          <n-input v-model:value="form.memory" placeholder="例如: 4G" />
        </n-form-item>
      </n-gi>
    </n-grid>

    <n-space>
      <n-button
        type="primary"
        size="large"
        :loading="running"
        @click="toggleServer"
      >
        {{ running ? '停止服务端' : '启动服务端' }}
      </n-button>
    </n-space>

    <n-divider />

    <n-form-item label="输入命令">
      <n-input
        v-model:value="command"
        placeholder="输入服务器命令（如 stop、say Hello）"
        @keydown.enter="sendCommand"
        :disabled="!running"
        clearable
      />
    </n-form-item>
  </n-form>
</template>

<script setup>
import { ref, inject } from 'vue'
import { spawn } from 'child_process'
import {
  NForm, NFormItem, NGrid, NGi, NInput, NButton, NSpace, NDivider
} from 'naive-ui'

const terminal = inject('terminal')
const setProcess = inject('setProcess')

const form = ref({
  jar: 'server.jar',
  memory: '4G'
})

const command = ref('')
const running = ref(false)
let serverProc = null

const toggleServer = () => {
  if (running.value) {
    serverProc?.kill('SIGTERM')
    return
  }

  terminal.value.clear()
  terminal.value.write('正在启动 Minecraft 服务端...\r\n')

  serverProc = spawn('java', [
    `-Xmx${form.value.memory}`,
    `-Xms${form.value.memory}`,
    '-jar',
    form.value.jar,
    'nogui'
  ], { cwd: './server' })

  setProcess(serverProc)
  running.value = true

  serverProc.stdout.on('data', data => terminal.value.write(data.toString()))
  serverProc.stderr.on('data', data => terminal.value.write(`§c[错误] ${data.toString()}§r`))
  serverProc.on('close', (code) => {
    terminal.value.write(`\r\n§a服务端已停止 (退出代码: ${code})§r\r\n`)
    running.value = false
    setProcess(null)
    serverProc = null
  })
}

const sendCommand = () => {
  if (serverProc && command.value.trim()) {
    serverProc.stdin.write(command.value + '\n')
    terminal.value.write(`> ${command.value}\r\n`)
    command.value = ''
  }
}
</script>