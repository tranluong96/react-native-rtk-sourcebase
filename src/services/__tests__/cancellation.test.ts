import { CANCELLED_STATUS, isCancelledError } from '../cancellation';
import { xhrRequest } from '../xhr';
import { getApiErrorMessage } from '@/utils/functions/api_error';

class FakeXhr {
  static instances: FakeXhr[] = [];

  upload: Record<string, any> = {};
  responseType = '';
  timeout = 0;
  status = 0;
  statusText = '';
  response: unknown = null;
  aborted = false;
  sent = false;

  onabort: (() => void) | null = null;
  onerror: (() => void) | null = null;
  ontimeout: (() => void) | null = null;
  onload: (() => void) | null = null;
  onprogress: ((event: any) => void) | null = null;

  constructor() {
    FakeXhr.instances.push(this);
  }

  open() {}
  setRequestHeader() {}
  send() {
    this.sent = true;
  }
  abort() {
    this.aborted = true;
    this.onabort?.();
  }
}

describe('isCancelledError', () => {
  it.each([
    ['RTK Query abort', { name: 'AbortError', message: 'Aborted' }],
    ['skipped run', { name: 'ConditionError' }],
    ['fetchBaseQuery abort', { status: 'FETCH_ERROR', error: 'AbortError: Aborted' }],
    ['queryFn cancel', { status: CANCELLED_STATUS, error: 'Request cancelled by user' }],
    ['thunk meta', { meta: { aborted: true } }],
  ])('recognises %s', (_label, error) => {
    expect(isCancelledError(error)).toBe(true);
  });

  it.each([
    ['server error', { status: 500, data: { message: 'boom' } }],
    ['offline', { status: 'FETCH_ERROR', error: 'No internet connection' }],
    ['nothing', undefined],
  ])('does not treat %s as a cancellation', (_label, error) => {
    expect(isCancelledError(error)).toBe(false);
  });
});

describe('getApiErrorMessage', () => {
  it('returns null for a cancellation so the UI stays silent', () => {
    expect(getApiErrorMessage({ name: 'AbortError', message: 'Aborted' })).toBeNull();
    expect(getApiErrorMessage({ status: CANCELLED_STATUS, error: 'x' })).toBeNull();
  });

  it('surfaces real failures', () => {
    expect(getApiErrorMessage({ status: 500, data: { message: 'boom' } })).toBe('boom');
    expect(getApiErrorMessage({ status: 'FETCH_ERROR', error: 'No internet connection' })).toBe(
      'No internet connection',
    );
  });
});

describe('xhrRequest', () => {
  const originalXhr = (global as any).XMLHttpRequest;

  beforeEach(() => {
    FakeXhr.instances = [];
    (global as any).XMLHttpRequest = FakeXhr;
  });

  afterAll(() => {
    (global as any).XMLHttpRequest = originalXhr;
  });

  it('aborts the underlying request when the signal fires', async () => {
    const controller = new AbortController();
    const promise = xhrRequest({ url: 'https://example.test/big', signal: controller.signal });

    const [xhr] = FakeXhr.instances;
    expect(xhr.sent).toBe(true);
    expect(xhr.aborted).toBe(false);

    controller.abort();

    const result = await promise;
    expect(xhr.aborted).toBe(true);
    expect('error' in result && result.error.status).toBe(CANCELLED_STATUS);
    expect(isCancelledError('error' in result ? result.error : null)).toBe(true);
  });

  it('never opens a request when the signal is already aborted', async () => {
    const controller = new AbortController();
    controller.abort();

    const result = await xhrRequest({ url: 'https://example.test/big', signal: controller.signal });

    expect(FakeXhr.instances).toHaveLength(0);
    expect('error' in result && result.error.status).toBe(CANCELLED_STATUS);
  });

  it('resolves with data on success', async () => {
    const promise = xhrRequest<{ ok: boolean }>({ url: 'https://example.test/ok' });

    const [xhr] = FakeXhr.instances;
    xhr.status = 200;
    xhr.response = { ok: true };
    xhr.onload?.();

    await expect(promise).resolves.toEqual({ data: { ok: true } });
  });

  it('reports a server failure as an error, not a cancellation', async () => {
    const promise = xhrRequest({ url: 'https://example.test/bad' });

    const [xhr] = FakeXhr.instances;
    xhr.status = 500;
    xhr.statusText = 'Internal Server Error';
    xhr.onload?.();

    const result = await promise;
    expect(isCancelledError('error' in result ? result.error : null)).toBe(false);
    expect(getApiErrorMessage('error' in result ? result.error : null)).toBe(
      'Internal Server Error',
    );
  });
});
