declare module "diff" {
  interface Change {
    added?: boolean;
    removed?: boolean;
    value: string;
  }

  export function diffWords(oldText: string, newText: string): Change[];
}
