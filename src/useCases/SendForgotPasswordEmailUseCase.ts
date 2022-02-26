import { UserToken } from '@entities/UserToken'
import { MailProvider } from '@providers/MailProvider/MailProvider'
import { UsersRepository } from '@repositories/UsersRepository'
import { UserTokensRepository } from '@repositories/UserTokensRepository'
import { randomUUID } from 'crypto'
import { resolve } from 'path'
import { UseCase } from './UseCase.interface'

interface Request {
  email: string
}

export class SendForgotPasswordEmailUseCase implements UseCase<Request, void> {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly userTokensRepository: UserTokensRepository,
    private readonly mailProvider: MailProvider
  ) {}

  async execute({ email }: Request): Promise<void> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      return
    }

    const token = randomUUID()
    const userToken = UserToken.create({
      userId: user.id,
      token,
      createdAt: new Date()
    })
    const forgotPasswordTemplateFilePath = resolve(
      __dirname,
      '..',
      'views',
      'forgot_password.hbs'
    )

    await this.userTokensRepository.save(userToken)
    await this.mailProvider.sendMail({
      subject: '[SRS App] - Recuperação de senha',
      to: {
        name: user.name,
        email: user.email
      },
      templateData: {
        file: forgotPasswordTemplateFilePath,
        variables: {
          name: user.name,
          link: `${process.env.APP_WEB_URL}/reset-password?token=${token}`
        }
      }
    })
  }
}
