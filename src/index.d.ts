declare namespace Express {
  interface Request {
    user: {
      permissions: any[],
      role: any,
      account: string,
      identity: 'student' | 'teacher'
      [key: string]: any;
    }
  }
}
