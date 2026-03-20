export type PartnerDossierHero = {
  eyebrow: string;
  headline: string;
  subheadline: string;
};

export type PartnerDossierAsset = {
  title: string;
  summary: string;
};

export type PartnerDossierRule = {
  title: string;
  summary: string;
};

export const partnerDossierHero: PartnerDossierHero = {
  eyebrow: 'Partner Dossier Kit',
  headline: 'live 候補は 1 枚 dossier で持ち、3-4 conversation ごとに founder-readable な round readout に閉じる。',
  subheadline:
    '実名候補が入り始めると、チャット断片や scattered notes が founder の負荷になりやすい。候補ごとの dossier と round ごとの readout を固定して、判断の読み筋をそろえる。',
};

export const partnerDossierAssets: PartnerDossierAsset[] = [
  {
    title: 'Candidate Dossier Template',
    summary: '候補ごとの基本情報、fit hypothesis、knockout scan、latest memo、score snapshot、next action を 1 枚に集約する。',
  },
  {
    title: 'Round Readout Template',
    summary: '3-4 conversation をまとめて、learned / broke / ranking / founder input を 1 枚で返す。',
  },
  {
    title: 'Advancement Memo Template',
    summary: 'advance 候補を次段階へ進める理由、残リスク、必要な founder move を短くまとめる。',
  },
];

export const partnerDossierRules: PartnerDossierRule[] = [
  {
    title: 'One Candidate, One Dossier',
    summary: 'live candidate ごとに 1 枚だけを正本にし、判断を複数のメモへ分散させない。',
  },
  {
    title: 'Separate Fact, Inference, Decision',
    summary: 'confirmed facts と推論と provisional decision を分けることで、印象の混線を防ぐ。',
  },
  {
    title: 'Gate Over Vibe',
    summary: 'boundary readiness と low automation pressure を、感じの良さや total score より優先して残す。',
  },
  {
    title: 'Close Every Round',
    summary: '3-4 conversation を終えたら必ず round readout を作り、founder が current state を 1 枚で追えるようにする。',
  },
];
