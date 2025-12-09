/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly PORT: string
    readonly API_URL: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
