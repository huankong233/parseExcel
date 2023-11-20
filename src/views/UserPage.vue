<template>
  <UploadFile />
  <FileList v-if="parseExcel.fileList.length > 0" />
  <ShowExcel v-if="parseExcel.fileListForm.sheetName" />
</template>

<script lang="ts" setup>
// import { defineAsyncComponent } from 'vue'
// const FileList = defineAsyncComponent(() => import('@/components/FileList.vue'))
// const UploadFile = defineAsyncComponent(() => import('@/components/UploadFile.vue'))
// const ShowExcel = defineAsyncComponent(() => import('@/components/ShowExcel.vue'))

import FileList from '@/components/FileList.vue'
import UploadFile from '@/components/UploadFile.vue'
import ShowExcel from '@/components/ShowExcel.vue'

import { useParseExcel } from '@/store/ParseExcel.js'

const parseExcel = useParseExcel()
</script>

<style lang="scss" scoped></style>
