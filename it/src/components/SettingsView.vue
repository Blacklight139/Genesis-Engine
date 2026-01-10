<template>
  <n-space vertical size="large">
    <!-- 下载源 -->
    <n-card title="下载源设置" :bordered="false">
      <n-form :label-width="100">
        <n-form-item label="资源源">
          <n-select v-model:value="downloadSource" :options="sourceOptions" />
        </n-form-item>
      </n-form>
    </n-card>

    <!-- Java 路径 -->
    <n-card title="Java 设置" :bordered="false">
      <n-form :label-width="100">
        <n-form-item label="自定义 Java 路径">
          <n-input v-model:value="javaPath" placeholder="留空自动检测" clearable />
        </n-form-item>
      </n-form>
    </n-card>

    <!-- 背景设置 -->
    <n-card title="背景设置" :bordered="false">
      <n-tabs v-model:value="bgTab">
        <n-tab-pane name="solid" tab="纯色背景">
          <n-space vertical>
            <n-color-picker
              v-model:value="tempSolidColor"
              :modes="['hex', 'rgb']"
              :show-alpha="false"
              size="large"
            />
            <n-grid :cols="4" :x-gap="12">
              <n-gi v-for="c in presetColors" :key="c">
                <n-button block @click="tempSolidColor = c" :color="c">
                  {{ c }}
                </n-button>
              </n-gi>
            </n-grid>
          </n-space>
        </n-tab-pane>

        <n-tab-pane name="image" tab="图片背景">
          <n-space vertical align="center">
            <n-button dashed block @click="$refs.fileInput.click()">
              点击选择本地图片
            </n-button>
            <input
              type="file"
              ref="fileInput"
              style="display: none"
              accept="image/*"
              @change="handleImageUpload"
            />

            <div v-if="currentImageUrl" class="preview">
              <n-text>当前背景预览：</n-text>
              <img :src="currentImageUrl" alt="背景预览" />
              <n-button type="error" size="small" @click="clearImageBackground">
                清除图片
              </n-button>
            </div>
            <n-text v-else type="info">未设置图片背景，使用纯色</n-text>
          </n-space>
        </n-tab-pane>
      </n-tabs>
    </n-card>

    <n-button type="primary" block size="large" @click="saveAllSettings">
      保存所有设置
    </n-button>
  </n-space>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useMessage } from 'naive-ui'
import {
  NSpace, NCard, NForm, NFormItem, NSelect, NInput, NTabs, NTabPane,
  NColorPicker, NGrid, NGi, NButton, NText
} from 'naive-ui'

const message = useMessage()
const emit = defineEmits(['update:background'])

const bgTab = ref('solid')

// 设置项
const downloadSource = ref(localStorage.getItem('downloadSource') || 'official')
const javaPath = ref(localStorage.getItem('javaPath') || '')
const tempSolidColor = ref(localStorage.getItem('bgSolidColor') || '#141414')

const presetColors = ['#000000', '#141414', '#1e1e1e', '#2d2d2d', '#0d9488', '#7c3aed']

const currentImageUrl = ref(localStorage.getItem('bgImageUrl') || '')

const sourceOptions = [
  { label: '官方源 (Mojang)', value: 'official' },
  { label: 'BMCLAPI（国内推荐）', value: 'bmclapi' },
  { label: 'FastMCMirror', value: 'fastmirror' }
]

// 颜色变更实时更新
watch(tempSolidColor, (newColor) => {
  emit('update:background', { type: 'solid', color: newColor })
})

// 上传图片
const handleImageUpload = (e) => {
  const file = e.target.files[0]
  if (!file || !file.type.startsWith('image/')) {
    message.error('请选择有效的图片文件')
    return
  }
  const url = URL.createObjectURL(file)
  currentImageUrl.value = url
  emit('update:background', { type: 'image', url })
  message.success('图片背景已应用')
  bgTab.value = 'image'
}

// 清除图片背景
const clearImageBackground = () => {
  currentImageUrl.value = ''
  localStorage.removeItem('bgImageUrl')
  localStorage.setItem('backgroundType', 'solid')
  emit('update:background', { type: 'solid', color: tempSolidColor.value })
  message.info('已清除图片背景')
}

// 保存所有设置
const saveAllSettings = () => {
  localStorage.setItem('downloadSource', downloadSource.value)
  localStorage.setItem('javaPath', javaPath.value)
  localStorage.setItem('bgSolidColor', tempSolidColor.value)
  message.success('所有设置已保存')
}
</script>

<style scoped>
.preview { text-align: center; margin-top: 16px; }
.preview img { 
  width: 100%; 
  max-height: 260px; 
  object-fit: cover; 
  border-radius: 8px; 
  margin: 12px 0; 
  border: 1px solid #444;
}
</style>