export function bindInputDirectory() {
  const upload = document.querySelector('.upload')
  if (!upload) throw new Error('Upload element not found')

  const input = upload.querySelector('input')
  if (!input) throw new Error('Input element not found')

  input.webkitdirectory = true
}
