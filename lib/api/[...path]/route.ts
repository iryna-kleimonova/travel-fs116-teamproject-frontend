// app/api/[...path]/route.ts
import { NextRequest } from 'next/server';

const BACKEND =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  'https://travel-fs116-teamproject-backend.onrender.com';

const toBackendUrl = (segments: string[]) =>
  `${BACKEND}/api/${segments.join('/')}`;

async function proxy(req: NextRequest, segments: string[]) {
  const url = toBackendUrl(segments);

  // 🔧 Формуємо заголовки без undefined (щоб TS не сварився)
  const headers: Record<string, string> = {};
  const cookie = req.headers.get('cookie');
  const contentType = req.headers.get('content-type');
  const authorization = req.headers.get('authorization');

  if (cookie) headers['cookie'] = cookie;
  if (contentType) headers['content-type'] = contentType;
  if (authorization) headers['authorization'] = authorization;

  // Проксіруємо метод/тіло/заголовки
  const fetchRes = await fetch(url, {
    method: req.method,
    headers,
    body: req.body,
    redirect: 'manual',
  });

  // Забираємо "Set-Cookie" з бекенда й віддаємо клієнту,
  // щоб браузер записав кукі на localhost (першопартійні)
  const resHeaders = new Headers(fetchRes.headers);
  const setCookie = fetchRes.headers.get('set-cookie');
  if (setCookie) resHeaders.set('set-cookie', setCookie);

  // Тіло як є (може бути json/текст/стрім)
  const body = await fetchRes.arrayBuffer();
  return new Response(body, {
    status: fetchRes.status,
    statusText: fetchRes.statusText,
    headers: resHeaders,
  });
}

export async function GET(req: NextRequest, { params }: { params: { path: string[] } }) {
  return proxy(req, params.path);
}
export async function POST(req: NextRequest, { params }: { params: { path: string[] } }) {
  return proxy(req, params.path);
}
export async function PATCH(req: NextRequest, { params }: { params: { path: string[] } }) {
  return proxy(req, params.path);
}
export async function PUT(req: NextRequest, { params }: { params: { path: string[] } }) {
  return proxy(req, params.path);
}
export async function DELETE(req: NextRequest, { params }: { params: { path: string[] } }) {
  return proxy(req, params.path);
}