import express, { Router } from "express";

const testRouter: Router = express.Router();

testRouter.post("/abc", async (req, res, next) => {
  console.log(JSON.stringify(req.body, null, 2));
  console.log(req.body.contexts[0].params)

  const deposit = 1000000;
  const end_date = "2023년 12월 31일";
  const home_address = "주소 입력";

  const responseBody = {
    "version": "2.0",
    "template": {
        "outputs": [
            {
                "itemCard": {
                    "imageTitle": {
                        "title": "지급 명령서",
                        "description": "Lawbot 자동 생성 문서"
                    },
                    "title": "",
                    "description": "",
                    "thumbnail": {
                        "imageUrl": "http://dev-mk.kakao.com/dn/bot/scripts/with_barcode_blue_1x1.png",
                        "width": 800,
                        "height": 800
                    },
                    "profile": {
                        "title": "LawBot",
                        "imageUrl": "https://t1.kakaocdn.net/openbuilder/docs_image/aaairline.jpg"
                    },
                    "itemList": [
                        {
                            "title": "보증금",
                            "description": deposit
                        },
                        {
                          "title": "주소",
                          "description": home_address
                        },
                        {
                            "title": "임대차 계약 종료 일자",
                            "description": end_date
                        },
                    ],
                    "itemListAlignment" : "right",
                    "itemListSummary": {
                        "title": "보증금",
                        "description": deposit
                    },
                    "buttons": [
                        {
                            "label": "다운로드",
                            "action": "webLink",
                            "webLinkUrl": "https://lawbot.framer.website/"
                        }
                    ],
                    "buttonLayout" : "vertical"
                }
            }
        ]
    }
}
  res.status(200).send(responseBody);
});

export { testRouter };
