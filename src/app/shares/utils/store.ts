export class StoreUtil {
  private static list = new Map<string, any>();

  get(key: string) {
    return StoreUtil.list.get(key);
  }

  set(key: string, data: any) {
    StoreUtil.list.set(key, data);
  }
}
