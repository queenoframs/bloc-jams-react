import React, { Component } from 'react';
import albumData from './../data/albums';
import PlayerBar from './PlayerBar';

class Album extends Component {
 constructor(props) {
   super(props);

 const album = albumData.find( album => {
   return album.slug === this.props.match.params.slug
 });

 this.state = {
   album: album,
   currentSong: undefined,
   currentTime: 0,
   duration: album.songs[0].duration,
   isPlaying: false,
   currentVolume: 0
 };

 this.audioElement = document.createElement('audio');
 this.audioElement.src = album.songs[0].audioSrc;
}

componentDidMount() {
  this.eventListeners = {
    timeupdate: e => {
      this.setState({ currentTime: this.audioElement.currentTime });
    },
    durationchange: e => {
        this.setState({ duration: this.audioElement.duration });
      },
    volumecontrol: e => {
        this.setState({ volume: this.audioElement.currentVolume })
    }
    };

  this.audioElement.addEventListener('timeupdate', this.eventListeners.timeupdate);
  this.audioElement.addEventListener('durationchange', this.eventListeners.durationchange);
  this.audioElement.addEventListener('volumecontrol', this.eventListeners.volumecontrol)
}

componentWillUnmount() {
  this.audioElement.src = null;
  this.audioElement.removeEventListener('timeupdate', this.eventListeners.timeupdate);
  this.audioElement.removeEventListener('durationchange', this.eventListeners.durationchange);
  this.audioElement.removeEventListener('volumecontrol', this.eventListeners.volumecontrol);
}

 play() {
   this.audioElement.play();
   this.setState({ isPlaying: true });
 }

 pause() {
   this.audioElement.pause();
   this.setState({ isPlaying: false });
 }

 setSong(song) {
   this.audioElement.src = song.audioSrc;
   this.setState({ currentSong: song });
 }

 handleSongClick(song) {
   const isSameSong = this.state.currentSong === song;
   if (this.state.isPlaying && isSameSong) {
     this.pause();
   } else {
     if (!isSameSong) { this.setSong(song); }
     this.play();
   }
 }

 handlePrevClick(){
   const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
   const newIndex = Math.max(0, currentIndex - 1);
   const newSong = this.state.album.songs[newIndex];
   this.setSong(newSong);
   this.play();
 }

 handleNextClick(){
   const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
   const newIndex = Math.min(this.state.album.songs.length - 1, currentIndex + 1);
   const newSong = this.state.album.songs[newIndex];
   this.setSong(newSong);
   this.play(newSong);
 }

 handleTimeChange(e) {
   const newTime = this.audioElement.duration * e.target.value;
   this.audioElement.currentTime = newTime;
   this.setState({ currentTime: newTime });
 }

 formatTime(seconds) {
   if (isNaN(seconds)) { return "-:--"; }
   const completeSeconds = Math.floor(seconds);
   const minutes = Math.floor(completeSeconds / 60);
   const remainingSeconds = completeSeconds % 60;
   let output = minutes + ':';
   if (remainingSeconds < 10) {
     output += '0';
   }
   output += remainingSeconds;
   return output;
 }

 handleVolumeControl(e) {
   const newVolume = e.target.value;
   this.audioElement.volume = newVolume;
   this.setState({ volume: newVolume })
 }

 handleHover(song) {
   this.setState({ hover: song });
 }

 handleHoverOff(song) {
   this.setState({ hover: false })
 }

 render() {

   return (
     <section className="album">
       <section id="album-info">
         <img id="album-cover-art" src={this.state.album.albumCover} alt={this.state.album.title}/>
         <div className="album-details">
           <h1 id="album-title">{this.state.album.title}</h1>
           <h2 className="artist">{this.state.album.artist}</h2>
           <div id="release-info">{this.state.album.releaseInfo}</div>
         </div>
       </section>
       <table id="song-list">
         <colgroup>
           <col id="song-number-column" />
           <col id="song-title-column" />
           <col id="song-duration-column" />
         </colgroup>
         <tbody>
         {this.state.album.songs.map( (song, index) =>
           <tr className="song" key={index} onClick={() => this.handleSongClick(song)} onMouseEnter={() => this.handleHover(song)} onMouseLeave={() => this.handleHoverOff(song)} >
             {
               this.state.isPlaying && this.state.currentSong === song ? ( <button><span className="ion-md-pause"></span></button> )
                : this.state.hover === song ? ( <button><span className="ion-md-play"></span></button> )
                : this.state.currentSong === song ? ( <button><span className="ion-md-play"></span></button> )
                : (<td className="song-number">{song.number}{index + 1}</td>)
             }

             <td className="song-title">{song.title}</td>
             <td className="song-duration">{this.formatTime(song.duration)}</td>
           </tr>
         )}
         </tbody>
       </table>
       <PlayerBar
         isPlaying={this.state.isPlaying}
         currentSong={this.state.currentSong}
         currentTime={this.audioElement.currentTime}
         duration={this.audioElement.duration}
         handleSongClick={() => this.handleSongClick(this.state.currentSong)}
         handlePrevClick={() => this.handlePrevClick()}
         handleNextClick={() => this.handleNextClick()}
         handleTimeChange={(e) => this.handleTimeChange(e)}
         handleVolumeControl={(e) => this.handleVolumeControl(e)}
         formatTime={(e) => this.formatTime(e)}
         />
     </section>
   );
 }
}

export default Album;
