import { mailTemplateProvider } from '@providers/MailTemplateProvider'
import { EtherealMailProvider } from './EtherealMailProvider'

const mailProvider = new EtherealMailProvider(mailTemplateProvider)

export { mailProvider }
