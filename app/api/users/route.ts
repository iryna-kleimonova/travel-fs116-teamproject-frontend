//app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { api, ApiError } from '../api';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page') ?? '1';

  try {
    const { data } = await api.get('/users', {
      params: { page, perPage: searchParams.get('perPage') || '4' },
    });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          (error as ApiError).response?.data?.error ??
          (error as ApiError).message,
      },
      { status: (error as ApiError).status }
    );
  }
}
