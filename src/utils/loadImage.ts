import path from "path"

export default function loadImage(fileRequire): string {
  return path.resolve(__dirname, '../dist', fileRequire.default)
}
