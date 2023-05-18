import express, { Router } from "express";
import { exec } from "child_process";
import { PythonShell } from "python-shell";

const testRouter: Router = express.Router();

testRouter.post("/abc", async (req, res, next) => {
  const responseBody = {
    version: "2.0",
    template: {
      outputs: [
        {
          itemCard: {
            imageTitle: {
              title: "DOFQTK",
              description: "Boarding Number",
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
              title: "AA Airline",
              imageUrl:
                "https://t1.kakaocdn.net/openbuilder/docs_image/aaairline.jpg",
            },
            itemList: [
              {
                title: "Flight",
                description: "KE0605",
              },
              {
                title: "Boards",
                description: "8:50 AM",
              },
              {
                title: "Departs",
                description: "9:50 AM",
              },
              {
                title: "Terminal",
                description: "1",
              },
              {
                title: "Gate",
                description: "C24",
              },
            ],
            itemListAlignment: "right",
            itemListSummary: {
              title: "Total",
              description: "$4,032.54",
            },
            buttons: [
              {
                label: "View Boarding Pass",
                action: "webLink",
                webLinkUrl: "https://namu.wiki/w/%EB%82%98%EC%97%B0(TWICE)",
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

testRouter.get("/generate-docx", async (req, res, next) => {
  const deposit = 1000000;
  const end_date = "2023년 12월 31일";
  const home_address = "주소 입력";

  // Child Process를 사용하여 파이썬 코드 실행
  exec(
    "python docx_generator.py " +
      deposit +
      ' "' +
      end_date +
      '" "' +
      home_address +
      '"',
    (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return res.status(500).send("Internal Server Error");
      }

      // 파이썬 코드 실행 결과 출력
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);

      // 결과 파일을 클라이언트로 전송
      res.sendFile("/Users/kwontaehyun/Desktop/chat-bot/output.docx");
    }
  );
});

export { testRouter };
