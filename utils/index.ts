export const count = (a: number,  b: number) => {
  return a + b;
}

interface ICookieInfo {
  userId: number,
  nickname: string,
  avator: string,
}

export const setCookie = (cookies: any, { userId, nickname, avator }: ICookieInfo) => {
  // 登录时效 24h
  const expire = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const path = '/';

  cookies.set('userId', userId, {
    path,
    expire
  });
  cookies.set('nickname', nickname, {
    path,
    expire
  });
  cookies.set('avator', avator, {
    path,
    expire
  });
}

export const clearCookie = (cookies: any) => {
  const expire = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const path = '/';

  cookies.set('userId', '', {
    path,
    expire
  });
  cookies.set('nickname', '', {
    path,
    expire
  });
  cookies.set('avator', '', {
    path,
    expire
  });
}