import { user } from "./user";
import { Server } from "http";

export async function launchUsers(n: number): Promise<Server[]> {
  const promises = [];
  for (let index = 0; index < n; index++) {
    promises.push(user(index));
  }
  return Promise.all(promises) as Promise<Server[]>;
}