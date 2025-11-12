import { NextRequest } from 'next/server';

const BACKEND =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  'https://travel-fs116-teamproject-backend.onrender.com';

const toBackendUrl = (segments: string[]) =>
  `${BACKEND}/api/${segments.join('/')}`;

async function proxy(req: NextRequest, path: string[]) {
  const url = toBackendUrl(path);

  const headers: Record<string, string> = {};
  const cookie = req.headers.get('cookie');
  const contentType = req.headers.get('content-type');
  const authorization = req.headers.get('authorization');

  if (cookie) headers['cookie'] = cookie;
  if (contentType) headers['content-type'] = contentType;
  if (authorization) headers['authorization'] = authorization;

  // 🧠 важливо: читаємо тіло перед відправкою
  const rawBody = req.body ? await req.text() : undefined;

  const fetchRes = await fetch(url, {
    method: req.method,
    headers,
    body: rawBody,
    redirect: 'manual',
  });

  const resHeaders = new Headers(fetchRes.headers);
  resHeaders.delete('content-encoding');
  resHeaders.delete('transfer-encoding');

  const setCookie = fetchRes.headers.get('set-cookie');
  if (setCookie) resHeaders.set('set-cookie', setCookie);

  const body = await fetchRes.arrayBuffer();

  return new Response(body, {
    status: fetchRes.status,
    statusText: fetchRes.statusText,
    headers: resHeaders,
  });
}

// ⚡ Тепер усі методи працюють однаково
export async function GET(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;
  return proxy(req, path);
}
export async function POST(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;
  return proxy(req, path);
}
export async function PATCH(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;
  return proxy(req, path);
}
export async function PUT(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;
  return proxy(req, path);
}
export async function DELETE(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;
  return proxy(req, path);
}