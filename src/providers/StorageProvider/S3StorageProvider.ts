import { S3 } from 'aws-sdk'
import {
  FileBufferInfo,
  FileInfo,
  StorageProvider
} from './StorageProvider.interface'

export class S3StorageProvider implements StorageProvider {
  private client: S3
  private bucketName: string

  constructor() {
    this.client = new S3({
      region: 'us-east-1'
    })
    this.bucketName = process.env.AWS_BUCKET_NAME
  }

  async saveFileFromBuffer({
    fileName,
    filePath,
    bufferContent
  }: FileBufferInfo): Promise<void> {
    try {
      await this.client
        .putObject({
          Bucket: this.bucketName,
          Key: this.mountKey({ fileName, filePath }),
          ACL: 'public-read',
          Body: bufferContent
        })
        .promise()
    } catch (error) {
      throw new Error('Error while uploading file to storage.')
    }
  }

  async deleteFile(data: FileInfo): Promise<void> {
    try {
      await this.client
        .deleteObject({
          Bucket: this.bucketName,
          Key: this.mountKey(data)
        })
        .promise()
    } catch (error) {
      throw new Error('Error while deleting file.')
    }
  }

  async deleteFolder(filePath: string[]): Promise<void> {
    try {
      const listedObjects = await this.client
        .listObjectsV2({
          Bucket: this.bucketName,
          Prefix: this.mountPrefix(filePath)
        })
        .promise()

      if (listedObjects.Contents.length === 0) {
        return
      }

      const deleteParams: S3.DeleteObjectsRequest = {
        Bucket: this.bucketName,
        Delete: { Objects: [] }
      }

      listedObjects.Contents.forEach(({ Key }) => {
        deleteParams.Delete.Objects.push({ Key })
      })

      await this.client.deleteObjects(deleteParams).promise()

      if (listedObjects.IsTruncated) {
        await this.deleteFolder(filePath)
      }
    } catch (error) {
      throw new Error('Error while deleting files.')
    }
  }

  private mountPrefix(filePath: string[]): string {
    return filePath.join('/')
  }

  private mountKey({ fileName, filePath }: FileInfo): string {
    return `${this.mountPrefix(filePath)}/${fileName}`
  }
}
