// silo facade — 存储底座（@juli-os/silo）的唯一公开面。
// 基础件：存字节（disk/S3/双写）、按 key 取字节、签名链接、MIME 推导。
// 不含 juli 业务概念（登记归属/账本在 @juli-os/artifacts），谁都能用。
// 为什么独立成包（2026-11-12 第 6 步）：存储是纯能力，artifacts 是登记
// 归属——分层后 artifacts 内部改依赖 silo，对外面经 re-export 不变。
export {
  createDiskBackend, createS3Backend, createDualBackend,
  type ArtifactBackend, type S3Opts, assertSigV4PresignShape,
} from './silo/store.ts';
export { guessMime } from './silo/mime.ts';
