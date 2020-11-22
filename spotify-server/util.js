const spotifyTrackToTrackData = spotData => {
  const data = {
    _id: spotData.track.id,
    title: spotData.track.name || "unknown",
    album: spotData.track.album.name || "unknown",
    duration: spotData.track.duration_ms,
    image: spotData.track.album.images[0].url,
    url: spotData.track.external_urls.spotify,
    addedBy: (spotData.added_by && spotData.added_by.id) || "unknown",
    uri: spotData.track.album.uri,
    trackUri: spotData.track.uri
  };
  return data;
};

module.exports = { spotifyTrackToTrackData };
