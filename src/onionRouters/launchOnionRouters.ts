import { simpleOnionRouter } from "./simpleOnionRouter";
import { Server } from "http";

export async function launchOnionRouters(n: number): Promise<Server[]> {
  const promises = [];
  for (let index = 0; index < n; index++) {
    promises.push(simpleOnionRouter(index));
  }
  return Promise.all(promises) as Promise<Server[]>;
}