export default function ensureHTTPS(url: string): string {
  if (!url) {
    return '';
  }
  if (!/^https?:\/\//i.test(url)) {
    if (url.startsWith('//')) {
      url = 'https:' + url;
    } else {
      url = 'https://' + url;
    }
  } else if (/^http:\/\//i.test(url)) {
    url = url.replace(/^http:/i, 'https:');
  }
  return url;
}
