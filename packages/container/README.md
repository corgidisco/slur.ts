# Graphity - Container

[![Downloads](https://img.shields.io/npm/dt/@graphity/container.svg)](https://npmcharts.com/compare/@graphity/container?minimal=true)
[![Version](https://img.shields.io/npm/v/@graphity/container.svg)](https://www.npmjs.com/package/@graphity/container)
[![License](https://img.shields.io/npm/l/@graphity/container.svg)](https://www.npmjs.com/package/@graphity/container)
![Typescript](https://img.shields.io/badge/language-Typescript-007acc.svg?style=flat-square)

Super slim DI(Depdency Injection) container with Async/Promise for Javascript(& Typescript).

## Installation

```bash
npm install @graphity/container --save
```

## Usage

```javascript
const { Container } = require("@graphity/container")
// or import { Container } from "@graphity/container"

const container = new Container()
```


### Bind simple value

```ts
container.instance("obj1", {message: "this is obj1"})
container.instance("obj2", {message: "this is obj2"})

console.log(await container.get("obj1")) // {message: "this is obj1"}
console.log(await container.get("obj2")) // {message: "this is obj2"}

console.log(await container.get("obj1") === await container.get("obj1")) // true
console.log(await container.get("obj2") === await container.get("obj2")) // true
```

### Bind promise value

```ts
function promise1() {
  return new Promise(resolve => resolve({message: "this is promise1"}))
}
async function promise2() {
  sleep(500)
  return {message: "this is promise2"}
}
container.instance("promise1", promise1())
container.instance("promise2", promise2())

console.log(await container.get("promise1")) // {message: "this is promise1"}
console.log(await container.get("promise2")) // {message: "this is promise2"}

console.log(await container.get("promise1") === await container.get("promise1")) // true
console.log(await container.get("promise2") === await container.get("promise2")) // true
```

### Bind resolver

```ts
container.resolver("resolver1", () => ({message: "this is resolver"}))
container.resolver("resolver2", () => {
  return new Promise(resolve => {
    resolve({message: "this is promise resolver"})
  })
})
container.resolver("resolver3", async () => {
  sleep(500)
  return {message: "this is async resolver"}
})

console.log(await container.get("resolver1")) // {message: "this is resolver"}
console.log(await container.get("resolver2")) // {message: "this is promise resolver"}
console.log(await container.get("resolver3")) // {message: "this is async resolver"}
```

### Bind class

```ts
import { Container, Inject } from "@graphity/container"

class Driver {
}

class Connection {
  public constructor(@Inject("driver") public driver: Driver) {
  }
}
container.bind("driver", Driver)
container.bind("connection", Connection)

const connection = await container.get<Connection>("connection")

console.log(connection) // Connection { driver: Driver {} }
console.log(connection.driver) // Driver {}
```

### Factory descriptor

Descriptor is very useful if you using factory or bind. this is example of factory.

```ts
container.resolver("resolver.normal", () => ({message: "this is resolver"}))
container.resolver("resolver.factory", () => ({message: "this is resolver with factory"})).factory()

container.bind("class.normal", Foo)
container.bind("class.factory", Foo).factory()

// always same
console.log(await container.get("resolver.normal") === await container.get("resolver.normal")) // true
console.log(await container.get("class.normal") === await container.get("class.normal")) // true

// not same
console.log(await container.get("resolver.factory") === await container.get("resolver.factory")) // false
console.log(await container.get("class.factory") === await container.get("class.factory")) // false
```

### create

```ts
import { Container, Inject } from "@graphity/container"

class Connection {
}

class Controller {
  public constructor(@Inject("connection") public connection: Connection) {
  }
}

container.bind("connection", Connection)

const controller = await container.create(Controller)

console.log(controller) // Controller { connection: Connection {} }
```

### invoke

```ts
import { Container, Inject } from "@graphity/container"

class Connection {
}

class Controller {
  public retrieve(@Inject("connection") connection: Connection) {
    return connection
  }
}

container.bind("connection", Connection)

const controller = new Controller()

console.log(await container.invoke(controller, "retrieve")) // Connection { }
```

### Service Provider

`providers/typeorm.ts`

```ts
import { Provider } from '@graphity/container'
import { Connection, createConnection } from 'typeorm'

export const typeorm: Provider = {
  register(app) {
    const DB_HOST = process.env.DB_HOST || 'localhost'
    const DB_DATABASE = process.env.DB_DATABASE || 'test'
    const DB_USERNAME = process.env.DB_USERNAME || 'root'
    const DB_PASSWORD = process.env.DB_PASSWORD || 'root'
    app.resolver(Connection, () => {
      return createConnection({
        type: 'mysql',
        host: DB_HOST,
        database: DB_DATABASE,
        username: DB_USERNAME,
        password: DB_PASSWORD,
        /* ... */
      })
    })
  },
  async close(app) {
    const connection = await app.get(Connection)
    await connection.close()
  },
}
```

`controllers/user-controller.ts`

```ts
import { Container, Inject } from "@graphity/container"
import { Connection, Repository } from 'typeorm'
import { User } from '../entities/user.ts'

export class UserController {
  public constructor(
    @Inject(Connection) public connection: Connection,
    @Inject(Connection, conn => conn.getRepository(User)) public repoUsers: Repository<User>,
  ) {
  }

  public users() {
    return this.repoUsers.find()
  }

  /* ... */
}
```

`entry.ts`

```ts
import { Container } from "@graphity/container"
import { typeorm } from './providers/typeorm'
import { UserController } from './controllers/user-controller'

const app = new Container()
app.register(typeorm)

await app.boot()

const userController = await app.create(UserController)
await userController.users() // call controller!

```

## License

MIT