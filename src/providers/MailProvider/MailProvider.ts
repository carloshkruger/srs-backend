import ParseMailTemplate from '@providers/MailTemplateProvider/MailTemplateProvider.interface'

interface MailContact {
  name: string
  email: string
}

export interface SendMail {
  to: MailContact
  from?: MailContact
  subject: string
  templateData?: ParseMailTemplate
}

export interface MailProvider {
  sendMail(data: SendMail): Promise<void>
}
