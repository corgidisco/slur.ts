import { ApolloServer } from 'apollo-server-express'
import express, { Express } from 'express'
import { applyHttpContext, applyWsContextOnConnect, Graphity, PubSub } from 'graphity'
import { subscribe, execute } from 'graphql'
import { PubSub as ApolloPubSub } from 'graphql-subscriptions'
import { createServer, Server } from 'http'
import portfinder from 'portfinder'

import { reqToHttpRequest } from './req-to-http-request'

export interface ServerExpressOptions {
  express?: Express
  pubsub?: PubSub
}

export class ServerExpress {

  server: Express
  pubsub: PubSub

  constructor(
    public graphity: Graphity,
    public options: ServerExpressOptions = {}
  ) {
    this.server = options.express ?? express()
    this.pubsub = options.pubsub ?? new ApolloPubSub()
  }

  async start(port = 8000, host?: string): Promise<{ apollo: ApolloServer, host: string, port: number }> {
    return Promise.all([
      portfinder.getPortPromise({ port, host }),
      this.graphity.boot(),
    ]).then(([startPort]) => {
      const schema = this.graphity.createSchema()
      const apollo = new ApolloServer({
        schema,
        context: (context) => applyHttpContext(this.graphity, reqToHttpRequest(context.req), this.pubsub),
      })
      apollo.applyMiddleware({ app: this.server })

      let serverPromise: Promise<Express | Server> = Promise.resolve(this.server)
      if (schema.getSubscriptionType()) {
        serverPromise = import('subscriptions-transport-ws').then(({ SubscriptionServer }) => {
          const server = createServer(this.server)
          SubscriptionServer.create({
            schema,
            subscribe,
            execute,
            onConnect: (params: any) => {
              const accessToken = params.authToken // https://www.apollographql.com/docs/graphql-subscriptions/authentication/
                // https://github.com/apollographql/subscriptions-transport-ws/issues/171#issuecomment-316376468
                || params.Authorization
                || params.authorization
                // https://github.com/apollographql/subscriptions-transport-ws/issues/171#issuecomment-358306164
                || params.headers.Authorization
                || params.headers.authorization

              return applyWsContextOnConnect(this.graphity, accessToken, this.pubsub)
            },
          }, {
            server,
            path: '/graphql',
          })
          return server
        })
      }

      return serverPromise.then((server) => new Promise((resolve) => server.listen(startPort, () => {
        console.log(`🚀 Start Graphity on ${host ?? 'localhost'}:${startPort}`)
        resolve({
          apollo,
          host: host ?? 'localhost',
          port: startPort,
        })
      })))
    })
  }
}
