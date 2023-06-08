import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const generateHash = async (str: string) => {
  const hash = crypto.createHash("md5").update(str).digest("hex");
  return hash;
};

const generateDocx = async (
  deposit: string,
  end_date: string,
  home_address: string
) => {
  const curDate = Date.now().toString();

  const hash = await generateHash(curDate);

  // Child Process를 사용하여 파이썬 코드 실행

  const result_01 = await spawn("python3", [
    "docx_generator.py",
    deposit,
    end_date,
    home_address,
  ]);

  await result_01.stdout.on("data", async (result) => {
    const currentFileName = "output.docx"; // 현재 파일 이름
    const newFileName = `output_${hash}.docx`; // 새로운 파일 이름
    const currentFilePath = path.join(__dirname, "../", currentFileName); // 현재 파일 경로
    const newFilePath = path.join(__dirname, "../generatedDocx/", newFileName); // 새로운 파일 경로

    await fs.rename(currentFilePath, newFilePath, (err) => {
      if (err) {
        console.error("파일 이름 변경 실패:", err);
      } else {
        console.log("파일 이름 변경 성공: " + newFileName);
        return newFileName;
      }

      // 결과 파일을 클라이언트로 전송
    });
  });
};

export { generateDocx, generateHash };
