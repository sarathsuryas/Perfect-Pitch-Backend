import { EditUserDto } from "../../admin/dtos/editUser.dto";
import { LoginUserDto } from "../dtos/loginUser.dto";
import { RegisterUserDto } from "../dtos/registerUser.dto";
import { IReturnUserData } from "../../admin/interfaces/IReturnUserData";
import { IUserData } from "./IUserData";
import { EditProfileDto } from "../dtos/editProfile.dto";
import { IReturnEdit } from "./IReturnEdit";
import { IVideoList } from "./IVideoList";
import { IAlbumDetails } from "./albumDetails";
import { IAlbumData } from "./IAlbumData";
import { IHomePageData } from "./IHomePageData";
import { ISubmitSongDetails } from "./ISubmitSongDetails";
import { IResponseShorts } from "./IResponseShorts";
import { IResponseVideo } from "./IResponseVideo";
import { IVideoCommentDto } from "../dtos/IVideoComment.dto";
import { ICommentResponse } from "./ICommentResponse";
import { ICommentReplyDto } from "../dtos/ICommentReply.dto";
import { IShortsDto } from "../dtos/IShorts.dto";
import { ICreatePlaylistDto } from "../dtos/ICreatePlaylist.dto";
import { IUserPlaylists } from "./IUserPlaylists";
import { IGenres } from "src/modules/admin/interfaces/IGenres";
import { ISongsSameGenre } from "./ISongsSameGenre";
import { ISongData } from "./ISongData";
import { IReplyToReplyDto } from "../dtos/IReplyToReply.dto";
import { IReplyToReply } from "./IReplyToReply";
import { IUserMedia } from "./IUserMedia";
import { ICreateLive } from "./ICreateLive";
import { ILiveStreams } from "./ILiveStreams";
import { IChats } from "./IChats";
import { ILive } from "./ILive";

export interface IUserService {

  checkUser(userData:RegisterUserDto):Promise<string|RegisterUserDto>;

  verifyOtp (userData:string,otp:string):Promise<string>

  login(userData: LoginUserDto): Promise<IReturnUserData | string>
 
  resendOtp(email: string):Promise<void>
  
  decodeToken(token: string): Promise<IUserData>

  createAccessToken(payload: IUserData): Promise<string>

  getRefreshToken(payload: IUserData): Promise<string>

  existUser(email: string): Promise<string> 

  savePasswordResetToken(id: string, email: string): Promise<boolean>

  getResetPasswordToken(resetToken: string)

  newPassword(password: string, UserId: string): Promise<boolean>

  getUserData(id: string): Promise<IUserData>

  updateProfileImage(_id: string, link: string): Promise<string> 

  editProfile(data: EditProfileDto, email: string): Promise<IReturnEdit> 

  checkPassword(password: string,checkPassword:string):Promise<boolean>

  resetPassword(_id:string,password:string):Promise<boolean>

  SubmitVideoDetails(videoName: string, videoDescription: string, genreId: string, artistId: string, videoLink: string, thumbNailLink: string, artist: string)

  listVideos(data: { page: number, perPage: number }): Promise<IVideoList[]> 

  searchVideos(query: string): Promise<IVideoList[]>

  submitAlbumDetails(details: IAlbumDetails, uuids: string[]) 
     
  getAlbums(data: { page: number, perPage: number }): Promise<IAlbumData[]> 

  recommended(): Promise<IHomePageData>

  getArtistAlbums(artistId: string): Promise<IAlbumData[]> 

  searchAlbums(query: string): Promise<IAlbumData[]>

  submitSingleDetails(data: ISubmitSongDetails)

  getAlbumDetails(id: string, userId: string): Promise<IAlbumData>

  getShorts(userId: string): Promise<IResponseShorts>

  getVideoDetails(id: string, userId: string): Promise<IResponseVideo>

  likeVideo(videoId: string, userId: string)

  subscribeArtist(subscribedUserId: string, artistId: string)

  submitProfileImageDetails(uniqueKey: string, userId: string)

  addVideoComment(comment: IVideoCommentDto)

  likeComment(commentId: string, userId: string)

  getComments(videoId: string): Promise<ICommentResponse[]>

  replyComment(data: ICommentReplyDto)

  getReplies(commentId: string)

  likeReply(replyId: string, userId: string)

  likeReplyToReply(replyToReplyId: string, userId: string)

  submitShortsDetails(data: IShortsDto)

  createPlaylist(data: ICreatePlaylistDto)

  getUserPlaylist(data: { userId: string, page: number, perPage: number }): Promise<IUserPlaylists[]>

  getAllPlaylistUser(userId:string): Promise<IUserPlaylists[]>

  getPlaylists(data: { userId: string, page: number, perPage: number }): Promise<IUserPlaylists[]>

  searchPlaylist(query: string): Promise<IUserPlaylists[]>

  addToPlaylist(playlistId: string, songId: string)

  getPlaylistSongs(playlistId: string, userId: string): Promise<IUserPlaylists>

  getGenres(): Promise<IGenres[]>

  getSameGenreSongs(genreId: string): Promise<ISongsSameGenre[]>

  getArtists(): Promise<IUserData[]>

  searchArtists(query: string): Promise<IUserData[]>

  getSong(songId: string): Promise<ISongData>

  replyToReply(data: IReplyToReplyDto)

  getRepliesToReply(replyId: string): Promise<IReplyToReply[]> 

  getMemberShip() 

  checkActiveMemberShip(userId: string)  

  getArtistMedias(artistId: string): Promise<IUserMedia>

  createLive(data: ICreateLive): Promise<string>

  getLiveStreams(): Promise<ILiveStreams[]>

  getChats(streamKey: string): Promise<IChats[]>

  getLiveVideoDetails(streamKey: string): Promise<ILive>

  stopStreaming(streamKey: string)
}