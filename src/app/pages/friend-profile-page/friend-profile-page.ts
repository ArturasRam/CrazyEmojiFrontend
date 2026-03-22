import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FriendProfile } from '../../../definitions';
import { FriendsService } from '../../services/friends-service';
import { RoomService } from '../../services/room-service';

@Component({
  selector: 'app-friend-profile-page',
  imports: [CommonModule],
  templateUrl: './friend-profile-page.html',
  styleUrl: './friend-profile-page.scss'
})
export class FriendProfilePage {
  private route = inject(ActivatedRoute);
  private friendsService = inject(FriendsService);
  private roomService = inject(RoomService);

  profile: FriendProfile | null = null;

  ngOnInit(): void {
    const username = this.route.snapshot.paramMap.get('username');
    if (!username) return;
    this.friendsService.getProfile(username).subscribe(profile => this.profile = profile);
  }

  joinLobby(): void {
    if (this.profile?.currentRoomCode) {
      this.roomService.joinRoom(this.profile.currentRoomCode);
    }
  }
}
