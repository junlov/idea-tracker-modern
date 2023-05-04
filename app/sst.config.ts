import { SSTConfig } from "sst";
import { usersApi } from "./stacks/Api";

export default {
  config(_input) {
    return {
      name: "app",
      region: "us-east-1",
    };
  },
  stacks(app) {
    app.stack(usersApi);
  },
} satisfies SSTConfig;
