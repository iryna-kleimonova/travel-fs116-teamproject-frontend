import { parse } from 'cookie';

export interface CookieOptions {
  expires?: Date;
  path?: string;
  maxAge?: number;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
}

const isProduction = process.env.NODE_ENV === 'production';

export const defaultCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'none' : 'lax',
  path: '/',
};

export function parseCookieOptions(cookieStr: string): CookieOptions {
  const parsed = parse(cookieStr);
  const options: CookieOptions = { ...defaultCookieOptions };

  // Parse expires date
  if (parsed.Expires) {
    const expiresDate = new Date(parsed.Expires);
    if (!isNaN(expiresDate.getTime())) {
      options.expires = expiresDate;
    }
  }

  // Parse path
  if (parsed.Path) {
    options.path = parsed.Path;
  }

  // Parse maxAge
  const maxAge = Number(parsed['Max-Age']);
  if (!isNaN(maxAge) && maxAge > 0) {
    options.maxAge = maxAge;
  }

  // Parse httpOnly
  if (parsed.HttpOnly === 'true' || parsed.HttpOnly === '') {
    options.httpOnly = true;
  } else if (parsed.HttpOnly === 'false') {
    options.httpOnly = false;
  }

  // Parse secure
  if (parsed.Secure === 'true' || parsed.Secure === '') {
    options.secure = true;
  } else if (parsed.Secure === 'false') {
    options.secure = false;
  } else {
    // Use environment-based default
    options.secure = isProduction;
  }

  // Parse sameSite
  if (parsed.SameSite) {
    const sameSite = parsed.SameSite.toLowerCase();
    if (['strict', 'lax', 'none'].includes(sameSite)) {
      options.sameSite = sameSite as 'strict' | 'lax' | 'none';
    }
  }

  return options;
}
