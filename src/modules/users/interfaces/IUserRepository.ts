import { CreateUserDto } from "../../../admin/dtos/createUser.dto";
import { EditUserDto } from "../../../admin/dtos/editUser.dto";
import { LoginUserDto } from "../dtos/loginUser.dto";
import { RegisterUserDto } from "../dtos/registerUser.dto";
import { ICreatedUser } from "../../../admin/interfaces/ICreatedUser";
import { IStoredOtp } from "./IStoredOtp";
import { IUserData } from "./IUserData";
import { IUserResetToken } from "./IUserResetToken";
import { EditProfileDto } from "../dtos/editProfile.dto";
import { IReturnEdit } from "./IReturnEdit";
import { IVideoList } from "./IVideoList";
import { IAudioDto } from "../dtos/IAudio.dto";
import { IAlbumDetails } from "./albumDetails";
import { IAlbumData } from "./IAlbumData";
import { ISubmitSongDetails } from "./ISubmitSongDetails";
import { IResponseShorts } from "./IResponseShorts";
import { IResponseVideo } from "./IResponseVideo";
import { IVideoCommentDto } from "../dtos/IVideoComment.dto";
import { ICommentResponse } from "./ICommentResponse";
import { ICommentReplyDto } from "../dtos/ICommentReply.dto";
import { ICommentReply } from "./ICommentReplies";
import { IShortsDto } from "../dtos/IShorts.dto";
import { ICreatePlaylistDto } from "../dtos/ICreatePlaylist.dto";
import { IUserPlaylists } from "./IUserPlaylists";
import { IGenres } from "src/admin/interfaces/IGenres";
import { ISongsSameGenre } from "./ISongsSameGenre";
import { ISongData } from "./ISongData";
import { IReplyToReplyDto } from "../dtos/IReplyToReply.dto";
import { IReplyToReply } from "./IReplyToReply";
import { PaymentSuccessDto } from "../dtos/paymentSuccess.dto";
import { IUserMedia } from "./IUserMedia";
import { ICreateLive } from "./ICreateLive";
import { ILiveStreams } from "./ILiveStreams";
import { IMessageDto } from "../dtos/IMessageDto";
import { IChats } from "./IChats";
import { ILive } from "./ILive";

export interface IUserRepository {
  checkUser(userData:RegisterUserDto):Promise<boolean> 

  storeOtp(otp:string):Promise<void>

  returnOtp(): Promise<IStoredOtp>

  createUser(data: CreateUserDto, password: string): Promise<ICreatedUser>

  refreshTokenSetup(token: string, id: string): Promise<void>

  existUser(email:string): Promise<IUserData | null>
  
  getRefreshToken(email: string): Promise<string>

  getUserId(email: string): Promise<string>

  savePasswordResetToken(id: string, resetToken: string): Promise<boolean>

  getResetPasswordToken(resetToken: string)

  newPassword(password: string, AdminId: string): Promise<IUserResetToken | boolean>

  updatePassword(id: string, password: string): Promise<IUserData>

  getUser(id: string): Promise<IUserData>

  updateProfileImage(_id: string, link: string): Promise<string>

  editProfile(data: EditProfileDto,email:string):Promise<IReturnEdit>

  resetPassword(_id:string,password:string)

   uploadVideo(videoName: string, videoDescription: string, genreId: string, artistId: string, videoLink: string, thumbNailLink: string, artist: string)

   listVideos(data: { page: number, perPage: number }): Promise<IVideoList[]>  

   recommendedVideos(): Promise<IVideoList[]>

   searchVideos(query: string): Promise<IVideoList[]>
 
   storeSongsDetails(songs: IAudioDto)

   submitAlbumDetails(details: IAlbumDetails, uuids: string[])

   submitAudioDetails(songs: IAlbumDetails)

   getAlbums(data: { page: number, perPage: number }): Promise<IAlbumData[]>

   recommendedAlbums(): Promise<IAlbumData[]>

   getArtistAlbums(artistId: string): Promise<IAlbumData[]>

   searchAlbum(query: string): Promise<IAlbumData[]>

   submitSingleDetails(data: ISubmitSongDetails)

   getAlbumDetails(id: string, userId: string): Promise<IAlbumData> 

   getShorts(userId: string): Promise<IResponseShorts> 

   getVideoDetails(id: string, userId: string): Promise<IResponseVideo>

   likeVideo(videoId: string, userId: string)

   subscribeArtist(subscribedUserId: string, artistId: string)

   addVideoComment(comment: IVideoCommentDto): Promise<Object>

   likeComment(commentId: string, userId: string)

   getComments(videoId: string): Promise<ICommentResponse[]>

   replyComment(data: ICommentReplyDto)

   getReplies(commentId: string): Promise<ICommentReply[]> 

   likeReply(replyId: string, userId: string)

   submitShortsDetails(data: IShortsDto)

   createPlaylist(data: ICreatePlaylistDto)

   getUserPlaylist(data: { userId: string, page: number, perPage: number })

   getAllPlaylistUser(userId:string)

   getPlaylists(data: { userId: string, page: number, perPage: number })

   recommendedPlaylists(): Promise<IUserPlaylists[]> 

   searchPlaylist(query: string)

   addToPlaylsit(playlistId: string, songId: string): Promise<boolean>

   getPlaylistSongs(playlistId: string, userId: string): Promise<IUserPlaylists>

   getGenres(): Promise<IGenres[]>

   getSameGenreSongs(genreId: string): Promise<ISongsSameGenre[]>

   getArtists(): Promise<IUserData[]>

   recomendedArtists(): Promise<IUserData[]>

   searchArtists(query: string): Promise<IUserData[]>

   getSong(songId: string): Promise<ISongData>

   replyToReply(replyToReply: IReplyToReplyDto)

   getrepliesToReply(replyId: string): Promise<IReplyToReply[]> 

   likeReplyToReply(replyToReplyId: string, userId: string)

   paymentSuccess(data: PaymentSuccessDto)

   getMemberShip()

   checkActiveMemberShip(userId: string)

   getArtistMedias(artistId: string): Promise<IUserMedia>

   getUserAlbums(artistId: string): Promise<IAlbumData[]>

   getUserPublicPlaylist(userId: string)

   getUserVideos(userId: string): Promise<IVideoList[]> 

   createLive(data: ICreateLive): Promise<string>

   getLiveStreams(): Promise<ILiveStreams[]>

   StoreChat(data: IMessageDto)

   getChat(streamKey: string): Promise<IChats[]> 

   getLiveVideoDetails(streamKey: string): Promise<ILive>

   stopStream(streamKey: string)
}