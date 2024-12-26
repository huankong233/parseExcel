import { makePath } from '@/utils/FileReader.js'
import { defineStore } from 'pinia'

import type { UploadFile, UploadRawFile } from 'element-plus/es/components/upload'
import type { WorkBook } from 'xlsx'

export const useParseExcel = defineStore({
  id: 'parseExcel',
  state: () => ({
    fileList: [] as UploadFile[],
    fileListForm: {
      excelFile: null as unknown as UploadRawFile,
      sheetName: '',
      nameCol: '',
      nameColIndex: -1,
      nameRegexp: '学生：(.*?)-',
      dataCol: [],
    },
    showExcelForm: {
      workbook: null as unknown as WorkBook,
      keys: [] as string[],
      data: [] as any[],
    },
  }),
  getters: {
    rawFileList(state): UploadRawFile[] {
      return state.fileList.map((file) => file.raw) as UploadRawFile[]
    },
    excelFiles(): UploadRawFile[] {
      return this.rawFileList.filter((file) => file.name.endsWith('.xlsx') || file.name.endsWith('.csv'))
    },
    formatFileList() {
      const base = {}
      this.rawFileList.forEach((file: UploadRawFile) => {
        const { webkitRelativePath } = file
        makePath(base, webkitRelativePath, file)
      })
      return base
    },
  },
  actions: {
    initVariables() {
      this.fileList = []
      this.fileListForm = {
        excelFile: null as unknown as UploadRawFile,
        sheetName: '',
        nameCol: '',
        nameColIndex: -1,
        nameRegexp: '学生：(.*?)-',
        dataCol: [],
      }
      this.showExcelForm = {
        workbook: null as unknown as WorkBook,
        keys: [],
        data: [],
      }
    },
    // 根据路径找到文件
    findFile(path: string): File | null {
      const paths = path.split('/')
      let last = this.formatFileList as any
      paths.forEach((path) => {
        if (last !== null) {
          last = last[path] ?? null
        }
      })

      return last
    },
  },
})
