<template>
  <el-card>
    <el-table :data="showExcelForm.data" stripe border>
      <el-table-column v-for="key in showExcelForm.keys" :prop="key" :label="key" />
    </el-table>
  </el-card>
</template>

<script lang="ts" setup>
import { useParseExcel } from '@/store/ParseExcel.js'
import { storeToRefs } from 'pinia'

const parseExcel = useParseExcel()
const { showExcelForm } = storeToRefs(parseExcel)
</script>

<style lang="scss" scoped></style>
