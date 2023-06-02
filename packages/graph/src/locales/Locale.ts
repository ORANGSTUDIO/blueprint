import { LocaleMessage, LocaleOptions } from "../interfaces/locale";
import _ from 'lodash'

export default class Locale {
  private locale: string;
  private message: LocaleMessage;

  constructor(options: LocaleOptions) {
    this.locale = options.locale;
    this.message = options.message;
  }

  public t(key: string) {
    return _.get(this.message, `${this.locale}.${key}`);
  }
}
