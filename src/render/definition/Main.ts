// 对应 Main.json

import IFileType from '~/enum/FileType'

interface IFileListItemCommon {
  fileName: string
  id: string
  dbName: string // 此文件存储与某个数据库
  isGlobal: boolean // 是否全局文件
  rootId: number
  $loki?: number
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
  children: IFileListItem[]
  load: boolean // 是否已经加载了子文件系统
  visible: boolean // 是否显示子文件
}

export type IFileListItem = IFileListItemFile | IFileListItemFolder
