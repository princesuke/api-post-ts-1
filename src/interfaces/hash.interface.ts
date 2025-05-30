export interface IHashService {
  hashPassword(planingText: string): Promise<string>;
  comparePassword(planingText: string, hash: string): Promise<boolean>;
}
