declare namespace NodeJS {
    export interface ProcessEnv {
        MODE: string;
        PORT: string;
        AUTOLOGIN: string;
        CLIENT_ID: string;
        CLIENT_SECRET: string;
        TENANT: string;
        COOKIE_SESSION: string;
    }
}
