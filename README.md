<p align="center">
  <img src="./logo.png" alt="graphity" width="400" />
</p>

<p align="center">GraphQL Typescript Framework</p>

<p align="center">
  <a href="https://travis-ci.org/corgidisco/graphity"><img alt="Build" src="https://img.shields.io/travis/corgidisco/graphity.svg" /></a>
  <a href="https://npmcharts.com/compare/graphity?minimal=true"><img alt="Downloads" src="https://img.shields.io/npm/dt/graphity.svg" /></a>
  <a href="https://www.npmjs.com/package/graphity"><img alt="Version" src="https://img.shields.io/npm/v/graphity.svg" /></a>
  <a href="https://www.npmjs.com/package/graphity"><img alt="License" src="https://img.shields.io/npm/l/graphity.svg" /></a>
  <br />
  <a href="https://david-dm.org/corgidisco/graphity"><img alt="dependencies Status" src="https://david-dm.org/corgidisco/graphity/status.svg" /></a>
  <a href="https://david-dm.org/corgidisco/graphity?type=dev"><img alt="devDependencies Status" src="https://david-dm.org/corgidisco/graphity/dev-status.svg" /></a>
  <br />
  <a href="https://www.npmjs.com/package/graphity"><img alt="NPM" src="https://nodei.co/npm/graphity.png" /></a>
</p>

## How to use

### Installation

```
npm i graphql graphity
npm i @types/graphql -D
```

### Typescript Confituration

set this option in `tsconfig.json` file of your project.

```json
{
  "experimentalDecorators": true
}
```

## Example

create entity file:

```ts
import { Field, GraphQLEntity } from "graphity"
import { GraphQLID, GraphQLString } from "graphql"


@GraphQLEntity()
export class Todo {
  @Field(type => GraphQLID)
  public id!: string

  @Field(type => GraphQLString)
  public contents!: string | null

  @Field(type => GraphQLBoolean)
  public isDone!: boolean
}
```

## License

MIT
