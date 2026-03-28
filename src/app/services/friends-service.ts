import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL, FriendProfile, FriendRequestSummary, FriendSummary, StorageKeys } from '../../definitions';
import { Storage } from './storage';

@Injectable({
  providedIn: 'root'
})
export class FriendsService {
  private http = inject(HttpClient);
  private storage = inject(Storage);

  getFriends(): Observable<FriendSummary[]> {
    return this.http.get<FriendSummary[]>(`${API_BASE_URL}/api/friends`, { params: this.getAuthParams() });
  }

  getIncomingRequests(): Observable<FriendRequestSummary[]> {
    return this.http.get<FriendRequestSummary[]>(`${API_BASE_URL}/api/friends/requests`, { params: this.getAuthParams() });
  }

  getOutgoingRequests(): Observable<FriendRequestSummary[]> {
    return this.http.get<FriendRequestSummary[]>(`${API_BASE_URL}/api/friends/requests/outgoing`, {
      params: this.getAuthParams()
    });
  }

  sendFriendRequest(friendUsername: string): Observable<{ message: string; becameFriends: boolean }> {
    return this.http.post<{ message: string; becameFriends: boolean }>(`${API_BASE_URL}/api/friends/request`, {
      username: this.storage.getFromStorage(StorageKeys.Username, ''),
      password: this.storage.getFromStorage(StorageKeys.Password, ''),
      friendUsername
    });
  }

  acceptFriendRequest(fromUsername: string): Observable<FriendSummary> {
    return this.http.post<FriendSummary>(`${API_BASE_URL}/api/friends/requests/${fromUsername}/accept`, {
      username: this.storage.getFromStorage(StorageKeys.Username, ''),
      password: this.storage.getFromStorage(StorageKeys.Password, ''),
      friendUsername: fromUsername
    });
  }

  declineFriendRequest(fromUsername: string): Observable<void> {
    return this.http.post<void>(`${API_BASE_URL}/api/friends/requests/${fromUsername}/decline`, {
      username: this.storage.getFromStorage(StorageKeys.Username, ''),
      password: this.storage.getFromStorage(StorageKeys.Password, ''),
      friendUsername: fromUsername
    });
  }

  removeFriend(friendUsername: string): Observable<void> {
    return this.http.delete<void>(`${API_BASE_URL}/api/friends/${friendUsername}`, { params: this.getAuthParams() });
  }

  getProfile(username: string): Observable<FriendProfile> {
    return this.http.get<FriendProfile>(`${API_BASE_URL}/api/friends/profile/${username}`, { params: this.getAuthParams() });
  }

  private getAuthParams() {
    return {
      username: this.storage.getFromStorage(StorageKeys.Username, ''),
      password: this.storage.getFromStorage(StorageKeys.Password, '')
    };
  }
}
