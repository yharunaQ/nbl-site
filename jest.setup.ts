import '@testing-library/jest-dom';
import React from 'react';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    const { alt, fill, loader, placeholder, blurDataURL, quality, priority, ...rest } = props;
    return React.createElement('img', {
      ...rest,
      alt: typeof alt === 'string' ? alt : '',
    });
  },
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: function MockLink(props: {
    href: string;
    children: React.ReactNode;
    [key: string]: unknown;
  }) {
    const { children, href, ...rest } = props;
    return React.createElement('a', { href, ...rest }, children);
  },
}));

jest.mock('next/font/google', () => ({
  Noto_Sans_JP: () => ({
    className: 'mocked-noto-sans-jp',
  }),
}));
