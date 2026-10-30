export interface Song {
  id: string;
  title: string;
  album: string;
  releaseYear: number;
  duration: string;
  isTitleTrack: boolean;
  mood: string;
}

export type NewSong = Omit<Song, "id">;