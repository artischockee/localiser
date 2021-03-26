export function warn(message: string): void {
  console.warn('Localiser: ' + message);
}

export function getAllMatchesByRegExp(regExp: RegExp, string: string): string[][] {
  let innerRegExp = regExp;

  if (!innerRegExp.flags.includes('g')) {
    innerRegExp = new RegExp(innerRegExp.source, innerRegExp.flags + 'g');
  }

  const result: string[][] = [];

  let match: RegExpExecArray | null;
  do {
    match = innerRegExp.exec(string);
    if (match) {
      result.push([match[0], match[1]]);
    }
  } while (match);

  return result;
}

export function getProcessedLocItem(locItem?: string, params: Record<string, unknown> | null = {}): string {
  if (locItem == null) return '';
  if (params == null || Object.keys(params).length === 0) return locItem;

  const matches = getAllMatchesByRegExp(/%(\w+)/g, locItem);

  if (matches.length === 0) return locItem;

  let formattedLocItem = locItem;
  matches.forEach((match) => {
    if (params[match[1]] == null) {
      warn(`You haven't specified "${match[0]}" param. This item hasn't been edited.`);
      return;
    }

    formattedLocItem = formattedLocItem.replace(match[0], params[match[1]] as string);
  });

  return formattedLocItem;
}
