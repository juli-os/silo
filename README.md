# @juli-os/silo

juli-os 基础件：存字节的底座（零 npm 依赖）。

silo 只装通用能力：disk / S3 / 双写后端、按 key 取字节、S3 预签链接（SigV4 手签 + OSS V1）、MIME 按文件名推导。不含 juli 业务概念（登记归属与账本在 [@juli-os/artifacts](https://github.com/juli-os/artifacts)，它内部依赖本包并对外 re-export 保持接口不变）。

## 为什么需要它

存储是纯能力，登记是业务。分家后（2026-11-12 架构调整第 6 步）：
- silo 谁都能用（只想存字节的人不必拖进登记语义）；
- artifacts 专注登记归属（ArtifactLedger / sweepCaseInbox / parseEnvelope）。

## 用法

```ts
import { createDiskBackend, createS3Backend, createDualBackend, guessMime } from '@juli-os/silo';

const disk = createDiskBackend('/data/store');          // 本地磁盘（防路径穿越）
const s3 = createS3Backend({ endpoint, region, bucket, accessKeyId, secretAccessKey });
const dual = createDualBackend(disk, s3);               // disk 兜底 + 远端尽力

await dual.put('a/b.txt', Buffer.from('hello'));
const got = await dual.get('a/b.txt');                  // Result<Buffer>
const url = await s3.url('a/b.txt', 3600);              // 预签链接（Result<string>）
```

后端接口返回 `Result`——错误是值不是异常，端口边界的调用方自己决定降级。

## CLI

```
silo put --backend=disk --root=DIR --key=a/b.txt --data=hello   # 存（回环）
silo get --backend=disk --root=DIR --key=a/b.txt                # 取（回环）
silo sign --endpoint=URL --key-id=AK --secret=SK --bucket=B --key=K  # S3 签名链接
```

一条命令一个动作，全部调用包自己的导出函数。

## 文档

本仓文档被动生成：`npm run docs:gen`（README 镜像 + 架构图 + typedoc API），CI 校验生成物不漂移。

License: Apache-2.0
