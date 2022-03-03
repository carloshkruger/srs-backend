interface TemplateVariables {
  [key: string]: string | number
}

export interface ParseMailTemplate {
  file: string
  variables: TemplateVariables
}

export interface MailTemplateProvider {
  parse(data: ParseMailTemplate): Promise<string>
}
