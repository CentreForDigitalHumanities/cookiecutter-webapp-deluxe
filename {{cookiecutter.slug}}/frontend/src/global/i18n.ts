import { Deferred } from 'jquery';
import * as i18next from 'i18next';
import * as languageDetector from 'i18next-browser-languagedetector';
import Handlebars from 'handlebars/dist/handlebars.runtime';
import registerI18nHelper from 'handlebars-i18next';
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

/**
 * Handlebars helper allowing you to do {% raw %}{{i18n 'key'}}{% endraw %} in templates.
 *
 * See the README of the handlebars-i18next package for details.
 */
registerI18nHelper(Handlebars, i18next);

export { i18nPromise, i18next };
