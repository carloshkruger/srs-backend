import { Entity } from './Entity'

type CardProps = {
  deckId: string
  originalText: string
  translatedText: string
  audioFileName: string
}

export class Card extends Entity<CardProps> {
  public get deckId(): string {
    return this.props.deckId
  }

  public get originalText(): string {
    return this.props.originalText
  }

  public get translatedText(): string {
    return this.props.translatedText
  }

  public get audioFileName(): string {
    return this.props.audioFileName
  }

  private constructor(props: CardProps, id?: string) {
    super(props, id)
  }

  public static create(props: CardProps, id?: string): Card {
    return new Card(
      {
        ...props,
        originalText: props.originalText.trim(),
        translatedText: props.translatedText.trim()
      },
      id
    )
  }

  public updateOriginalText(originalText: string): void {
    this.props.originalText = originalText
  }

  public updateTranslatedText(translatedText: string): void {
    this.props.translatedText = translatedText
  }

  public updateAudioFileName(audioFileName: string): void {
    this.props.audioFileName = audioFileName
  }

  public getFilePathToStorageAudioFile(userId: string): string[] {
    return ['users', userId, 'decks', this.deckId, 'cards', this.id]
  }
}
