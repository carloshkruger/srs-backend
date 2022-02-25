import { randomUUID } from 'crypto'
import {
  FileInfo,
  StorageProvider
} from '@providers/StorageProvider/StorageProvider.interface'
import { TextToSpeechProvider } from '@providers/TextToSpeechProvider/TextToSpeechProvider.interface'
import { CardsRepository } from '@repositories/CardsRepository'
import { DecksRepository } from '@repositories/DecksRepository'
import {
  CardDoesNotBelongToTheUser,
  CardNotFound,
  CardOriginalTextAlreadyCreated
} from './errors'
import { UseCase } from './UseCase.interface'

interface Request {
  userId: string
  cardId: string
  originalText: string
  translatedText: string
}

export class UpdateCardUseCase implements UseCase<Request, void> {
  constructor(
    private decksRepository: DecksRepository,
    private cardsRepository: CardsRepository,
    private textToSpeechProvider: TextToSpeechProvider,
    private storageProvider: StorageProvider
  ) {}

  async execute({
    userId,
    cardId,
    originalText,
    translatedText
  }: Request): Promise<void> {
    const card = await this.cardsRepository.findById(cardId)

    if (!card) {
      throw new CardNotFound()
    }

    const deck = await this.decksRepository.findById(card.deckId)

    if (deck.userId !== userId) {
      throw new CardDoesNotBelongToTheUser()
    }

    const cardByOriginalText =
      await this.cardsRepository.findByDeckIdAndOriginalText(
        card.deckId,
        originalText
      )

    if (cardByOriginalText && cardByOriginalText.id !== cardId) {
      throw new CardOriginalTextAlreadyCreated()
    }

    const oldOriginalText = card.originalText
    const oldAudioFileName = card.audioFileName
    const hasOriginalTextChanged =
      oldOriginalText.toLowerCase().trim() !== originalText.toLowerCase().trim()

    let fileInfo: null | FileInfo = null

    if (hasOriginalTextChanged) {
      const audioFileName = `${randomUUID()}.mp3`
      const filePath = card.getFilePathToStorage(userId)
      const audioBuffer = await this.textToSpeechProvider.createAudio(
        originalText
      )

      fileInfo = {
        fileName: audioFileName,
        filePath
      }

      await this.storageProvider.saveFileFromBuffer({
        ...fileInfo,
        bufferContent: audioBuffer
      })

      card.updateAudioFileName(audioFileName)
    }

    card.updateOriginalText(originalText)
    card.updateTranslatedText(translatedText)

    try {
      await this.cardsRepository.save(card)
    } catch (error) {
      if (hasOriginalTextChanged) {
        await this.storageProvider.deleteFile(fileInfo)
      }

      throw error
    }

    if (hasOriginalTextChanged) {
      await this.storageProvider.deleteFile({
        fileName: oldAudioFileName,
        filePath: fileInfo.filePath
      })
    }
  }
}
