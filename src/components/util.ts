import { TrackData } from "@/service/spotify";

export const headers = [
  {
    value: "image",
    text: "Image",
    sortable: false
  },
  {
    value: "duration",
    text: "Duration",
    width: 100
  },
  {
    value: "title",
    text: "Title"
  },
  {
    value: "album",
    text: "Album"
  },
  {
    value: "addedBy",
    text: "Contributor"
  }
];

export const filterDuration = (item: TrackData) =>
  new Date(item.duration * 1000).toISOString().substr(11, 5);
