"""
Set the address and name of the Site based on settings

The Site model is used as context when rendering emails by django-allauth,
so setting this ensures the domain is shown correctly.

See https://docs.djangoproject.com/en/5.0/ref/contrib/sites/#enabling-the-sites-framework
"""

from django.db import migrations
from django.conf import settings


def update_site_domain(apps, schema_editor):
    Site = apps.get_model("sites", "Site")
    s, _ = Site.objects.get_or_create(pk=settings.SITE_ID)
    s.domain = settings.HOST
    s.name = settings.SITE_NAME
    s.save()


class Migration(migrations.Migration):

    dependencies = [
        ("user", "0002_email_for_existing_users"),
    ]

    operations = [
        migrations.RunPython(
            code=update_site_domain,
            reverse_code=migrations.RunPython.noop,
        )
    ]
