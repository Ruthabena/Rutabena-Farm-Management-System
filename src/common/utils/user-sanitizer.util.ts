export function sanitizeUser<T extends { passwordHash: string; refreshTokenHash?: string | null }>(
  user: T,
): Omit<T, 'passwordHash' | 'refreshTokenHash'> {
  const { passwordHash, refreshTokenHash, ...safeUser } = user as T & {
    refreshTokenHash?: string | null;
  };
  void passwordHash;
  void refreshTokenHash;
  return safeUser as Omit<T, 'passwordHash' | 'refreshTokenHash'>;
}
