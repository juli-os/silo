[**@juli-os/silo**](../index.md)

***

[@juli-os/silo](../index.md) / ArtifactBackend

# Interface: ArtifactBackend

Defined in: [store.ts:10](https://github.com/juli-os/silo/blob/main/src/silo/store.ts#L10)

## Methods

### delete()

> **delete**(`key`): `Promise`\<`Result`\<`void`, `Error`\>\>

Defined in: [store.ts:13](https://github.com/juli-os/silo/blob/main/src/silo/store.ts#L13)

#### Parameters

##### key

`string`

#### Returns

`Promise`\<`Result`\<`void`, `Error`\>\>

***

### get()

> **get**(`key`): `Promise`\<`Result`\<`Buffer`\<`ArrayBufferLike`\>, `Error`\>\>

Defined in: [store.ts:12](https://github.com/juli-os/silo/blob/main/src/silo/store.ts#L12)

#### Parameters

##### key

`string`

#### Returns

`Promise`\<`Result`\<`Buffer`\<`ArrayBufferLike`\>, `Error`\>\>

***

### list()

> **list**(`prefix`): `Promise`\<readonly `string`[]\>

Defined in: [store.ts:14](https://github.com/juli-os/silo/blob/main/src/silo/store.ts#L14)

#### Parameters

##### prefix

`string`

#### Returns

`Promise`\<readonly `string`[]\>

***

### put()

> **put**(`key`, `bytes`): `Promise`\<`Result`\<`void`, `Error`\>\>

Defined in: [store.ts:11](https://github.com/juli-os/silo/blob/main/src/silo/store.ts#L11)

#### Parameters

##### key

`string`

##### bytes

`Buffer`

#### Returns

`Promise`\<`Result`\<`void`, `Error`\>\>

***

### url()

> **url**(`key`, `ttlSec?`): `Promise`\<`Result`\<`string`, `Error`\>\>

Defined in: [store.ts:16](https://github.com/juli-os/silo/blob/main/src/silo/store.ts#L16)

生成可访问 URL：disk = 本地 API 路径；S3 = presigned GET。

#### Parameters

##### key

`string`

##### ttlSec?

`number`

#### Returns

`Promise`\<`Result`\<`string`, `Error`\>\>
