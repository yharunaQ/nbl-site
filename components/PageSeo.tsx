import Head from 'next/head';
import {
  buildSiteUrl,
  DEFAULT_SOCIAL_IMAGE_ALT,
  DEFAULT_SOCIAL_IMAGE_HEIGHT,
  DEFAULT_SOCIAL_IMAGE_PATH,
  DEFAULT_SOCIAL_IMAGE_WIDTH,
  SITE_LOCALE,
  SITE_NAME,
} from '@/lib/siteMetadata';

type PageSeoProps = {
  title: string;
  description: string;
  path?: string;
  imagePath?: string;
  imageAlt?: string;
  noIndex?: boolean;
  type?: 'website' | 'article';
};

export default function PageSeo({
  title,
  description,
  path = '/',
  imagePath = DEFAULT_SOCIAL_IMAGE_PATH,
  imageAlt = DEFAULT_SOCIAL_IMAGE_ALT,
  noIndex = false,
  type = 'website',
}: PageSeoProps) {
  const canonicalUrl = buildSiteUrl(path);
  const socialImageUrl = buildSiteUrl(imagePath);

  return (
    <Head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>{title}</title>
      <meta name="description" content={description} key="description" />
      <meta name="robots" content={noIndex ? 'noindex,nofollow' : 'index,follow'} key="robots" />
      <link rel="canonical" href={canonicalUrl} key="canonical" />
      <meta property="og:site_name" content={SITE_NAME} key="og:site_name" />
      <meta property="og:locale" content={SITE_LOCALE} key="og:locale" />
      <meta property="og:type" content={type} key="og:type" />
      <meta property="og:url" content={canonicalUrl} key="og:url" />
      <meta property="og:title" content={title} key="og:title" />
      <meta property="og:description" content={description} key="og:description" />
      <meta property="og:image" content={socialImageUrl} key="og:image" />
      <meta
        property="og:image:width"
        content={String(DEFAULT_SOCIAL_IMAGE_WIDTH)}
        key="og:image:width"
      />
      <meta
        property="og:image:height"
        content={String(DEFAULT_SOCIAL_IMAGE_HEIGHT)}
        key="og:image:height"
      />
      <meta property="og:image:alt" content={imageAlt} key="og:image:alt" />
      <meta name="twitter:card" content="summary_large_image" key="twitter:card" />
      <meta name="twitter:title" content={title} key="twitter:title" />
      <meta name="twitter:description" content={description} key="twitter:description" />
      <meta name="twitter:image" content={socialImageUrl} key="twitter:image" />
      <meta name="twitter:image:alt" content={imageAlt} key="twitter:image:alt" />
      <meta name="theme-color" content="#0f172a" key="theme-color" />
      <meta name="format-detection" content="telephone=no" key="format-detection" />
    </Head>
  );
}
