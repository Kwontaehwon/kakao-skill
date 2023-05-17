from docx import Document

deposit = 1000000 
end_date = "2023년 12월 31일"
home_address = "주소 입력"

# 문서 파일 로드
document = Document("template.docx") 

# 변수 값을 문서에 적용
for paragraph in document.paragraphs:
    if "[deposit]" in paragraph.text:
        paragraph.text = paragraph.text.replace("[deposit]", str(deposit))
    if "[end_date]" in paragraph.text:
        paragraph.text = paragraph.text.replace("[end_date]", end_date)
    if "[home_address]" in paragraph.text:
        paragraph.text = paragraph.text.replace("[home_address]", home_address)

document.save("output.docx")