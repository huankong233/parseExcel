<template>
  <el-card>
    <h2 :class="{ needGap: fileList.length <= 0 }">ParseExcel</h2>

    <el-alert
      show-icon
      type="warning"
      :closable="false"
      title="使用教程: https://www.bilibili.com/video/BV1wu411g7Py"
      @click="openWindow()"
      class="alert"
      v-if="fileList.length <= 0"
    />

    <el-alert
      show-icon
      type="warning"
      :closable="false"
      title="请选择需要操作的文件夹"
      v-if="fileList.length <= 0"
    />

    <el-upload
      drag
      multiple
      ref="upload"
      class="upload"
      :auto-upload="false"
      :show-file-list="false"
      @click="clickHandler()"
      v-model:file-list="fileList"
      v-show="parseExcel.fileList.length <= 0"
    >
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">点击来选择文件夹</div>
    </el-upload>
  </el-card>
</template>

<script lang="ts" setup>
import { useParseExcel } from '@/store/ParseExcel.js'
import { bindInputDirectory } from '@/utils/BindInputWebdirectory'
import { UploadFilled } from '@element-plus/icons-vue'
import { storeToRefs } from 'pinia'
import type { ComponentPublicInstance } from 'vue'
import { onMounted, ref } from 'vue'

const parseExcel = useParseExcel()
const { fileList } = storeToRefs(parseExcel)

const upload = ref<ComponentPublicInstance | null>(null)

// 切换为选择文件夹
onMounted(bindInputDirectory)

// 初始化变量
function clickHandler() {
  parseExcel.initVariables()
}

function openWindow() {
  window.open('https://www.bilibili.com/video/BV1wu411g7Py')
}
</script>

<style lang="scss" scoped>
h2 {
  margin: 0;
}

.needGap {
  margin: 0 0 15px 0;
}

.alert:hover {
  cursor: pointer;
}
</style>
