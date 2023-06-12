const nfc_secret = [
  0x03, 0x9c, 0x25, 0x6f, 0xb9, 0x2e, 0xe8, 0x08, 0x09, 0x83, 0xd9, 0x33, 0x56,
];
const iv = [0x80, 0x77, 0x51];
const JOOKI_UID_LEN = 7;
const JOOKI_PLAIN_LEN = 12;

export const names = {
  1: '狐狸 Fox',
  2: '鬼 Ghost',
  3: '骑士 Knight',
  4: 'ThankYou',
  5: '鲸 Whale',
  6: 'Black.Dragon',
  7: 'Black.Fox',
  8: 'Black.Knight',
  9: 'Black.Whale',
  10: 'White.Dragon',
  11: 'White.Fox',
  12: 'White.Knight',
  13: 'White.Whale',
};

export const colors = {
  16: 'G2.Orange',
  17: 'G2.DarkBlue',
  18: 'G2.Turquoise',
  19: 'G2.Yellow',
  20: 'G2.Red',
  21: 'G2.Purple',
  22: 'G2.Green',
  23: 'G2.Pink',
};

function parseStringToHex(s: string): number[] {
  const res: number[] = [];
  if (s.indexOf(':') > -1) {
    const parts = s.split(':');
    for (const part of parts) {
      res.push(parseInt(part, 16));
    }
  } else {
    for (let i = 0; i < JOOKI_UID_LEN; i++) {
      res.push(parseInt(s.substring(i * 2, (i + 1) * 2), 16));
    }
  }
  return res;
}

function getUrlParam(tid: number, fid: number, uid: number[]) {
  const d = [
    iv[0],
    iv[1],
    iv[2],
    tid,
    fid,
    uid[0],
    uid[1],
    uid[2],
    uid[3],
    uid[4],
    uid[5],
    uid[6],
  ];
  const enc: number[] = [];
  for (let i = 0; i < JOOKI_PLAIN_LEN; i++) {
    if (i < 3) {
      enc[i] = d[i] ^ nfc_secret[i];
    } else {
      enc[i] = d[i] ^ nfc_secret[i] ^ d[i % 3];
    }
  }
  const p = btoa(enc.map((n) => String.fromCodePoint(n)).join(''));
  return p;
}

export async function createUrl(fid: number, serial: string): Promise<string> {
  const tid = fid < 16 ? 1 : 2;
  const clipTextMatches =
    /[0-9a-fA-F]{2}(:[0-9a-fA-F]{2})+/.test(serial) ||
    /[0-9a-fA-F]{14}/.test(serial);
  //const serial = "04002B4A6B1191";
  //const uid = [0x04, 0xFA, 0x2B, 0x4A, 0x6B, 0x11, 0x90];
  const uid = parseStringToHex(serial);
  const baseUrl = 'https://s.jooki.rocks/s/?s=';
  const p = getUrlParam(tid, fid, uid);
  const url = baseUrl + p;
  return url;
}
