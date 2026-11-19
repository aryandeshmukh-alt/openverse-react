import { useState, useCallback, useEffect } from 'react';

const copyToClipboard = (str) => {
  const el = document.createElement('textarea');
  el.value = str;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);

  const selection = document.getSelection();
  const selected = selection.rangeCount > 0 ? selection.getRangeAt(0) : false;

  el.select();
  let success = false;
  try {
    success = document.execCommand('copy');
  } catch {
    success = false;
  }
  document.body.removeChild(el);

  if (selected) {
    selection.removeAllRanges();
    selection.addRange(selected);
  }
  return success;
};

export function useCopyToClipboard(text) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(() => {
    setCopied(copyToClipboard(text));
  }, [text]);

  useEffect(() => () => setCopied(false), [text]);

  return [copied, copy];
}
