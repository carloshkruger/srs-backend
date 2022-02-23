import { User } from '@entities/User'

export interface UsersRepository {
  findById(id: string): Promise<User>
  findByEmail(email: string): Promise<User>
  save(user: User): Promise<void>
  deleteById(id: string): Promise<void>
}
