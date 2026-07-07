import { act, render } from '@testing-library/react';
import type { AppProps } from 'next/app';
import MyApp from '@/pages/_app';

const mockRouterEvents = {
  on: jest.fn(),
  off: jest.fn(),
};

jest.mock('next/router', () => ({
  useRouter: () => ({
    events: mockRouterEvents,
  }),
}));

function TestPage() {
  return <div>route scroll test page</div>;
}

function renderApp() {
  return render(
    <MyApp Component={TestPage} pageProps={{}} router={{} as AppProps['router']} />,
  );
}

function getRouteChangeCompleteHandler() {
  const routeChangeCompleteCall = mockRouterEvents.on.mock.calls.find(
    ([eventName]) => eventName === 'routeChangeComplete',
  );

  expect(routeChangeCompleteCall).toBeTruthy();

  return routeChangeCompleteCall?.[1] as (url: string) => void;
}

describe('route scroll restoration', () => {
  beforeEach(() => {
    mockRouterEvents.on.mockClear();
    mockRouterEvents.off.mockClear();

    Object.defineProperty(window.history, 'scrollRestoration', {
      configurable: true,
      value: 'auto',
      writable: true,
    });
    Object.defineProperty(window, 'scrollTo', {
      configurable: true,
      value: jest.fn(),
      writable: true,
    });
    Object.defineProperty(window, 'requestAnimationFrame', {
      configurable: true,
      value: jest.fn((callback: FrameRequestCallback) => {
        callback(0);
        return 1;
      }),
      writable: true,
    });
    Object.defineProperty(HTMLMediaElement.prototype, 'pause', {
      configurable: true,
      value: jest.fn(),
      writable: true,
    });

    document.documentElement.scrollTop = 0;
    document.documentElement.scrollLeft = 0;
    document.body.scrollTop = 0;
    document.body.scrollLeft = 0;
  });

  it('resets both window and body scroll roots after a normal page transition', () => {
    renderApp();

    document.documentElement.scrollTop = 320;
    document.documentElement.scrollLeft = 24;
    document.body.scrollTop = 860;
    document.body.scrollLeft = 12;

    act(() => {
      getRouteChangeCompleteHandler()(
        '/toolkit-studio/virtual-news/no-handbook-rare-disease-work-difficulty',
      );
    });

    expect(window.history.scrollRestoration).toBe('manual');
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, left: 0, behavior: 'auto' });
    expect(document.documentElement.scrollTop).toBe(0);
    expect(document.documentElement.scrollLeft).toBe(0);
    expect(document.body.scrollTop).toBe(0);
    expect(document.body.scrollLeft).toBe(0);
  });

  it('keeps hash navigation anchored instead of forcing the page top', () => {
    const anchor = document.createElement('section');
    anchor.id = 'virtual-news-library';
    anchor.scrollIntoView = jest.fn();
    document.body.appendChild(anchor);

    renderApp();

    document.body.scrollTop = 860;

    act(() => {
      getRouteChangeCompleteHandler()('/virtual-news#virtual-news-library');
    });

    expect(anchor.scrollIntoView).toHaveBeenCalledWith({ block: 'start' });
    expect(window.scrollTo).not.toHaveBeenCalled();

    anchor.remove();
  });
});
