<template>
  <el-card v-if="excelFiles.length > 0">
    <el-form
      ref="fileListFormRef"
      :model="fileListForm"
      :rules="fileListFormRule"
      label-width="180"
    >
      <el-form-item
        label="需要解析的Excel文件"
        prop="excelFile"
      >
        <el-select
          v-model="fileListForm.excelFile"
          placeholder="请选择"
          @change="changeExcelFile()"
          bslur-key="uid"
        >
          <el-option
            v-for="xlsx in excelFiles"
            :key="xlsx.uid"
            :label="xlsx.name"
            :value="xlsx"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="需要解析的工作表"
        prop="sheetName"
        v-if="showExcelForm.workbook"
      >
        <el-select
          v-model="fileListForm.sheetName"
          placeholder="请选择需要解析的工作表"
          @change="changeSheetName()"
        >
          <el-option
            v-for="sheetName in showExcelForm.workbook.SheetNames"
            :key="sheetName"
            :label="sheetName"
            :value="sheetName"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="需要使用的姓名列"
        prop="nameCol"
        v-if="fileListForm.sheetName"
      >
        <el-select
          v-model="fileListForm.nameCol"
          placeholder="请选择姓名列"
          @change="changeNameCol()"
        >
          <el-option
            v-for="key in showExcelForm.keys"
            :key="key"
            :label="key"
            :value="key"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="需要使用的姓名匹配规则"
        prop="nameRegexp"
        v-if="fileListForm.sheetName"
      >
        <el-input
          v-model="fileListForm.nameRegexp"
          placeholder="请输入姓名匹配规则"
          @change="changeNameRegexp()"
        />
      </el-form-item>
      <el-form-item
        label="匹配的结果"
        v-if="fileListForm.sheetName"
      >
        <el-input
          v-model="testResult"
          disabled
        />
      </el-form-item>
      <el-form-item
        label="需要使用的数据列"
        prop="dataCol"
        v-if="fileListForm.sheetName"
      >
        <el-select
          v-model="fileListForm.dataCol"
          placeholder="请选择数据列"
          multiple
        >
          <el-option
            v-for="key in showExcelForm.keys"
            :key="key"
            :label="key"
            :value="key"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="parseFileList(fileListFormRef)"
        >
          生成文件
        </el-button>
        <el-button
          type="danger"
          @click="parseExcel.initVariables()"
        >
          清空数据
        </el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script lang="ts" setup>
import { useParseExcel } from '@/store/ParseExcel.js'
import { readFileAsArrayBuffer } from '@/utils/FileReader'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { saveAs } from 'file-saver'
import JSZip from 'jszip'
import { extname } from 'path-browserify'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { read, utils } from 'xlsx'

const parseExcel = useParseExcel()
const { excelFiles, fileListForm, showExcelForm } = storeToRefs(parseExcel)

if (excelFiles.value.length <= 0) {
  ElMessage.error('没有找到可用的Excel文档')
  parseExcel.initVariables()
}

const fileListFormRef = ref<FormInstance | null>(null)

const fileListFormRule: FormRules = {
  excelFile: [{ required: true, message: '请选择需要解析的Excel文件', trigger: 'change' }],
  sheetName: [{ required: true, message: '请选择需要解析的工作表', trigger: 'change' }],
  nameCol: [{ required: true, message: '请选择需要使用的姓名列', trigger: 'change' }],
  nameRegexp: [{ required: true, message: '请输入姓名匹配规则', trigger: 'blur' }],
  dataCol: [{ required: true, message: '请选择需要使用的数据列', trigger: 'change' }],
}

interface parsedDataItem {
  filePath: string
  fileNames: string[]
}

interface parsedData {
  name: string
  data: parsedDataItem[]
}

async function parseFileList(formEl: FormInstance | null) {
  if (!formEl) return
  if (!(await formEl.validate(() => {}))) return

  // 整理数据
  const parsedData: parsedData[] = []

  const { nameCol, nameRegexp, dataCol } = fileListForm.value
  showExcelForm.value.data.forEach((datum) => {
    const name = datum[nameCol]
    const match = name.toString().match(nameRegexp)
    const regexpName = match ? match[1] : name

    const data: parsedDataItem[] = []

    dataCol.forEach((dataColName) => {
      // 判断是否为多个
      const colData = datum[dataColName].split(/(?<=\.jpg|jpeg|png|gif|webp)\s+/)

      data.push({
        filePath: dataColName,
        fileNames: colData,
      })
    })

    parsedData.push({ name: regexpName, data })
  })

  try {
    // 复制文件
    const zip = JSZip()
    for (let i = 0; i < parsedData.length; i++) {
      const { name, data } = parsedData[i]
      for (let j = 0; j < data.length; j++) {
        const { filePath, fileNames } = data[j]
        fileNames.forEach((fileName, index) => {
          // 实际文件位置
          const fullPath = `${filePath}/${fileName}`
          let outputPath = `${name}/${filePath}${extname(fileName)}`
          if (data.length === 1) {
            outputPath = `${name}${extname(fileName)}`
          } else if (fileNames.length > 1) {
            outputPath = `${name}/${filePath}${index + 1}${extname(fileName)}`
          }
          const file = parseExcel.findFile(fullPath)
          if (file) {
            // 文件存在
            zip.file(outputPath, file)
          } else {
            // 文件不存在
            const message = `"${fullPath}" 文件不存在!请检查选择的文件夹!`
            ElMessage.error(message)
            throw new Error(message)
          }
        })
      }
    }

    zip
      // 生成二进制流
      .generateAsync({
        type: 'blob',
      })
      // 利用file-saver保存文件
      .then((content: Blob) => {
        saveAs(content, 'files.zip')
      })

    ElMessage.success('文件生成成功!')
  } catch (err) {
    console.log(err)
  }
}

async function changeExcelFile() {
  const fileData = await readFileAsArrayBuffer(fileListForm.value.excelFile)
  parseExcel.showExcelForm.workbook = read(fileData, { type: 'buffer' })
}

function changeSheetName() {
  const data = utils
    .sheet_to_json<{ [key: string]: string }>(showExcelForm.value.workbook.Sheets[fileListForm.value.sheetName])
    // 过滤掉已删除的数据
    .filter((item) => {
      let deleted = false
      for (const value in item) {
        if (item[value] === '已删除') deleted = true
      }
      return !deleted
    })

  showExcelForm.value.keys = Object.keys(data[0])
  showExcelForm.value.data = data
}

const testResult = ref('')

function changeNameCol() {
  const { nameCol, nameRegexp } = fileListForm.value
  const { data } = showExcelForm.value
  if (nameRegexp.length <= 0) return (testResult.value = '请检查正则')
  const match = data[0][nameCol].toString().match(nameRegexp)
  testResult.value = match ? match[1] : '匹配失败,请检查正则,否则将直接采用姓名列'
}

function changeNameRegexp() {
  changeNameCol()
}
</script>

<style lang="scss" scoped></style>
