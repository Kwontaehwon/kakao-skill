import express, { Response, Router } from "express";
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { generateDocx } from "../module/generateDocx";

const testRouter: Router = express.Router();

const success = (
  res: Response,
  code: number,
  message: string,
  result?: any
) => {
  const success_result = { code, success: true, message, result };
  return res.status(code).send(success_result);
};

const fail = (res: Response, code: number, message: string) => {
  const fail_result = { code, success: false, message };
  return res.status(code).send(fail_result);
};

testRouter.post("/abc", async (req, res, next) => {
  console.log(JSON.stringify(req.body, null, 2));
  const contextParam = req.body.contexts[0].params;

  const deposit = contextParam["deposit"].toString();
  const end_date = contextParam["end_date"].toString();
  const home_address = contextParam["home_address"].toString();

  const fileName = generateDocx(deposit, end_date, home_address);

  const responseBody = {
    version: "2.0",
    template: {
      outputs: [
        {
          itemCard: {
            imageTitle: {
              title: "지급명령서",
              description: "법률 문서 자동생성",
            },
            title: "",
            description: "",
            thumbnail: {
              imageUrl:
                "http://dev-mk.kakao.com/dn/bot/scripts/with_barcode_blue_1x1.png",
              width: 800,
              height: 800,
            },
            profile: {
              title: "LawBot",
              imageUrl:
                "https://t1.kakaocdn.net/openbuilder/docs_image/aaairline.jpg",
            },
            itemList: [
              {
                title: "임대차 종료 일자",
                description: end_date,
              },
              {
                title: "부동산",
                description: home_address,
              },
            ],
            itemListAlignment: "right",
            itemListSummary: {
              title: "보증금",
              description: deposit,
            },
            buttons: [
              {
                label: "다운로드 하기",
                action: "webLink",
                webLinkUrl: `http://13.125.20.89:3000/api/test/download?fileName=${fileName}`,
              },
            ],
            buttonLayout: "vertical",
          },
        },
      ],
    },
  };

  res.status(200).send(responseBody);
});

testRouter.get("/download", (req, res) => {
  const fileName = req.query.fileName;
  const filePath = `generatedDocx/${fileName}`; // Word 파일의 경로
  res.download(filePath, `${fileName}`, (err) => {
    if (err) {
      console.error("파일 다운로드 실패:", err);
      res.status(500).send("파일 다운로드에 실패했습니다.");
    }
  });
});

export { testRouter };
