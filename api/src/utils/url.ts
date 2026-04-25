const normalizeUrl = (url: string) => {
  if (!/^https?:\/\//.test(url)) return `https://${url}`;
  return url;
};

export { normalizeUrl };
