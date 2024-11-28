export interface IChats {
    _id:string
    streamKey: string
    message: string
    createdAt: Date
    userData: {
      _id: string
      fullName: string
    }
}