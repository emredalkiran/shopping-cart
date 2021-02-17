import { User } from '../utils/interfaces'
import { Db } from 'mongodb'

export interface UserRepo {
  addUser(user: User): Promise<any>
  findUserByID(id: string): Promise<any>
  findUserByEmail(email: string): Promise<any>
}

export class UserRepository implements UserRepo {
  db: Db
  constructor(db: Db) {
    this.db = db
  }
  addUser(user: User): Promise<any> {
    return this.db.collection('users').insertOne(user)
  }

  findUserByID(id: string): Promise<any> {
    return this.db.collection('users').findOne({ _id: id })
  }

  findUserByEmail(email: string): Promise<any> {
    return this.db.collection('users').findOne({ email: email })
  }
}
