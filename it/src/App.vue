<template>
  <n-config-provider :theme="darkTheme">
    <n-layout class="app-layout" has-sider :style="backgroundStyle">
      <n-layout-sider width="240" bordered content-style="padding: 24px;">
        <n-h1 prefix="bar" style="margin-bottom: 32px;">
          <n-text type="primary">MC 启动器 & 开服器</n-text>
        </n-h1>

        <n-menu v-model:value="mode" :options="menuOptions" />

        <n-divider />

        <n-card title="快速背景" size="small" :bordered="false">
          <n-select v-model:value="quickBgPreset" :options="quickBgOptions" size="small" />
        </n-card>
      </n-layout-sider>

      <n-layout content-style="padding: 24px;">
        <n-layout-header style="margin-bottom: 24px;">
          <n-page-header :title="currentTitle" />
        </n-layout-header>

        <n-layout-content>
          <n-card embedded>
            <LauncherView v-if="mode === 'launcher'" />
            <ServerView v-else />
          </n-card>

          <n-card title="终端输出" style="margin-top: 24px;" embedded>
            <Terminal ref="terminalRef" :process="currentProcess" />
          </n-card>
        </n-layout-content>
      </n-layout>

      <n-float-button type="primary" @click="showSettings = true">
        <n-icon :component="SettingsOutline" />
      </n-float-button>

      <n-drawer v-model:show="showSettings" width="460" placement="right">
        <n-drawer-content title="设置中心">
          <SettingsView @update:background="applyBackground" />
        </n-drawer-content>
      </n-drawer>
    </n-layout>
  </n-config-provider>
</template>

<script setup>
import { ref, computed, onMounted, watch, provide, h } from 'vue'
import {
  NConfigProvider, NLayout, NLayoutSider, NLayoutHeader, NLayoutContent,
  NH1, NText, NMenu, NDivider, NCard, NPageHeader, NSelect,
  NDrawer, NDrawerContent, NFloatButton, NIcon, darkTheme
} from 'naive-ui'
import { SettingsOutline, HomeOutline, ServerOutline } from '@vicons/ionicons5'

import LauncherView from './components/LauncherView.vue'
import ServerView from './components/ServerView.vue'
import SettingsView from './components/SettingsView.vue'
import Terminal from './components/Terminal.vue'

const mode = ref('launcher')
const showSettings = ref(false)
const currentProcess = ref(null)
const terminalRef = ref(null)

provide('terminal', terminalRef)
provide('setProcess', (proc) => currentProcess.value = proc)

const menuOptions = [
  { label: '客户端启动器', key: 'launcher', icon: () => h(NIcon, { component: HomeOutline }) },
  { label: '服务端管理', key: 'server', icon: () => h(NIcon, { component: ServerOutline }) }
]

const currentTitle = computed(() => mode.value === 'launcher' ? 'Minecraft 客户端启动器' : 'Minecraft 服务端管理')

const backgroundType = ref('solid')
const solidColor = ref('#141414')
const imageUrl = ref('')

const backgroundStyle = computed(() => {
  if (backgroundType.value === 'image' && imageUrl.value) {
    return {
      backgroundImage: `url(${imageUrl.value})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundColor: '#000'
    }
  }
  return { backgroundColor: solidColor.value }
})

const quickBgPreset = ref('dark')
const quickBgOptions = [
  { label: '深色（推荐）', value: 'dark' },
  { label: '纯黑', value: 'black' },
  { label: '深灰', value: 'gray' },
  { label: '使用图片背景', value: 'image' }
]

const applyQuickPreset = () => {
  const presets = { dark: '#141414', black: '#000000', gray: '#1e1e1e' }
  if (presets[quickBgPreset.value]) {
    solidColor.value = presets[quickBgPreset.value]
    backgroundType.value = 'solid'
    localStorage.setItem('bgSolidColor', solidColor.value)
    localStorage.setItem('backgroundType', 'solid')
  } else if (quickBgPreset.value === 'image') {
    backgroundType.value = 'image'
    localStorage.setItem('backgroundType', 'image')
  }
}

const applyBackground = ({ type, color, url }) => {
  if (type === 'solid') {
    solidColor.value = color
    backgroundType.value = 'solid'
    quickBgPreset.value = 'dark'
  } else if (type === 'image') {
    imageUrl.value = url || ''
    backgroundType.value = 'image'
    quickBgPreset.value = 'image'
  }
  localStorage.setItem('backgroundType', type)
  if (type === 'solid') localStorage.setItem('bgSolidColor', color)
  if (type === 'image') localStorage.setItem('bgImageUrl', url || '')
}

onMounted(() => {
  backgroundType.value = localStorage.getItem('backgroundType') || 'solid'
  solidColor.value = localStorage.getItem('bgSolidColor') || '#141414'
  imageUrl.value = localStorage.getItem('bgImageUrl') || ''
  if (backgroundType.value === 'image') quickBgPreset.value = 'image'
})

watch(quickBgPreset, applyQuickPreset)
</script>

<style scoped>
.app-layout, .n-layout { height: 100vh; transition: all 0.8s ease; }
.n-layout-sider { background: rgba(255, 255, 255, 0.04) !important; }
</style>