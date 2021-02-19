import { Db } from 'mongodb'

export interface ProductRepoInterface {
  incrementProductStock(productId: string): Promise<any>
  decrementProductStock(productId: string): Promise<any>
  findAllProducts(): Promise<any>
}

export class ProductRepository implements ProductRepoInterface {
  db: Db
  constructor(db: Db) {
    this.db = db
  }
  incrementProductStock(productId: string): Promise<any> {
    return this.db.collection('products').findOneAndUpdate(
      {
        productId: productId
      },
      { $inc: { stock: 1 } },
      { returnOriginal: false, projection: { _id: 0, productId: 1, stock: 1 } }
    )
  }
  decrementProductStock(productId: string): Promise<any> {
    return this.db.collection('products').findOneAndUpdate(
      {
        productId: productId,
        stock: { $gt: 0 }
      },
      { $inc: { stock: -1 } },
      { returnOriginal: false, projection: { _id: 0, productId: 1, stock: 1 } }
    )
  }

  findAllProducts(): Promise<any> {
    return this.db
      .collection('products')
      .find({}, { projection: { type: 0 } })
      .toArray()
  }
}
