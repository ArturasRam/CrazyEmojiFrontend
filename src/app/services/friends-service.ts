import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL, FriendProfile, FriendSummary, StorageKeys } from '../../definitions';
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

  addFriend(friendUsername: string): Observable<FriendSummary> {
    return this.http.post<FriendSummary>(`${API_BASE_URL}/api/friends/add`, {
      username: this.storage.getFromStorage(StorageKeys.Username, ''),
      password: this.storage.getFromStorage(StorageKeys.Password, ''),
      friendUsername
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
