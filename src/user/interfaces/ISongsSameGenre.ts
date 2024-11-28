export interface ISongsSameGenre {
    _id: string
    title: string
    link:string
    visibility: true,
    artistId: {
      _id: string
      fullName: string
    },
    albumId: {
      _id:string
      title: string
      thumbNailLink:string
    },
    genreId: string
} 