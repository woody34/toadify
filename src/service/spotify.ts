import { AxiosResponse } from "axios";
import { BaseData, makeBaseService, makeHttp } from "./service";
import { PlayerState } from "@/store/";

const spotifyRoute = "http://localhost:18080/api/spotify";

export type TrackData = BaseData & {
  title: string;
  album: string;
  duration: number;
  image: string;
  url: string;
  addedBy: string;
  uri: string;
  trackUri: string;
};

export const spotifyAuthService = {
  http: makeHttp<any>(spotifyRoute),
  async login() {
    return this.http.get("/login");
  },
  async connected() {
    return this.http.get("/connected");
  }
};

const playerRoute = `${spotifyRoute}/player`;

export const spotifyPlayerService = {
  ...makeBaseService<TrackData>(playerRoute),
  state() {
    return (this.http.get("/state") as unknown) as Promise<
      AxiosResponse<PlayerState>
    >;
  },
  play(uri: string) {
    return this.http.get(`/play/${uri}`);
  },
  pause() {
    return this.http.get("/pause");
  }
};
