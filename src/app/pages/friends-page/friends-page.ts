import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AlertType, FriendRequestSummary, FriendSummary } from '../../../definitions';
import { FriendsService } from '../../services/friends-service';
import { RoomService } from '../../services/room-service';
import { AlertService } from '../../services/alert-service';

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
  incomingRequests: FriendRequestSummary[] = [];
  outgoingRequests: FriendRequestSummary[] = [];
  friendUsername = '';
  loading = false;
  loadingRequests = false;
  loadingOutgoingRequests = false;

  ngOnInit(): void {
    this.loadFriends();
    this.loadIncomingRequests();
    this.loadOutgoingRequests();
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

  loadIncomingRequests(): void {
    this.loadingRequests = true;
    this.friendsService.getIncomingRequests().subscribe({
      next: requests => {
        this.incomingRequests = requests;
        this.loadingRequests = false;
      },
      error: () => {
        this.loadingRequests = false;
      }
    });
  }

  loadOutgoingRequests(): void {
    this.loadingOutgoingRequests = true;
    this.friendsService.getOutgoingRequests().subscribe({
      next: requests => {
        this.outgoingRequests = requests;
        this.loadingOutgoingRequests = false;
      },
      error: () => {
        this.loadingOutgoingRequests = false;
      }
    });
  }

  hasOutgoingRequest(username: string): boolean {
    return this.outgoingRequests.some(r => r.username.toLowerCase() === username.toLowerCase());
  }

  addFriend(): void {
    const value = this.friendUsername.trim();
    if (!value) return;

    this.friendsService.sendFriendRequest(value).subscribe({
      next: response => {
        this.friendUsername = '';
        this.loadOutgoingRequests();

        if (response.becameFriends) {
          this.loadFriends();
          this.loadIncomingRequests();
          this.loadOutgoingRequests();
          this.alertService.displayAlert({
            type: AlertType.Success,
            title: 'Friend added',
            subtitle: response.message,
            timeout: 4000
          });
          return;
        }

        this.alertService.displayAlert({
          type: AlertType.Success,
          title: 'Friend request sent',
          subtitle: response.message,
          timeout: 4000
        });
      },
      error: (error) => {
        const subtitle = error?.error?.message || error?.error || 'Could not send this friend request.';
        this.alertService.displayAlert({
          type: AlertType.Error,
          title: 'Failed to add friend',
          subtitle: typeof subtitle === 'string' ? subtitle : 'Could not send this friend request.',
          timeout: 5000
        });
      }
    });
  }

  acceptRequest(request: FriendRequestSummary): void {
    this.friendsService.acceptFriendRequest(request.username).subscribe({
      next: friend => {
        this.incomingRequests = this.incomingRequests.filter(item => item.username !== request.username);
        this.friends = [friend, ...this.friends.filter(item => item.username !== friend.username)];
        this.loadOutgoingRequests();

        this.alertService.displayAlert({
          type: AlertType.Success,
          title: 'Friend request accepted',
          subtitle: `${request.username} is now in your friends list.`,
          timeout: 4000
        });
      },
      error: (error) => {
        const subtitle = error?.error || 'Could not accept this friend request.';
        this.alertService.displayAlert({
          type: AlertType.Error,
          title: 'Failed to accept request',
          subtitle: typeof subtitle === 'string' ? subtitle : 'Could not accept this friend request.',
          timeout: 5000
        });
      }
    });
  }

  declineRequest(request: FriendRequestSummary): void {
    this.friendsService.declineFriendRequest(request.username).subscribe({
      next: () => {
        this.incomingRequests = this.incomingRequests.filter(item => item.username !== request.username);
        this.alertService.displayAlert({
          type: AlertType.Success,
          title: 'Friend request declined',
          subtitle: `${request.username} was declined.`,
          timeout: 3000
        });
      },
      error: (error) => {
        const subtitle = error?.error || 'Could not decline this friend request.';
        this.alertService.displayAlert({
          type: AlertType.Error,
          title: 'Failed to decline request',
          subtitle: typeof subtitle === 'string' ? subtitle : 'Could not decline this friend request.',
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
