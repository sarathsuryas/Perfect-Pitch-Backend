export interface ILive {
  _id: string;
  uuid: string;
  title: string;
  artistData: {
      _id: string;
      fullName: string;
      profileImage:string
  };
}