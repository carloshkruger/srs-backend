interface FileInfo {
  fileName: string
  filePath: string[]
}

interface FileBufferInfo extends FileInfo {
  bufferContent: Buffer
}

interface StorageProvider {
  saveFileFromBuffer(data: FileBufferInfo): Promise<void>
  deleteFile(data: FileInfo): Promise<void>
  deleteFolder(filePath: string[]): Promise<void>
}

export { StorageProvider, FileInfo, FileBufferInfo }
