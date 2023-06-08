import sys
from docx import Document

def generate_docx(deposit, end_date, home_address) : 
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

    print("GENERATED DONE") 


if __name__ == '__main__':
    generate_docx(sys.argv[1], sys.argv[2], sys.argv[3])