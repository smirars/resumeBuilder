import os
import shutil
import tempfile
import pdfkit
from jinja2 import Environment, FileSystemLoader
from app.models.resume import Resume

_TEMPLATES_DIR = os.path.join(os.path.dirname(__file__), "..", "templates")

if os.name == "nt":
    _WKHTMLTOPDF = r"C:\Program Files\wkhtmltopdf\bin\wkhtmltopdf.exe"
else:
    _WKHTMLTOPDF = shutil.which("wkhtmltopdf") or "/usr/bin/wkhtmltopdf"


def generate_pdf(resume: Resume) -> str:
    env = Environment(loader=FileSystemLoader(_TEMPLATES_DIR))
    template = env.get_template("resume_base.html")

    html = template.render(blocks=resume.blocks_data, color=resume.color, font=resume.font or "Arial")

    tmp = tempfile.NamedTemporaryFile(suffix=".pdf", delete=False)
    tmp.close()

    config = pdfkit.configuration(wkhtmltopdf=_WKHTMLTOPDF)
    options = {
        "page-size": "A4",
        "margin-top": "0",
        "margin-right": "0",
        "margin-bottom": "0",
        "margin-left": "0",
        "encoding": "UTF-8",
        "enable-local-file-access": "",
    }
    pdfkit.from_string(html, tmp.name, options=options, configuration=config)

    return tmp.name
