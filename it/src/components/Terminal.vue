<template>
  <div ref="termRef" class="terminal"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Terminal } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import '@xterm/xterm/css/xterm.css'

const props = defineProps({
  process: Object
})

const termRef = ref(null)
let term = null
let fitAddon = null

onMounted(() => {
  term = new Terminal({
    theme: { background: '#1e1e1e', foreground: '#ffffff' },
    fontSize: 14,
  })
  fitAddon = new FitAddon()
  term.loadAddon(fitAddon)
  term.open(termRef.value)
  fitAddon.fit()

  term.onData(data => {
    if (props.process) props.process.stdin.write(data)
  })

  window.addEventListener('resize', () => fitAddon.fit())
})

onUnmounted(() => term?.dispose())

defineExpose({
  write: (text) => term?.writeln(text),
  clear: () => term?.clear(),
})
</script>

<style scoped>
.terminal { height: 380px; width: 100%; background: #1e1e1e; border-radius: 8px; padding: 12px; }
</style>