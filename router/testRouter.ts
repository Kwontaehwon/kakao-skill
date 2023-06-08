import express, { Response, Router } from "express";
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const testRouter: Router = express.Router();

const generateHash = (str: string) => {
  const hash = crypto.createHash("md5").update(str).digest("hex");
  return hash;
};

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
  console.log(req.body.contexts[0].params["deposit"]);

  const params = req.body.contexts[0].params;

  const deposit = 1000000;
  const end_date = "2023년 12월 31일";
  const home_address = "주소 입력";

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

testRouter.get("/generateDocx", async (req, res, next) => {
  const deposit = 1000000;
  const end_date = "2023년 12월 31일";
  const home_address = "주소 입력";
  const curDate = Date.now().toString();

  const hash = generateHash(curDate);

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

      const currentFileName = "output.docx"; // 현재 파일 이름
      const newFileName = `output_${hash}.docx`; // 새로운 파일 이름
      const currentFilePath = path.join(__dirname, "../", currentFileName); // 현재 파일 경로
      const newFilePath = path.join(
        __dirname,
        "../generatedDocx/",
        newFileName
      ); // 새로운 파일 경로

      fs.rename(currentFilePath, newFilePath, (err) => {
        if (err) {
          console.error("파일 이름 변경 실패:", err);
        } else {
          console.log("파일 이름 변경 성공:");
        }
      });

      // 결과 파일을 클라이언트로 전송
      success(res, 200, "파일명 반환", newFileName);
    }
  );
});

export { testRouter };
