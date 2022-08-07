/**
 * This is necessary when HTML entities inside strings are not parsed.
 */
export const htmlDecode = (input: string) => {
  return new DOMParser().parseFromString(input, "text/html").documentElement
    .textContent;
};
