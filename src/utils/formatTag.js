function formatTagName(tag) {
  if (tag === 'dp') return 'DP';
  if (tag === 'dsu') return 'DSU';
  if (tag === 'fft') return 'FFT';
  if (tag === '2-sat') return '2-SAT';
  return tag.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

module.exports = { formatTagName };
