import { MailProvider } from './MailProvider'

export class MailProviderStub implements MailProvider {
  sendMail(): Promise<void> {
    return Promise.resolve(undefined)
  }
}
