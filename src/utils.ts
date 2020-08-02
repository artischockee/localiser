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

  static getObjectPropertyByPath(obj: Record<any, any>, path: string) {
    if (typeof obj !== 'object' || obj == null || Object.keys(obj).length === 0) return null;
    if (path === '' || path == null) return obj;

    const paths = path.split('.');

    let property = obj;

    paths.forEach((p, index) => {
      if (property[p] == null) {
        throw new ReferenceError(`Could not find ${p} property on index ${index} in the specified object.`);
      }

      property = property[p];
    });

    return property;
  }
}
