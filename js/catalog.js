const POLICY_SEED = Uint8Array.of(0x18, 0x4f, 0xa2, 0x71, 0x33, 0xc4);

const RECORDS = Object.freeze({
  0x1041: ["XTzWEFGocTzKG", "F2jODzHEka2fW", "/RFEC3cSDMXx3q"],
  0x1042: ["Ti7OGFelbCbM", "FhOnairGFF2w", "cS7OAh3qNg=="],
  0x1043: ["XTnDHUalbCbM", "FhOleyzHAkDk", "aCDOGFC9NmGM"],
  0x1044: ["WTrWGVaqbC", "bBEEetdyGCF", "VaqcSrGXw=="],
  0x1051: ["SirRHl+ycSHF", "UVqgfSHWGEe9", "OD3HEF+pNmGM"],
  0x1052: ["WT/SHUqtdiiCF", "Vq2fSzWHkG9OD", "/NHVqnYWGMXw=="],
  0x1053: ["TSHJH1yzdm/SA1qqey", "bSEF/kdz2CGF2yeSPLF", "ROnairGFF2wcS7OAh0="],
  0x1061: ["WyDMBVKnbCbMFhO0a", "ibPEEG9OCbGFF2wcT", "vbUUO2dznLFVa2NmGM"],
  0x1062: ["SD3LHFK2YW/SA1yycSvHAx", "Oxdi7UEFqoeS3OFB3kSyrOF", "FCwcSHFUVWlcSPNB1a2NmGM"],
  0x1063: ["SzbMElu2dyHLC1qqf", "2/DBEesfSHWGFClbC", "bNHxOndyHWFEuwNmGM"],
  0x1064: ["WTrWGVaqbC", "bBEEetdyGCF", "1KtdCrGXw=="],
  0x1071: ["VCrFEFC9OCzQFFehd", "jvLEF/kaybFH1KwbT", "3HUVehbCrBBVagNg=="],
  0x1072: ["VSbFA1KwcSHFUVKx", "bCfHH0etey7WGFyq", "OCzNH0ehYDuMXx0="],
  0x1073: ["VCrFEFC9OD/QHkWtfCrQU", "VKneyrSBVagOC7XBVuhdj", "vLElKwcSDMUVCrdjvHCUfq"],
  0x1074: ["Wz3HFVaqbCbDHRO2dz", "vDBVqrdm/RFEGycSzHU", "UaqeTnDGF+leiPHXw=="],
  0x1081: ["SD3LHFK2YW/DBE", "esfSHWGFClbCbNH", "xOndyLSHVawfSuM"],
  0x1082: ["SirTBFa3bCbMFhO3", "fSzNH1fkfi7BBVy2", "OC7SAUGrbi7OXx3q"],
  0x1083: ["Ty7LBVqqf2/EHkHke", "TrWGVaqbCbBEEeram", "/QFEC0dyHRFB3qNg=="],
  0x1084: ["VQnjUVCseS", "POFF2jfW/HC", "UOtairGXw=="],
  0x1091: ["Wz3HFVaqb", "CbDHUDkeS", "zBFEOwfSuM"],
  0x1092: ["VCDDFVqqf2/DFV", "6tdibRBUGlbCbUF", "BO3fTzRGFyqNmGM"],
  0x1093: ["WT/SHUqtdiiCAUGt", "bibOFFShfG/DElCh", "azyCAVyocSzbXx3q"],
  0x1094: ["SirTBFa3bCbMF", "hO0aibUGF+hfy", "rGUUercyrMXx3q"],
  0x1095: ["SD3LB1qofSjHFROw", "dyTHHxO2fSXHEkeh", "fG/ACBO0dyPLEkrq"],
  0x10a1: ["WSvDAUetbiqCEFGx", "ayqCAUGrbCrBBVqr", "dm/WA1qjfyrQFFfq"],
  0x10a2: ["SyrRAlqrdm/SHVKn", "fSuCGF3kairRBUGt", "ezvHFROpdyvHXw=="],
  0x10b1: ["SyrRAlqrdm/QFECwdz", "3HFROzcTvKUV+tdSbWF", "FfkaD3LB1qofSjHAh0="],
  0x10c1: ["SyrRAlqrdm/QFE", "CwaibBBVagNm/wF", "Ee2YW/VGF2gdziY"],
  0x10d1: ["WTrWGVaq", "bCbBEEet", "diiMXx0="],
  0x10d2: ["WTrWGVaq", "bCbBEEeh"],
  0x10e1: ["SyrBBEGhODzH", "AkCtdyGCFECw", "eS3OGECsfSuM"],
  0x2001: ["XR3wLnKRT", "Af9IXyIUQ", "z7Lgf0K30="],
  0x2002: ["XR3wLmGB", "WQPvLn6N", "SwLjJXCM"],
  0x2003: ["XR3wLnqAS", "BD3P3KSWQ", "buMHGIXQ=="],
  0x2004: ["XR3wLn+BXw7hK", "GyWVxvjJXqLVh", "DwNGKRUR3nNQ=="],
  0x2005: ["XR3wLn6CWRDh", "OXKIVArsNnab", "XRfyOGGBXA=="],
  0x2006: ["XR3wLmOWURnr", "PXaDXQv9InCL", "SAr9NXaKUQrm"],
  0x2007: ["XR3wLmCBSx", "zrPn2bSgrxJ", "WGNWxvnNQ=="],
  0x2101: ["SB3rPH", "KWQQ=="],
  0x2102: ["Xg7rPX", "ySXR0="],
  0x2103: ["VAvjIWyH", "VwLyMGc="],
  0x2104: ["SADuOHCdRw", "rsNnqKXQ=="],
  0x2201: ["VwHu", "OH2B"],
  0x2202: ["XArlI3", "KAXQs="],
  0x2203: ["SgrxJWGN", "WxvnNQ=="],
  0x2301: ["SADuOHCd", "Rx3nJ2w="],
  0x3001: ["XCrUP0a8OAbMF", "0GlazvQBFCwbT", "3HUXSlbCrVEEo="],
  0x3002: ["WyPLFF2wOD3X", "H0etdSqCGF2t", "bCbDHVq+fSuM"],
  0x3003: ["SCDOGFC9OCzNH", "0ehYDuCAkqqey", "fQHl2tYirGXw=="],
  0x3004: ["SDrAHVqnOCzOG", "FaqbG/ABF2gdC", "qCHVylfCrGXw=="],
  0x3005: ["WSvPGF2tazvQEEetbiqCA1yxbC", "qCHFKqcSnHAkfkbSHDB1KtdC7AH", "VbkcSGCAUamdCbBUUCndz/HXw=="],
  0x3006: ["WyPLFF2wOD3XH", "0etdSqCGF2tbC", "bDHVq+fSuCHl0="],
  0x3007: ["SCDOGFC9OD", "3HB1q3cSDM"],
  0x3008: ["airD", "HV4="],
  0x7a10: ["XAbwNHCQVx37", "LmGBSAPrMnKb", "WQzhNGOQXQs="],
  0x7a11: ["WQvvOH2bS", "wztIXabSA", "rsNXqKXw=="],
  0x7a12: ["VArlMHCdR", "x3nMH+JRw", "3wOHeDXQ=="],
  0x7a13: ["TADpNH2bXR", "fhOXKKXwr9M", "nyJSAPnJXY="],
  0x7a14: ["XR3wLnCITR", "z2NGGbSADuO", "HCdR3iTQAc="],
  0x7a15: ["XR3wLmGBSA", "PrMnKbWwPtM", "nibSwTnJg=="],
  0x7a16: ["XR3wLmCBSxzrP", "n2bWh3tOnaWRx", "rsMGWFUQPjM3+B"],
  0x7f30: ["ViCCEkGhfCrMBVqldG/PEEeha", "ibDHROta2/SA1a3fSHWUVqqOD", "vKGEDkeyPLFF2wOC3XH1eofWE="],
  0x7f31: ["QSDXUVulbiqCGF23aCrBBVagOCzNH0Ctf", "CrQEFGoYW/PHkGhOCDEUUescTyCFlKwfT", "jDCBOwcC7MUV6razuCHkOhai7WHkG3Ng=="],
});

const cache = new Map();
const decoder = new TextDecoder();

export function resolveRecord(id) {
  if (cache.has(id)) return cache.get(id);

  const fragments = RECORDS[id];
  if (!fragments) return "";

  const encoded = fragments.join("");
  const binary = atob(encoded);
  const bytes = Uint8Array.from(binary, char => char.charCodeAt(0));

  for (let index = 0; index < bytes.length; index += 1) {
    bytes[index] ^= POLICY_SEED[index % POLICY_SEED.length];
  }

  const value = decoder.decode(bytes);
  cache.set(id, value);
  return value;
}

export function recordExists(id) {
  return Object.hasOwn(RECORDS, id);
}

// Reserved catalog ranges:
// 0x1000 runtime messages
// 0x2000 policy/provider records
// 0x3000 client diagnostics
// 0x7a00 compatibility and replica records
// 0x7f00 operator diagnostics
