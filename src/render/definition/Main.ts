// 对应 Main.json

import IFileType from '~/enum/FileType'

interface IFileListItemCommon {
  fileName: string
  id: string
  parentIds: string[]
}

// 文件类型
export interface IFileListItemFile extends IFileListItemCommon {
  fileType: IFileType.file
  content: string
  dbName: string
}

// 文件夹类型
export interface IFileListItemFolder extends IFileListItemCommon {
  fileType: IFileType.folder
  load: false // 是否已经加载了
  path: string // db PATH  包括 .json 后缀
}

export type IFileListItem = IFileListItemFile | IFileListItemFolder
