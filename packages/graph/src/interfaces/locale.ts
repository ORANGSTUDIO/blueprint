export interface LocaleMessage {
  [locale: string]: string | LocaleMessage;
}

export interface LocaleOptions {
  locale: string;
  message: LocaleMessage;
}
