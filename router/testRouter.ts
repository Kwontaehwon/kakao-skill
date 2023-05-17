import express, { Router } from "express";

const testRouter: Router = express.Router();

testRouter.post("/abc", async (req, res, next) => {
  const responseBody = {
    version: "2.0",
    template: {
      outputs: [
        {
          simpleText: {
            text: "hello I'm Ryan",
          },
        },
      ],
    },
  };

  res.status(200).send(responseBody);
});

export { testRouter };
