import { User } from '../utils/interfaces'
import { Db, ObjectID } from 'mongodb'

export interface UserRepoInterface {
  addUser(user: User): Promise<any>
  findUserByID(id: string): Promise<any>
  findUserByEmail(email: string): Promise<any>
}

export class UserRepository implements UserRepoInterface {
  db: Db
  constructor(db: Db) {
    this.db = db
  }
  addUser(user: User): Promise<any> {
    return this.db.collection('users').insertOne(user)
  }

  findUserByID(id: string): Promise<any> {
    return this.db.collection('users').findOne({ _id: new ObjectID(id) })
  }

  findUserByEmail(email: string): Promise<any> {
    return this.db.collection('users').findOne({ email: email })
  }
}
