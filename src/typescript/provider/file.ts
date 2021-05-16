function getPlaylist(files: FilePlaylistItem[]): Promise<Song[]> {
    return new Promise((resolve) => {
        let songs: FileSong[] = [];
        for (let item of files) {
            let artists = item.artists.join(", ");
            if (!item.thumbnail) {
                (<any>item).noThumbnail = true;
                item.thumbnail = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='currentColor' d='M14,2L20,8V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V4A2,2 0 0,1 6,2H14M18,20V9H13V4H6V20H18M13,10V12H11V17A2,2 0 0,1 9,19A2,2 0 0,1 7,17A2,2 0 0,1 9,15C9.4,15 9.7,15.1 10,15.3V10H13Z' /%3E%3C/svg%3E";
            }
            songs.push(<FileSong>{
                provider: "file",
                ...item,
                artists,
            });
        }
        resolve(songs);
    });
}

function getUrl(song: FileSong): Promise<string> {
    return new Promise((resolve) => resolve(song.url));
}

export default <FileProvider>{
    type: "file",
    getPlaylist, getUrl
}