import {
  MailTemplateProvider,
  ParseMailTemplate
} from './MailTemplateProvider.interface'
import { readFile } from 'fs/promises'
import Handlebars from 'handlebars'

export class HandlebarsMailTemplateProvider implements MailTemplateProvider {
  public async parse({ file, variables }: ParseMailTemplate): Promise<string> {
    const templateFileContent = await readFile(file, {
      encoding: 'utf-8'
    })

    const parseTemplate = Handlebars.compile(templateFileContent)

    return parseTemplate(variables)
  }
}
