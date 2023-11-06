import { StyleProcessor, StyleProps } from '../@types/style-types';

const cleanStyle = (
  styler: StyleProcessor,
  value: string[] | string | number | boolean | undefined
): string | string[] | boolean => {
  if (!styler || !styler.type || !styler.type.pattern || typeof value === 'undefined') {
    return '';
  }
  if (styler.isArray) {
    if (!Array.isArray(value)) {
      return '';
    }
    value = value.map((v) => v.toString().toLowerCase()).filter((v) => v.match(styler.type.pattern));
    value = [...new Set(value)];
  } else {
    value = value.toString();
    if (!value.match(styler.type.pattern)) {
      return '';
    }
  }
  if (styler.type.process) {
    value = styler.type.process(value);
  }
  return value;
};

export const cleanStyles = (
  styleProps: Record<string, string[] | string | number | boolean | undefined> = {},
  styleProcessors: Record<string, StyleProcessor> = {}
): StyleProps =>
  Object.keys(styleProcessors)
    .map((styleProp) => [styleProp, cleanStyle(styleProcessors[styleProp], styleProps[styleProp])])
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    .reduce((reducer: object, mapped: any) => {
      const [styleProp, styleValue] = mapped;
      if (styleValue.length || styleValue === true || styleValue === false) {
        return { ...reducer, [styleProp]: styleValue };
      }
      return reducer;
    }, {});
