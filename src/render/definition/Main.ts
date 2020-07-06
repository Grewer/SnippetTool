// 对应 Main.json

import IFileType from '~/enum/FileType'

interface IFileListItemCommon {
  fileName: string
}

// 文件类型
interface IFileListItemFile extends IFileListItemCommon {
  fileType: IFileType.file
  content: string
}

// 文件夹类型
interface IFileListItemFolder extends IFileListItemCommon {
  fileType: IFileType.folder
  path: string // db PATH  包括 .json 后缀
}

export type IFileListItem = IFileListItemFile | IFileListItemFolder
