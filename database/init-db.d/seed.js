db.dropUser('user')
db.products.drop()
db.users.drop()
db.cart.drop()

use shoppingcart

db.createUser({
  user: 'user',
  pwd: 'password',
  roles: [{ role: 'readAnyDatabase', db: 'admin' }, 'readWrite']
})

db.products.createIndex({ productId: 1 }, { unique: true }),
  db.products.insertMany([
    {
      type: 'phone',
      name: 'Apple iPhone 11',
      price: 700,
      stock: 16,
      productId: 'AiP11'
    },
    {
      type: 'phone',
      name: 'Apple iPhone 12',
      price: 800,
      stock: 32,
      productId: 'AiP12'
    },
    {
      type: 'phone',
      name: 'Apple iPhone 12 Pro',
      price: 800,
      stock: 15,
      productId: 'AiP12P'
    },
    {
      type: 'computer',
      name: 'Apple MacBook Air M1',
      price: 1100,
      stock: 33,
      productId: 'AMBAM1'
    },
    {
      type: 'computer',
      name: 'Apple MacBook Pro M1',
      price: 2100,
      stock: 6,
      productId: 'AMBPM1'
    }
  ])

db.users.createIndex({ email: 1 }, { unique: true })
db.cart.createIndex({ userId: 1 }, { unique: true })
