declare namespace Express {
  interface Request {
    user: {
      permissions: any[],
      role: any,
      [key: string]: any;
    }
  }
}
