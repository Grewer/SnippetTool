// 对应 Main.json

import IFileType from '~/enum/FileType'

interface IFileListItemCommon {
  fileName: string
  id: string
  parentIds: string[]
  dbName: string // 此文件存储与某个数据库
  isGlobal: boolean // 是否全局文件
}

// 文件类型
export interface IFileListItemFile extends IFileListItemCommon {
  fileType: IFileType.file
  content: string
}

// 文件夹类型
export interface IFileListItemFolder extends IFileListItemCommon {
  fileType: IFileType.folder
  path: string // db PATH  包括 .json 后缀
  children?: IFileListItem[]
}

export type IFileListItem = IFileListItemFile | IFileListItemFolder
