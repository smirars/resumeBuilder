from app.database import SessionLocal, engine, Base
from app.models import Template, BlockType, TemplateBlock  # noqa: F401 — registers models


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    if db.query(BlockType).count() > 0:
        print("Database already seeded.")
        db.close()
        return

    block_types = [
        BlockType(name="photo", display_name="Фотография", default_config={"fields": ["url"]}),
        BlockType(
            name="contacts",
            display_name="Контактная информация",
            default_config={"fields": ["name", "email", "phone", "location", "website"]},
        ),
        BlockType(name="summary", display_name="О себе", default_config={"fields": ["text"]}),
        BlockType(
            name="experience",
            display_name="Опыт работы",
            default_config={"fields": ["company", "position", "start_date", "end_date", "description"]},
        ),
        BlockType(
            name="education",
            display_name="Образование",
            default_config={"fields": ["institution", "degree", "year"]},
        ),
        BlockType(name="skills", display_name="Навыки", default_config={"fields": ["items"]}),
        BlockType(name="languages", display_name="Языки", default_config={"fields": ["items"]}),
        BlockType(
            name="projects",
            display_name="Проекты",
            default_config={"fields": ["name", "description", "url"]},
        ),
    ]
    db.add_all(block_types)
    db.flush()

    bt = {b.name: b for b in block_types}

    # --- Template 1: Classic ---
    t1 = Template(
        name="Классическое",
        description="Чистый и профессиональный шаблон для любой отрасли",
        available_colors=["#2563eb", "#16a34a", "#dc2626", "#7c3aed", "#0f172a"],
    )
    db.add(t1)
    db.flush()

    db.add_all([
        TemplateBlock(
            template_id=t1.id, block_type_id=bt["contacts"].id, position=0, is_removable=False,
            default_content={"name": "Иван Иванов", "email": "ivan@example.com",
                             "phone": "+7 900 000-00-00", "location": "Москва"},
        ),
        TemplateBlock(
            template_id=t1.id, block_type_id=bt["summary"].id, position=1, is_removable=True,
            default_content={"text": "Опытный специалист с многолетним стажем в своей области. "
                                     "Нацелен на результат, умею работать в команде."},
        ),
        TemplateBlock(
            template_id=t1.id, block_type_id=bt["experience"].id, position=2, is_removable=True,
            default_content={"items": [
                {"company": "Компания А", "position": "Старший разработчик",
                 "start_date": "2020-01", "end_date": "", "description": "Разработка и поддержка веб-приложений."},
            ]},
        ),
        TemplateBlock(
            template_id=t1.id, block_type_id=bt["education"].id, position=3, is_removable=True,
            default_content={"items": [
                {"institution": "МГУ им. Ломоносова", "degree": "Бакалавр информатики", "year": "2020"},
            ]},
        ),
        TemplateBlock(
            template_id=t1.id, block_type_id=bt["skills"].id, position=4, is_removable=True,
            default_content={"items": ["Python", "FastAPI", "PostgreSQL", "Docker"]},
        ),
    ])

    # --- Template 2: Modern ---
    t2 = Template(
        name="Современное",
        description="Стильный шаблон с фотографией для творческих профессий",
        available_colors=["#0f172a", "#1e40af", "#065f46", "#7c2d12", "#4c1d95"],
    )
    db.add(t2)
    db.flush()

    db.add_all([
        TemplateBlock(
            template_id=t2.id, block_type_id=bt["photo"].id, position=0, is_removable=True,
            default_content={"url": ""},
        ),
        TemplateBlock(
            template_id=t2.id, block_type_id=bt["contacts"].id, position=1, is_removable=False,
            default_content={"name": "Мария Петрова", "email": "maria@example.com",
                             "phone": "+7 900 000-00-01", "location": "Санкт-Петербург"},
        ),
        TemplateBlock(
            template_id=t2.id, block_type_id=bt["summary"].id, position=2, is_removable=True,
            default_content={"text": "Креативный специалист с опытом в дизайне и UX/UI."},
        ),
        TemplateBlock(
            template_id=t2.id, block_type_id=bt["skills"].id, position=3, is_removable=True,
            default_content={"items": ["Figma", "Adobe XD", "Photoshop", "Illustrator"]},
        ),
        TemplateBlock(
            template_id=t2.id, block_type_id=bt["experience"].id, position=4, is_removable=True,
            default_content={"items": [
                {"company": "Дизайн-студия Б", "position": "UI/UX Дизайнер",
                 "start_date": "2021-03", "end_date": "", "description": "Проектирование интерфейсов."},
            ]},
        ),
        TemplateBlock(
            template_id=t2.id, block_type_id=bt["education"].id, position=5, is_removable=True,
            default_content={"items": [
                {"institution": "СПбГУ", "degree": "Магистр дизайна", "year": "2021"},
            ]},
        ),
        TemplateBlock(
            template_id=t2.id, block_type_id=bt["languages"].id, position=6, is_removable=True,
            default_content={"items": ["Русский (родной)", "Английский (B2)"]},
        ),
    ])

    # --- Template 3: Minimal ---
    t3 = Template(
        name="Минималистичное",
        description="Лаконичный шаблон для технических специалистов",
        available_colors=["#111827", "#374151", "#1e3a5f", "#14532d", "#431407"],
    )
    db.add(t3)
    db.flush()

    db.add_all([
        TemplateBlock(
            template_id=t3.id, block_type_id=bt["contacts"].id, position=0, is_removable=False,
            default_content={"name": "Алексей Сидоров", "email": "alex@example.com",
                             "phone": "+7 900 000-00-02", "location": "Новосибирск",
                             "website": "github.com/alexsidorov"},
        ),
        TemplateBlock(
            template_id=t3.id, block_type_id=bt["experience"].id, position=1, is_removable=True,
            default_content={"items": [
                {"company": "Tech Corp", "position": "Senior Backend Developer",
                 "start_date": "2019-06", "end_date": "", "description": "Разработка высоконагруженных сервисов."},
            ]},
        ),
        TemplateBlock(
            template_id=t3.id, block_type_id=bt["skills"].id, position=2, is_removable=True,
            default_content={"items": ["Go", "Python", "Docker", "Kubernetes", "PostgreSQL", "Redis"]},
        ),
        TemplateBlock(
            template_id=t3.id, block_type_id=bt["education"].id, position=3, is_removable=True,
            default_content={"items": [
                {"institution": "НГТУ", "degree": "Бакалавр прикладной математики", "year": "2019"},
            ]},
        ),
        TemplateBlock(
            template_id=t3.id, block_type_id=bt["projects"].id, position=4, is_removable=True,
            default_content={"items": [
                {"name": "Open Source CLI Tool", "description": "Утилита для автоматизации деплоя.",
                 "url": "github.com/alexsidorov/cli-tool"},
            ]},
        ),
    ])

    db.commit()
    print("Database seeded successfully with 3 templates!")
    db.close()


if __name__ == "__main__":
    seed()
