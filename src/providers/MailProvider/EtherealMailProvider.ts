import { MailTemplateProvider } from '@providers/MailTemplateProvider/MailTemplateProvider.interface'
import nodemailer, { Transporter } from 'nodemailer'
import { MailProvider, SendMail } from './MailProvider'

export class EtherealMailProvider implements MailProvider {
  private client: Transporter

  constructor(private readonly mailTemplateProvider: MailTemplateProvider) {}

  async sendMail({ subject, to, from, templateData }: SendMail): Promise<void> {
    const html = templateData
      ? await this.mailTemplateProvider.parse(templateData)
      : undefined

    const client = await this.getTransporter()

    const info = await client.sendMail({
      from: {
        name: from?.name || 'Equipe SRS App',
        address: from?.email || 'equipe@srsapp.com.br'
      },
      to: {
        name: to.name,
        address: to.email
      },
      subject,
      html
    })

    console.log('Message sent: %s', info.messageId)
    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
  }

  private async getTransporter(): Promise<Transporter> {
    if (!this.client) {
      const account = await nodemailer.createTestAccount()

      this.client = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
          user: account.user,
          pass: account.pass
        }
      })
    }

    return this.client
  }
}
