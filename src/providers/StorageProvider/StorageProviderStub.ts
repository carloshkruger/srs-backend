import { StorageProvider } from './StorageProvider.interface'

export class StorageProviderStub implements StorageProvider {
  async saveFileFromBuffer(): Promise<void> {
    return Promise.resolve(undefined)
  }
  async saveFile(): Promise<void> {
    return Promise.resolve(undefined)
  }
  async deleteFile(): Promise<void> {
    return Promise.resolve(undefined)
  }
  async deleteFolder(): Promise<void> {
    return Promise.resolve(undefined)
  }
}
