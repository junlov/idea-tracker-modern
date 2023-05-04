import { AuthHandler, GoogleAdapter, Session } from "sst/node/auth";
import { Users } from "@app/core/database/models/Users.model";

export const handler = AuthHandler({
  providers: {
    google: GoogleAdapter({
      mode: "oidc",
      clientID:
        "970045203782-t2am7oqdth0mtpbk4mis1gfv877uqkvd.apps.googleusercontent.com",
      onSuccess: async (tokenset) => {
        const claims = tokenset.claims();
        const user = await Users.find({
          email: claims.email,
        });

        // Redirects to https://example.com?token=xxx
        return Session.parameter({
          redirect: "https://zas111w4li.execute-api.us-east-1.amazonaws.com",
          type: "client",
          properties: {
            clientId: user?.id,
          },
        });
      },
    }),
  },
});

declare module "sst/node/auth" {
  export interface SessionTypes {
    client: {
      clientId: string | undefined;
      // For a multi-tenant setup
      // tenantID: string
    };
  }
}
