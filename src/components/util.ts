import { TrackData } from "@/service/tracks";

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
    value: "description",
    text: "Description"
  }
];
export const filterDuration = (item: TrackData) =>
  new Date(item.duration * 1000).toISOString().substr(11, 8);
