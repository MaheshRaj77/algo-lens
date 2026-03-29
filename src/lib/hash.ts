import bcrypt from 'bcryptjs';

/**
 * We combine the user's password with an additional global "pepper" (salt)
 * to provide an extra layer of security before hashing with bcrypt.
 */
const getPepper = () => {
  const pepper = process.env.AUTH_PEPPER;
  if (!pepper) {
    throw new Error('AUTH_PEPPER environment variable is not set.');
  }
  return pepper;
};

export async function hashPassword(password: string): Promise<string> {
  const pepperedPassword = password + getPepper();
  // bcrypt handles its own per-user salt generation under the hood (cost factor 10)
  return bcrypt.hash(pepperedPassword, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const pepperedPassword = password + getPepper();
  return bcrypt.compare(pepperedPassword, hash);
}
