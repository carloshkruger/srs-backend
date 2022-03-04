import { S3StorageProvider } from './S3StorageProvider'

const putObjectPromiseMock = jest.fn()
const putObjectMock = jest.fn().mockImplementation(() => ({
  promise: putObjectPromiseMock
}))

const deleteObjectPromiseMock = jest.fn()
const deleteObjectMock = jest.fn().mockImplementation(() => ({
  promise: deleteObjectPromiseMock
}))

const listObjectsV2PromiseMock = jest.fn()
const listObjectsV2Mock = jest.fn().mockImplementation(() => ({
  promise: listObjectsV2PromiseMock
}))

const deleteObjectsPromiseMock = jest.fn()
const deleteObjectsMock = jest.fn().mockImplementation(() => ({
  promise: deleteObjectsPromiseMock
}))

jest.mock('aws-sdk', () => ({
  S3: jest.fn().mockImplementation(() => ({
    putObject: putObjectMock,
    deleteObject: deleteObjectMock,
    listObjectsV2: listObjectsV2Mock,
    deleteObjects: deleteObjectsMock
  }))
}))

describe('S3StorageProvider', () => {
  let s3StorageProvider: S3StorageProvider

  beforeEach(() => {
    s3StorageProvider = new S3StorageProvider()
  })

  describe('saveFileFromBuffer', () => {
    it('should call putObject method with correct params', async () => {
      const bufferContent = Buffer.from('binary file')

      await expect(
        s3StorageProvider.saveFileFromBuffer({
          bufferContent,
          fileName: 'audio.mp3',
          filePath: ['path', 'to', 'file']
        })
      ).resolves.toBeUndefined()

      expect(putObjectMock).toHaveBeenCalledWith({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: 'path/to/file/audio.mp3',
        ACL: 'public-read',
        Body: bufferContent
      })
    })

    it('should throw a custom error instead of an aws error', async () => {
      putObjectPromiseMock.mockRejectedValue(new Error('AWS error'))

      const bufferContent = Buffer.from('binary file')

      await expect(
        s3StorageProvider.saveFileFromBuffer({
          bufferContent,
          fileName: 'audio.mp3',
          filePath: ['path', 'to', 'file']
        })
      ).rejects.toThrow(new Error('Error while uploading file to storage.'))
    })
  })

  describe('deleteFile', () => {
    it('should call deleteObject method with correct params', async () => {
      await expect(
        s3StorageProvider.deleteFile({
          fileName: 'audio.mp3',
          filePath: ['path', 'to', 'file']
        })
      ).resolves.toBeUndefined()

      expect(deleteObjectMock).toHaveBeenCalledWith({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: 'path/to/file/audio.mp3'
      })
    })

    it('should throw a custom error instead of an aws error', async () => {
      deleteObjectPromiseMock.mockRejectedValue(new Error('AWS error'))

      await expect(
        s3StorageProvider.deleteFile({
          fileName: 'audio.mp3',
          filePath: ['path', 'to', 'file']
        })
      ).rejects.toThrow(new Error('Error while deleting file.'))
    })
  })

  describe('deleteFolder', () => {
    it('should not delete if there is no file', async () => {
      listObjectsV2PromiseMock.mockResolvedValue({
        Contents: []
      })

      await expect(
        s3StorageProvider.deleteFolder(['path', 'to', 'file'])
      ).resolves.toBeUndefined()

      expect(listObjectsV2Mock).toHaveBeenCalledWith({
        Bucket: process.env.AWS_BUCKET_NAME,
        Prefix: 'path/to/file'
      })
      expect(deleteObjectsMock).not.toHaveBeenCalled()
    })

    it('should call deleteObjects if there is file to delete', async () => {
      listObjectsV2PromiseMock.mockResolvedValue({
        Contents: [
          {
            Key: 'filekey'
          }
        ]
      })

      await expect(
        s3StorageProvider.deleteFolder(['path', 'to', 'file'])
      ).resolves.toBeUndefined()

      expect(deleteObjectsMock).toHaveBeenCalledWith({
        Bucket: process.env.AWS_BUCKET_NAME,
        Delete: {
          Objects: [
            {
              Key: 'filekey'
            }
          ]
        }
      })
    })

    it('should call deleteFolder recursivelly if it was not possible to return all files in one time', async () => {
      listObjectsV2PromiseMock
        .mockResolvedValueOnce({
          Contents: [
            {
              Key: 'filekey'
            }
          ],
          IsTruncated: true
        })
        .mockResolvedValue({
          Contents: [
            {
              Key: 'filekey'
            }
          ],
          IsTruncated: false
        })

      await expect(
        s3StorageProvider.deleteFolder(['path', 'to', 'file'])
      ).resolves.toBeUndefined()

      expect(listObjectsV2Mock).toHaveBeenCalledTimes(2)
      expect(deleteObjectsMock).toHaveBeenCalledTimes(2)
    })

    it('should throw a custom error instead of an aws error', async () => {
      listObjectsV2PromiseMock.mockRejectedValue(new Error('AWS error'))

      await expect(
        s3StorageProvider.deleteFolder(['path', 'to', 'file'])
      ).rejects.toThrow(new Error('Error while deleting files.'))
    })
  })
})
