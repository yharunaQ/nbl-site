export type PublicVideo = {
  id: string;
  title: string;
  topic: string;
  summary: string;
  whyNow: string;
  href: string;
  thumbnailSrc: string;
};

export const publicVideosHero = {
  eyebrow: 'Selected public videos',
  headline: 'いま公開している動画を、入口として見やすく並べました。',
  subheadline:
    'YouTube の channel 導線に頼るのではなく、現在 public-safe に案内できる動画だけを選び、短い説明付きでまとめています。JAC の基礎説明や職場設計のページと行き来しながら見るための入口です。',
};

export const publicVideoScopeNotes = [
  '現在 public に出しやすい動画だけを選んでいます',
  '動画だけで結論を出すより、JAC や職場設計の説明ページと合わせて読む想定です',
  '追加で公開できる動画が増えたら、この一覧に順次足します',
];

export function getYouTubeThumbnailSrc(youtubeId: string) {
  return `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`;
}

export const publicVideos: PublicVideo[] = [
  {
    id: 'reasonable-accommodation',
    title: '合理的配慮2.0入門',
    topic: '合理的配慮 / 入門',
    summary:
      '合理的配慮を特別対応ではなく、仕事・情報・運用の設計として捉え直すための入門動画です。',
    whyNow:
      '記事やトップページから来た人が、NBL の考え方を最初に掴む動画として使いやすいためです。',
    href: 'https://youtu.be/mSyzmOVP_Ek',
    thumbnailSrc: getYouTubeThumbnailSrc('mSyzmOVP_Ek'),
  },
  {
    id: 'enterprise-guide',
    title: '企業のための実践ガイド',
    topic: '企業向け / 難病就労',
    summary:
      '難病のある方の雇用と活躍を、法的義務だけでなく企業の設計課題として整理する企業向け動画です。',
    whyNow:
      '企業担当者が、制度説明だけでなく職場設計の観点へ関心を広げやすい入口になるためです。',
    href: 'https://youtu.be/BbtZ8GqMMtU',
    thumbnailSrc: getYouTubeThumbnailSrc('BbtZ8GqMMtU'),
  },
  {
    id: 'quality-of-employment',
    title: '障害者雇用の「質」を問う',
    topic: '障害者雇用 / 質',
    summary:
      '雇用率だけでは見えにくい、継続就労、相談しやすさ、設計品質の論点を整理する動画です。',
    whyNow:
      'NBL が何を問題にしているのかを、短時間で掴みやすい問題提起になっているためです。',
    href: 'https://youtu.be/0aUjkKUrIP4',
    thumbnailSrc: getYouTubeThumbnailSrc('0aUjkKUrIP4'),
  },
  {
    id: 'whole-map',
    title: '難病就労連携「全体マップ」活用セミナー',
    topic: '方法論 / 全体マップ',
    summary:
      '難病就労連携の全体像をどう見るかを、導入編として掴みやすくしたセミナー動画です。',
    whyNow:
      'JAC や関連図解を読む前後で、NBL の方法論がどこを見ようとしているかを掴みやすいためです。',
    href: 'https://youtu.be/dgO_MYf2T8A',
    thumbnailSrc: getYouTubeThumbnailSrc('dgO_MYf2T8A'),
  },
];
