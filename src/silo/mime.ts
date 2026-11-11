// MIME 按文件名推导（单一事实源）：账本登记与字节侧 PUT 的 Content-Type
// 共用（原住 @juli-os/artifacts ledger.ts，2026-11-12 第 6 步随存储底座
// 平移进 silo——artifacts 对外面经 re-export 保持不变）。
export const guessMime = (name: string): string => {
  const ext = name.split('.').pop()?.toLowerCase() ?? '';
  const map: Record<string, string> = {
    html: 'text/html', htm: 'text/html', svg: 'image/svg+xml',
    png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', gif: 'image/gif',
    webp: 'image/webp', mp4: 'video/mp4', mov: 'video/quicktime', pdf: 'application/pdf',
    json: 'application/json', txt: 'text/plain', md: 'text/markdown', csv: 'text/csv',
    // Office 家族：iOS QuickLook 按 MIME 判预览，缺了就是「octet-stream 暂不支持」
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    ppt: 'application/vnd.ms-powerpoint',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    doc: 'application/msword',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    xls: 'application/vnd.ms-excel',
  };
  return map[ext] ?? 'application/octet-stream';
};
