import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FriendSummary } from '../../../definitions';
import { FriendsService } from '../../services/friends-service';
import { RoomService } from '../../services/room-service';
import { AlertService } from '../../services/alert-service';
import { AlertType } from '../../../definitions';

@Component({
  selector: 'app-friends-page',
  imports: [CommonModule, FormsModule],
  templateUrl: './friends-page.html',
  styleUrl: './friends-page.scss'
})
export class FriendsPage {
  private friendsService = inject(FriendsService);
  private roomService = inject(RoomService);
  private alertService = inject(AlertService);
  private router = inject(Router);

  friends: FriendSummary[] = [];
  friendUsername = '';
  loading = false;

  ngOnInit(): void {
    this.loadFriends();
  }

  loadFriends(): void {
    this.loading = true;
    this.friendsService.getFriends().subscribe({
      next: friends => {
        this.friends = friends;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.alertService.displayAlert({
          type: AlertType.Error,
          title: 'Failed to load friends',
          subtitle: 'Please make sure backend is running and try again.',
          timeout: 5000
        });
      }
    });
  }

  addFriend(): void {
    const value = this.friendUsername.trim();
    if (!value) return;

    this.friendsService.addFriend(value).subscribe({
      next: friend => {
        this.friends = [friend, ...this.friends.filter(item => item.username !== friend.username)];
        this.friendUsername = '';
        this.alertService.displayAlert({
          type: AlertType.Success,
          title: 'Friend added',
          subtitle: `${friend.username} was added to your friends list.`,
          timeout: 4000
        });
      },
      error: (error) => {
        const subtitle = error?.error || 'Could not add this friend.';
        this.alertService.displayAlert({
          type: AlertType.Error,
          title: 'Failed to add friend',
          subtitle,
          timeout: 5000
        });
      }
    });
  }

  removeFriend(friend: FriendSummary): void {
    this.friendsService.removeFriend(friend.username).subscribe({
      next: () => {
        this.friends = this.friends.filter(item => item.username !== friend.username);
      },
      error: () => {
        this.alertService.displayAlert({
          type: AlertType.Error,
          title: 'Failed to remove friend',
          subtitle: `Could not remove ${friend.username}.`,
          timeout: 4000
        });
      }
    });
  }

  joinLobby(friend: FriendSummary): void {
    if (!friend.currentRoomCode) return;
    this.roomService.joinRoom(friend.currentRoomCode);
  }

  viewProfile(friend: FriendSummary): void {
    this.router.navigate(['/friends', friend.username]);
  }
}
