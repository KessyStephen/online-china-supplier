export interface User {
    id: number;
    name: string;
    role?: string;
    accessToken?: string;
    refreshToken?: string;
}