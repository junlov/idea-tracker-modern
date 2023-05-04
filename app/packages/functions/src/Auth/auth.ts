import { AuthHandler, GoogleAdapter, Session } from "sst/node/auth";
import { Users } from "@app/core/database/models/Users.model";
import { _userAction } from "@app/core/actions/User.actions";
import { connectToDatabase } from "@app/core/database/connection";

export const handler = AuthHandler({
  providers: {
    google: GoogleAdapter({
      mode: "oidc",
      clientID:
        "970045203782-t2am7oqdth0mtpbk4mis1gfv877uqkvd.apps.googleusercontent.com",
      onSuccess: async (tokenset) => {
        const claims = tokenset.claims();

        if (typeof claims.email !== "string") {
          throw new Error("No email");
        }

        await connectToDatabase();

        let exists: any = await _userAction.fromEmail(claims.email);

        if (!exists) {
          exists = await _userAction.create(claims.email);
        }

        // Redirects to https://example.com?token=xxx
        return Session.cookie({
          redirect: "https://zas111w4li.execute-api.us-east-1.amazonaws.com",
          type: "user",
          properties: {
            userID: exists.id,
          },
        });
      },
    }),
  },
});

declare module "sst/node/auth" {
  export interface SessionTypes {
    user: {
      userID: string | undefined;
      // For a multi-tenant setup
      // tenantID: string
    };
  }
}
