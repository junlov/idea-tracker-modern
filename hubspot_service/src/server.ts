import express, { Express, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";

dotenv.config();

import bodyParser from "body-parser";
import { hubspotClient } from "./hubspotClient";
import {
  Property,
  PropertyCreate,
  PropertyGroup,
} from "@hubspot/api-client/lib/codegen/crm/properties";

// const webhookRouter = require("./webhooks");

const app: Express = express();
const apiRouter = express.Router();

app.use(bodyParser.json());

type Contacts = {
  id: number;
  properties: Object;
  createdAt: Date;
  updatedAt: Date;
  archived: boolean;
};

apiRouter.get(
  "/contacts/:accessToken",
  async (req: Request, res: Response, next: NextFunction) => {
    const { accessToken } = req.params;
    hubspotClient.setAccessToken(accessToken);

    try {
      const getAllContacts = async () => {
        const pageOfContacts = await hubspotClient.crm.contacts.getAll();

        // console.log(
        // "🚀 ~ file: server.ts:38 ~ pageOfContacts.results:",
        // pageOfContacts.results
        // );
      };

      const allContacts = await getAllContacts();
      res.status(200).send(allContacts);
    } catch (err) {
      next(err);
    }
  }
);

apiRouter.post(
  "/contacts/create/:accessToken",
  async (req: Request, res: Response, next: NextFunction) => {
    const { accessToken } = req.params;
    // console.log("🚀 ~ file: server.ts:60 ~ req.params:", req.params);

    hubspotClient.setAccessToken(accessToken);
    const contactsToCreate = req.body;

    // console.log("🚀 ~ file: server.ts:62 ~ req.body:", req.body);

    const inputs = contactsToCreate.map((contact) => {
      return {
        properties: {
          num_ideas_submitted: contact.numIdeasSubmitted,
          faction_rank: contact.rank,
          email: contact.email,
          firstname: contact.firstName,
          lastname: contact.lastName,
        },
      };
    });
    try {
      const createResponse = await hubspotClient.crm.contacts.batchApi.create({
        inputs,
      });
      // console.log(
      // "🚀 ~ file: server.ts:83 ~ createResponse.results:",
      // createResponse.results
      // );
      res.send(createResponse.results);
    } catch (err) {
      next(err);
    }
  }
);
apiRouter.post(
  "/contacts/update/:accessToken",
  async (req: Request, res: Response, next: NextFunction) => {
    const { accessToken } = req.params;
    hubspotClient.setAccessToken(accessToken);
    const contactsToUpdate = req.body;
    const inputs = contactsToUpdate.map((contact) => {
      return {
        id: contact.hubspotContactId,
        properties: {
          num_ideas_submitted: contact.numIdeasSubmitted,
          faction_rank: contact.rank,
        },
      };
    });

    try {
      const updateResponse = await hubspotClient.crm.contacts.batchApi.update({
        inputs,
      });
      // console.log(
      // "🚀 ~ file: server.ts:109 ~ updateResponse.results:",
      // updateResponse.results
      // );
      res.send(updateResponse.results);
    } catch (err) {
      next(err);
    }
  }
);

apiRouter.put(
  "/contacts/update-one/:accessToken",
  async (req: Request, res: Response, next: NextFunction) => {
    const { accessToken } = req.params;
    hubspotClient.setAccessToken(accessToken);
    const contactToUpdate = req.body;
    try {
      console.log("will attempt to update", contactToUpdate);
      res.send("Ok");
    } catch (err) {
      next(err);
    }
  }
);

apiRouter.get(
  "/companies/create-or-update/:faction/:accessToken",
  async (req: Request, res: Response, next: NextFunction) => {
    const { faction, accessToken } = req.params;
    hubspotClient.setAccessToken(accessToken);
    const searchCriteria = {
      filterGroups: [
        {
          filters: [{ propertyName: "domain", operator: "EQ", value: faction }],
        },
      ],
    };
    try {
      const companiesByDomain =
        await hubspotClient.crm.companies.searchApi.doSearch(searchCriteria);
      if (companiesByDomain.results.length > 0) {
        res.send(companiesByDomain.results[0]);
      } else {
        const newCompany = await hubspotClient.crm.companies.basicApi.create({
          properties: { domain: faction },
        });
        res.send(newCompany.properties);
      }
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
);

apiRouter.get(
  "/properties/:accessToken",
  async (req: Request, res: Response, next: NextFunction) => {
    const { accessToken } = req.params;

    const propertyGroupInfo: PropertyGroup = {
      name: "ideatrackergroup",
      displayOrder: -1,
      label: "Idea Tracker Group",
      archived: false,
    };

    const createProperty = async (groupName: string) => {
      const inputs: Array<PropertyCreate> = [
        {
          groupName,
          type: "number",
          label: "Number of Ideas Submitted",
          fieldType: "number",
          name: "num_ideas_submitted",
        },
        {
          groupName,
          type: "string",
          label: "Faction Rank",
          fieldType: "text",
          name: "faction_rank",
        },
      ];
      try {
        return await hubspotClient.crm.properties.batchApi.create("contacts", {
          inputs,
        });
      } catch (err) {
        next(err);
      }
    };
    hubspotClient.setAccessToken(accessToken);

    const checkForPropInfo = async () => {
      const existingPropertyGroups =
        await hubspotClient.crm.properties.groupsApi.getAll("contacts");

      const groupExists = existingPropertyGroups.results.find(
        (group) => group.name === propertyGroupInfo.name
      );
      if (groupExists) {
        const getAllExistingProperties = async (startingProperties) => {
          const pageOfProperties =
            await hubspotClient.crm.properties.coreApi.getAll(
              "contacts",
              false
            );

          const endingProperties = startingProperties.concat(
            pageOfProperties.results
          );

          if (pageOfProperties.paging) {
            return await getAllExistingProperties(endingProperties);
          } else return endingProperties;
        };

        const allProperties = await getAllExistingProperties([]);
        const existingProperties = allProperties.filter(
          (property: Property) => {
            property.name === "faction_rank" ||
              property.name === "num_ideas_submitted";
          }
        );

        console.log(existingProperties);

        if (existingProperties.length === 0) {
          await createProperty(propertyGroupInfo.name);
          res.send("Properties Created");
        } else {
          res.send("Properties Already Existed");
        }
      } else {
        try {
          const groupResponse =
            await hubspotClient.crm.properties.groupsApi.create(
              "contacts",
              propertyGroupInfo
            );
          const propertiesResponse = await createProperty(
            propertyGroupInfo.name
          );
          res.send(propertiesResponse);
        } catch (err) {
          next(err);
        }
      }
    };

    checkForPropInfo();
  }
);

apiRouter.post(
  "/timeline/:accessToken",
  async (req: Request, res: Response, next: NextFunction) => {
    const { idea } = req.body;
    const { accessToken } = req.params;
    hubspotClient.setAccessToken(accessToken);
    const timelineEvent = {
      eventTemplateId: "1227539",
      objectId: idea.author.hubspotContactId,
      tokens: {
        idea_title: idea.title,
        idea_detail: idea.detail,
      },
    };
    console.log("sending timeline event", timelineEvent);
    try {
      await hubspotClient.crm.timeline.eventsApi.create(timelineEvent);
      res.send("ok");
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
);

app.use("/api", apiRouter);

// app.use("/webhook", webhookRouter);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).send(err.toString());
});

console.log("process environment", process.env.NODE_ENV);
app.listen(process.env.PORT || 8081, () => {
  console.log("hubspot_service", process.env.PORT || 8081);
});
