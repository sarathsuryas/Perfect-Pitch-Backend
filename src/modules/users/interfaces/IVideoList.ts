export interface IVideoList {
    _id: string
    title: string
    description: string
    link: string
    visibility: boolean
    artistData: {
      _id: string
      fullName: string
    }
  
}