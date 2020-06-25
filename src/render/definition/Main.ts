// 对应 Main.json

import IFileType from '~/enum/FileType'

export interface IFileListItem {
  fileName: string
  fileType: IFileType
  path?: string // db PATH  包括 .json 后缀
}
