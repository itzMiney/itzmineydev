import {Component, AfterViewInit, signal} from '@angular/core';

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any;
  }
}

@Component({
  selector: 'app-audio-player',
  imports: [],
  templateUrl: './audio-player.component.html',
  styleUrl: './audio-player.component.css'
})
export class AudioPlayerComponent implements AfterViewInit {
  private player: any;
  isPlayerReady = signal(false);
  isPlaying = signal(false);
  nowPlayingTitle = signal<string>('');

  ngAfterViewInit() {
    if (window.YT && window.YT.Player) {
      this.createPlayer();
    } else {
      window.onYouTubeIframeAPIReady = () => this.createPlayer();
    }
  }

  createPlayer() {
    this.player = new window.YT.Player('youtube-player', {
      height: '0', // or something minimal
      width: '0',
      playerVars: {
        listType: 'playlist',
        list: 'PLukBTTWD2ebbIa_RDec_razIHz6e6Wh8b',
        autoplay: 0,
        controls: 0,
      },
      events: {
        onReady: () => {
          this.isPlayerReady.set(true);
          console.log('YouTube Player Ready');

          const iframe = document.getElementById('youtube-player') as HTMLIFrameElement | null;
          if (iframe) {
            iframe.style.width = '0px';
            iframe.style.height = '0px';
            iframe.style.opacity = '0';
            iframe.style.pointerEvents = 'none';
            iframe.style.position = 'absolute';
            iframe.style.zIndex = '-1';
          }

          this.updateNowPlayingTitle();
        },
        onStateChange: (event: any) => {
          if (event.data === window.YT.PlayerState.PLAYING) {
            this.updateNowPlayingTitle();
          }
        }
      }
    });
  }

  updateNowPlayingTitle() {
    if (this.player) {
      const videoData = this.player.getVideoData();
      this.nowPlayingTitle.set(videoData.title);
    }
  }

  playVideo() {
    if (this.isPlayerReady() && this.player?.playVideo) {
      this.player.playVideo();
      this.isPlaying.set(true);
    }
  }

  pauseVideo() {
    if (this.isPlayerReady() && this.player?.pauseVideo) {
      this.player.pauseVideo();
      this.isPlaying.set(false);
    }
  }

  togglePlayPause() {
    if (!this.isPlayerReady()) return;

    if (this.isPlaying()) {
      this.pauseVideo();
    } else {
      this.playVideo();
    }
  }

  nextVideo() {
    if (this.isPlayerReady() && this.player?.nextVideo) {
      this.player.nextVideo();
    }
  }

  previousVideo() {
    if (this.isPlayerReady() && this.player?.previousVideo) {
      this.player.previousVideo();
    }
  }
}
