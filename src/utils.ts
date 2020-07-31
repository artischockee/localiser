export default class Utils {
  static warn(message: string) {
    console.warn('Localiser: ' + message);
  }

  static getAllMatchesByRegExp(regExp: RegExp, string: string) {
    let innerRegExp = regExp;

    if (!innerRegExp.flags.includes('g')) {
      innerRegExp = new RegExp(innerRegExp.source, innerRegExp.flags + 'g');
    }

    const result = [];

    let match;
    do {
      match = innerRegExp.exec(string);
      if (match) {
        result.push([match[0], match[1]]);
      }
    } while (match);

    return result;
  }

  static getProcessedLocItem(locItem?: string, params: Record<string, any> | null = {}) {
    if (locItem == null) return null;
    if (params == null || Object.keys(params).length === 0) return locItem;

    const matches = this.getAllMatchesByRegExp(/%(\w+)/g, locItem);

    if (matches.length === 0) return locItem;

    let formattedLocItem = locItem;
    matches.forEach((match) => {
      if (params[match[1]] == null) {
        this.warn(`You haven't specified "${match[0]}" param. This item hasn't been edited.`);
        return;
      }

      formattedLocItem = formattedLocItem.replace(match[0], params[match[1]]);
    });

    return formattedLocItem;
  }
}
