export enum StorageKeys {
  Username = "username",
  Password = "password"
}

export const API_BASE_URL = "http://localhost:5026";

export enum ConnectionState {
  Disconnected,
  Reconnected
}

export interface Category {
  name: string,
  description: string,
  image: string
}

export enum ComponentIconPosition {
  Left,
  Right
}

export enum ButtonSize {
  Small = 'small',
  Medium = 'medium',
  Large = 'large'
}

export enum ButtonType {
  Default = 'default',
  Outlined = 'outlined'
}

export enum ButtonCorners {
  Default = 'corners-default',
  Rounded = 'corners-rounded'
}

export enum InputFieldColor {
  Primary = 'primary',
  Secondary = 'secondary'
}

export interface ComponentIcon {
  icon: string,
  position: ComponentIconPosition
}

export enum NavbarContentColor {
  Primary = "primary",
  Secondary = "secondary"
}

export interface NavbarContent {
  content: string,
  color: NavbarContentColor
}

export enum AlertType {
  Error = "error",
  Success = "success",
  Warning = "warning"
}

export interface AlertI {
  type: AlertType,
  title: string,
  subtitle: string,
  timeout?: number
}

export interface User {
  username: string
}

export enum RoomRole {
  Commander,
  Guesser
}

export interface Room {
  name: string,
  rounds: number,
  roundDuration: number,
  category: Category,
  creator: User,
  pinCode: string | null,
  joinedUsers: User[],
  currentRound?: number
}

export interface FriendSummary {
  username: string,
  isOnline: boolean,
  currentRoomCode: string | null,
  currentRoomName: string | null,
  friendsSinceUtc: string
}

export interface FriendProfile {
  username: string,
  isOnline: boolean,
  isFriend: boolean,
  friendsCount: number,
  currentRoomCode: string | null,
  currentRoomName: string | null
}

export interface FriendRequestSummary {
  username: string,
  isOnline: boolean,
  requestedAtUtc: string
}
