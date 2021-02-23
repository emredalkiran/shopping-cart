import { Db } from 'mongodb'

interface CartData {
  userId: string
  items: Record<string, number>
}

export interface CartRepoInterface {
  addCart(cart: CartData): Promise<any>
  getCart(userId: string): Promise<any>
}

export class CartRepository implements CartRepoInterface {
  db: Db
  constructor(db: Db) {
    this.db = db
  }
  addCart(cart: CartData): Promise<any> {
    return this.db
      .collection('cart')
      .updateOne(
        { userId: cart.userId },
        { $set: { items: cart.items } },
        { upsert: true }
      )
  }

  getCart(userId: string): Promise<any> {
    return this.db.collection('cart').findOne({ userId: userId })
  }
}
