export interface UserData {
    username: string,
    email: string,
    firstname: string,
    lastname: string,
    birthDate: string,
    adultNumber: number,
    childrenNumber: number,
    expiryDate: string,
}

export interface ResponseData {
    message: string;
}
export interface ResponsePeekQrCode {
    qrcode: string;
}

export interface ResponsePeekNumber {
    number: number;
}
export interface ResponseGetResDateList {
    dateList: string[];
}
export interface ResponseGetCurrentNum {
    currentNum: number;
}

export interface ResponseCurrentNum {
    number: number;
}
export interface ExtendTafelIdData {
    uri: string;
    mimeType?: string;
    name: string;
}

export interface Data {
    date: string;
    jwtResponse: {
        id: string;
        username: string;
        email: string;
        roles: string[];
        accessToken: string;
        tokenType: string;
    };
}

export interface JwtResponse {
    id: string;
    username: string;
    email: string;
    roles: string[];
    accessToken: string;
    tokenType: string;
}

export interface AuthContextType {
    token: string | null;
    jwtResponse: JwtResponse | null;
    signIn: (username: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
}