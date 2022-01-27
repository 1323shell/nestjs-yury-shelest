import bcrypt from 'bcrypt';

const SALT_ROUNDS = 13;

export const generateHash = async (password: string): Promise<string> =>
  await bcrypt.hash(password, SALT_ROUNDS);

export const verifyPassword = (
  password: string,
  userPassword: string,
): Promise<boolean> => bcrypt.compare(password, userPassword);
