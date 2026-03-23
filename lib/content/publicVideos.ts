export type PublicVideo = {
  id: string;
  title: string;
  topic: string;
  summary: string;
  whyNow: string;
  href: string;
  thumbnailSrc: string;
  relatedResource: {
    href: string;
    label: string;
  };
};

export const publicVideosHero = {
  eyebrow: 'Selected public videos',
  headline: 'いま公開している動画を、入口として見やすく並べました。',
  subheadline:
    'YouTube の channel 導線に頼るのではなく、現在 public-safe に案内できる動画だけを選び、短い説明付きでまとめています。仕事設計の見取り図や職場設計のページと行き来しながら見るための入口です。',
};

export const publicVideoScopeNotes = [
  '現在 public に出しやすい動画だけを選んでいます',
  '動画だけで結論を出すより、仕事設計の見取り図や職場設計の説明ページと合わせて読む想定です',
  '追加で公開できる動画が増えたら、この一覧に順次足します',
];

export function getYouTubeThumbnailSrc(youtubeId: string) {
  return `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`;
}

export const publicVideos: PublicVideo[] = [
  {
    id: 'ability-meritocracy-traps',
    title: '障害者雇用の「能力主義」に潜む3つの罠',
    topic: '企業・支援・行政 / 啓発',
    summary:
      '人数合わせや即戦力視点に偏ると、雇用の設計そのものが歪みやすいことを、能力主義批判の観点から整理する動画です。',
    whyNow:
      '障害者雇用の質や正常化の図解に入る前に、何が問題設定としてずれているのかを短時間で共有しやすいためです。',
    href: 'https://youtu.be/-6PJlEa9DeQ',
    thumbnailSrc: getYouTubeThumbnailSrc('-6PJlEa9DeQ'),
    relatedResource: {
      href: '/resources/work-support-transformation',
      label: '就労支援設計の変革テーマ群を見る',
    },
  },
  {
    id: 'accommodation-fatigue-myths',
    title: '「配慮疲れ」を終わらせる3つの神話とシステム転換',
    topic: '企業・支援・行政 / 啓発',
    summary:
      '配慮を現場の善意や負担感の問題として扱うのではなく、運用設計とシステム転換の問題として読み替える動画です。',
    whyNow:
      '合理的配慮や企業向け実践ガイドを、単発配慮ではなく仕組みの話として見てもらう補助線になりやすいためです。',
    href: 'https://youtu.be/muwEfKS420U',
    thumbnailSrc: getYouTubeThumbnailSrc('muwEfKS420U'),
    relatedResource: {
      href: '/resources/work-support-transformation',
      label: '就労支援設計の変革テーマ群を見る',
    },
  },
  {
    id: 'quota-debate',
    title: '障害者雇用の「枠」は撤廃すべきか？',
    topic: '制度・支援 / 啓発',
    summary:
      '中途障害の現実や DEI の逆説も踏まえながら、障害者雇用の枠組みをどう捉え直すべきかを対論形式で考える動画です。',
    whyNow:
      '制度批評だけで終わらず、企業・制度・専門支援のねじれを同じ地図で読む必要があることを共有しやすいためです。',
    href: 'https://youtu.be/sQ0zoIZaO4w',
    thumbnailSrc: getYouTubeThumbnailSrc('sQ0zoIZaO4w'),
    relatedResource: {
      href: '/resources/work-support-transformation',
      label: '就労支援設計の変革テーマ群を見る',
    },
  },
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
    relatedResource: {
      href: '/for-enterprise',
      label: '企業・組織向けの整理を見る',
    },
  },
  {
    id: 'interaction-model',
    title: '「障害等級＝仕事能力」は誤解',
    topic: '障害モデル / 入門',
    summary:
      '障害等級や診断ラベルだけで仕事能力を決めつけず、人・仕事・環境の相互作用で読む前提を共有する入門動画です。',
    whyNow:
      '仕事設計の見取り図や condition map に入る前に、NBL の見立ての前提を短く共有しやすいためです。',
    href: 'https://youtu.be/Q5h5aIrYb2I',
    thumbnailSrc: getYouTubeThumbnailSrc('Q5h5aIrYb2I'),
    relatedResource: {
      href: '/jac-foundations',
      label: '仕事設計の見取り図を見る',
    },
  },
  {
    id: 'management-guide',
    title: '難病・慢性疾患のある社員を支えるマネジメント実践ガイド',
    topic: '企業向け / マネジメント',
    summary:
      'どこまで配慮すればよいか迷いやすい場面を、難病・慢性疾患のある社員を支える日常マネジメントの観点から整理する動画です。',
    whyNow:
      '企業向けページや Resources から入った人が、配慮を実務判断へ落とす入口として使いやすいためです。',
    href: 'https://youtu.be/Ef9Bu1rXtKQ',
    thumbnailSrc: getYouTubeThumbnailSrc('Ef9Bu1rXtKQ'),
    relatedResource: {
      href: '/resources/work-support-transformation',
      label: '就労支援設計の変革テーマ群を見る',
    },
  },
  {
    id: 'quality-of-employment',
    title: '障害者雇用の「質」を問う',
    topic: '障害者雇用 / 質',
    summary:
      '雇用率だけでは見えにくい、継続就労、相談しやすさ、設計品質の論点を整理する動画です。日本企業向けには、まず「障害者雇用の正常化」の図解と合わせて入ると理解しやすい内容です。',
    whyNow:
      'NBL が何を問題にしているのかを、短時間で掴みやすい問題提起になっているためです。単独で前に出すより、正常化の図解を入口にした方が現場に伝わりやすいと判断しています。',
    href: 'https://youtu.be/0aUjkKUrIP4',
    thumbnailSrc: getYouTubeThumbnailSrc('0aUjkKUrIP4'),
    relatedResource: {
      href: '/resources/work-support-transformation',
      label: '就労支援設計の変革テーマ群を見る',
    },
  },
  {
    id: 'whole-map',
    title: '難病就労連携「全体マップ」活用セミナー',
    topic: '支援連携 / 全体マップ',
    summary:
      '難病就労連携の全体像をどう見るかを、支援者、行政、企業の連携導入編として掴みやすくしたセミナー動画です。',
    whyNow:
      '仕事設計の見取り図や関連図解を読む前後で、NBL の方法論が企業だけでなく支援連携全体の設計を見ていることを掴みやすいためです。',
    href: 'https://youtu.be/dgO_MYf2T8A',
    thumbnailSrc: getYouTubeThumbnailSrc('dgO_MYf2T8A'),
    relatedResource: {
      href: '/resources/work-support-transformation',
      label: '就労支援設計の変革テーマ群を見る',
    },
  },
];
