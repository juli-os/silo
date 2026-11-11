#!/usr/bin/env node
// silo — 存储底座 CLI，一条命令一个动作，全部调用包自己的导出函数。
// Usage:
//   silo put --backend=disk --root=DIR --key=a/b.txt --data=hello   存字节（回环）
//   silo get --backend=disk --root=DIR --key=a/b.txt                取字节（回环）
//   silo sign --endpoint=URL --key-id=AK --secret=SK --bucket=B --key=K  S3 签名链接
import { createDiskBackend, createS3Backend } from '../src/index.ts';

const args = process.argv.slice(2);
const cmd = args[0];
const flag = (name: string): string | undefined => {
  const eq = `--${name}=`;
  const hit = args.find((a) => a.startsWith(eq));
  return hit ? hit.slice(eq.length) : undefined;
};

const usage = (): never => {
  console.error('用法: silo put|get --backend=disk --root=DIR --key=K [--data=文本] | silo sign --endpoint= --key-id= --secret= --bucket= [--region=us-east-1] --key=');
  process.exit(2);
};

if (cmd !== 'put' && cmd !== 'get' && cmd !== 'sign') usage();

if (cmd === 'sign') {
  const endpoint = flag('endpoint') ?? usage();
  const keyId = flag('key-id') ?? usage();
  const secret = flag('secret') ?? usage();
  const bucket = flag('bucket') ?? usage();
  const key = flag('key') ?? usage();
  const backend = createS3Backend({ endpoint, region: flag('region') ?? 'us-east-1', accessKeyId: keyId, secretAccessKey: secret, bucket });
  void backend.url(key, 3600).then((r) => {
    if (!r.ok) { console.error('sign 失败:', r.error.message); process.exit(1); }
    console.log(r.value);
  });
} else {
  const root = flag('root') ?? usage();
  const key = flag('key') ?? usage();
  const backend = createDiskBackend(root);
  if (cmd === 'put') {
    const data = flag('data') ?? '';
    void backend.put(key, Buffer.from(data, 'utf8')).then((r) => {
      if (!r.ok) { console.error('put 失败:', r.error.message); process.exit(1); }
      console.log(`silo put: ${key}（${data.length} 字节）→ ${root}`);
    });
  } else {
    void backend.get(key).then((r) => {
      if (!r.ok) { console.error('get 失败:', r.error.message); process.exit(1); }
      console.log(`silo get: ${key} → ${r.value.toString('utf8')}`);
    });
  }
}
