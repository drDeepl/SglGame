import { isDevelop } from "@/_config";

export function logR(type: string, msg: string): void {
  // INFO: зато забавно
  if (isDevelop) {
    if (type == "log") {
      console.log(msg);
    } else if (type == "warn") {
      console.warn(msg);
    } else if (type == "error") {
      console.error(msg);
    }
  }
}
