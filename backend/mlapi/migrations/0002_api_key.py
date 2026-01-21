from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("mlapi", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="ApiKey",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("provider", models.CharField(max_length=50, unique=True)),
                ("key", models.CharField(max_length=255)),
                ("is_active", models.BooleanField(default=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
        ),
    ]
