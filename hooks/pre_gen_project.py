# slug cannot contain dash, spaces or dots
# as these are not allowed in python module names
{{ cookiecutter.update({"slug": cookiecutter.slug.replace('.', '_').replace(' ', '_').replace('-', '_')}) }}

