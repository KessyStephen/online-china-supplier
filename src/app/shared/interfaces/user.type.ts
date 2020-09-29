export interface User {
    id: number;
    name: string;
    email?: string;
    role?: string;
    accessToken?: string;
    refreshToken?: string;
    isApproved?: boolean;
}