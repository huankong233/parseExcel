export async function readAsBinaryString(file: File): Promise<string | undefined> {
  return new Promise((resove, reject) => {
    const reader = new FileReader()
    reader.onload = function (ev) {
      resove(ev?.target?.result as string)
    }
    reader.readAsBinaryString(file)
  })
}

import type { UploadRawFile } from 'element-plus/es/components/upload'

// 创建树状结构
export function makePath(obj: object, path: string, value: UploadRawFile) {
  const paths = path.split('/')
  let last = obj as any
  // 抛弃第一位
  paths.forEach((path, index) => {
    if (index === 0) return
    if (!last[path]) {
      last[path] = index === paths.length - 1 ? value : {}
    }
    last = last[path]
  })
}
