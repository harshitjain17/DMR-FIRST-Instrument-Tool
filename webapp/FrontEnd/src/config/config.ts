interface IConfig {
    url: string,
    apiKey: string,
    signature: string
}

export const config: IConfig = {
    url: process.env.REACT_APP_BASE_URL ?? "",
    apiKey: process.env.REACT_APP_GOOGLE_API ?? "",
    signature: process.env.REACT_APP_GOOGLE_SIG ?? ""
}
