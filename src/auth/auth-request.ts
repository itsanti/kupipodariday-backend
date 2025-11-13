import { Request as ExpressRequest } from 'express';

export interface AuthRequest extends ExpressRequest {
  user?: UserRequestInfo;
}

export interface UserRequestInfo {
  userId: number;
  username: string;
  roles: string[];
}
