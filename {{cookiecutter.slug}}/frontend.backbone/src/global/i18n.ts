import { Deferred } from 'jquery';
import * as i18next from 'i18next';
import * as languageDetector from 'i18next-browser-languagedetector';
{% set localizations = cookiecutter.localizations.split(',') %}
{%- for loc in localizations %}
{%- set code, name = loc.split(':') %}
import * as {{name}} from '../i18n/{{code}}.json';
{%- endfor %}

const deferred = Deferred();
const i18nPromise = deferred.promise();

i18next.use(
    languageDetector
).init({
    resources: {
    {%- for loc in localizations %}
        {% set code, name = loc.split(':') -%}
        {{code}}: {
            translation: {{name}},
        },{% endfor %}
    },
}, function(error, t) {
    if (error) {
        deferred.reject(error);
    } else {
        deferred.resolve(i18next);
    }
});

export { i18nPromise, i18next };
