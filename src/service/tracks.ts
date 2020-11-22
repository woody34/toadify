import { mockService } from "./mock";
import { BaseData } from "./service";
import faker from "faker";

export type TrackData = BaseData & {
  title: string;
  description: string;
  duration: number;
  image: string;
  url: string;
};

export const mockTrack = (): TrackData => ({
  _id: faker.random.uuid(),
  title: faker.hacker.phrase(),
  description: faker.lorem.sentence(),
  duration: faker.random.number(7200),
  image: faker.random.image(),
  url: faker.internet.url()
});

export const mockTracks: TrackData[] = Array(50)
  .fill(0)
  .map(mockTrack);

export const trackService = mockService(mockTracks);
