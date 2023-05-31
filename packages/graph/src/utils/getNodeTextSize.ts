/**
 * 获取节点块文本的长度
 * @param value
 * @return 内容的长度
 */
export default function getNodeTextSize(value: string): number {
  if (!value) {
    return 0;
  }
  const charCount = value.split('').reduce((prev, curr) => {
    if (/[a-z]|[0-9]|[,;.!@#-+/\\$%^*()<>?:"'{}~]/i.test(curr)) {
      return prev + 0.6;
    }
    return prev + 1;
  }, 0);

  // 向上取整，防止出现半个字的情况
  return Math.ceil(charCount);
}
