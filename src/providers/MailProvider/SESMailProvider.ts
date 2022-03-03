import { MailTemplateProvider } from '@providers/MailTemplateProvider/MailTemplateProvider.interface'
import nodemailer, { Transporter } from 'nodemailer'
import { MailProvider, SendMail } from './MailProvider'
import { SES } from 'aws-sdk'

export class SESMailProvider implements MailProvider {
  private client: Transporter

  constructor(private readonly mailTemplateProvider: MailTemplateProvider) {
    this.client = nodemailer.createTransport({
      SES: new SES({
        apiVersion: '2010-12-01',
        region: 'us-east-1'
      })
    })
  }

  async sendMail({ subject, to, from, templateData }: SendMail): Promise<void> {
    const html = templateData
      ? await this.mailTemplateProvider.parse(templateData)
      : undefined

    await this.client.sendMail({
      from: {
        name: from?.name || 'Equipe SRS App',
        address: from?.email || 'equipe@srsapp.com.br'
      },
      to: {
        name: to.email,
        address: to.email
      },
      subject,
      html
    })
  }
}
