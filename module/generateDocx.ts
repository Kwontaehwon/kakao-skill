import { exec } from "child_process";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const generateHash = (str: string) => {
  const hash = crypto.createHash("md5").update(str).digest("hex");
  return hash;
};

const generateDocx = async (
  deposit: string,
  end_date: string,
  home_address: string
) => {
  const curDate = Date.now().toString();

  const hash = generateHash(curDate);

  // Child Process를 사용하여 파이썬 코드 실행
  exec(
    "python3 docx_generator.py " +
      deposit +
      ' "' +
      end_date +
      '" "' +
      home_address +
      '"',
    (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
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
      console.log(newFileName);

      return newFileName;
    }
  );
};

export { generateDocx };
