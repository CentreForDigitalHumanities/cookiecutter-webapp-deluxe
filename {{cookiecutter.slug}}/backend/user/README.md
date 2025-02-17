# Authentication

This document contains some documentation for managing and expanding the user system and authentication.

The backend handles authentication and email verification using [django-allauth](https://docs.allauth.org/en/latest/). The API is based on [dj-rest-auth](https://dj-rest-auth.readthedocs.io/en/latest/).

## The User model

The application implements a custom `User` model. Currently, this custom model is identical to the default Django `User`, but this is [recommended for longevity](https://docs.djangoproject.com/en/5.0/topics/auth/customizing/#using-a-custom-user-model-when-starting-a-project).

### Expanding the user model

If you need to add more fields for authentication, such as SAML login, you can expand the custom `User` model.

Other user-related data, such as personal preferences, content created by the user, a public profile, etc., is best handled by adding related models. Keeping your `User` model lightweight makes it easier to maintain and adapt your application in the future.

#### Adding a UserProfile

For things like personal preferences, which have a one-to-one relationship with users, it can be useful to add a `UserProfile` model.

Recommended steps for adding a UserProfile:

- Add a `UserProfile` model in Django, with a `OneToOneField` to `User`.
- In the migration that adds user profiles, add a data migration to add a profile for all existing users ([example of a UserProfile migration](https://github.com/UUDigitalHumanitieslab/I-analyzer/blob/c234b818cfa493c5f948b7acb7d8c8eba91626ad/backend/users/migrations/0004_userprofile.py))
- In the admin menu, you can use a `StackedInline` form to show profile options in the form for `User` ([example of admin with UserProfile](https://github.com/UUDigitalHumanitieslab/I-analyzer/blob/c234b818cfa493c5f948b7acb7d8c8eba91626ad/backend/users/admin.py)).
- Use a signal receiver to create a `UserProfile` for new users ([example of a signal receiver to add a user profile](https://github.com/UUDigitalHumanitieslab/I-analyzer/blob/c234b818cfa493c5f948b7acb7d8c8eba91626ad/backend/users/signals.py#L32-L37)). If this is the first signal in your users app, make sure to import the signals module in the configuration in `apps.py` ([example of signals import](https://github.com/UUDigitalHumanitieslab/I-analyzer/blob/c234b818cfa493c5f948b7acb7d8c8eba91626ad/backend/users/apps.py)).
- Depending on the function of your user profile, you may want to include it in the `UserDetailsSerializer`. (Alternatively, you could add it as a separate endpoint.) ([example of adding UserProfile as a nested serializer](https://github.com/UUDigitalHumanitieslab/I-analyzer/blob/c234b818cfa493c5f948b7acb7d8c8eba91626ad/backend/users/serializers.py))

## The EmailAddress model

`django-allauth` provides an EmailAddress model, which is used to manage user email addresses. EmailAddress has a many-to-many relationship with users (even if users can have only one email, this allows them to add a temporary second address when changing their email).

## Authentication

Users can log in and out via the frontend, the API (`/api`), and the admin interface, and stay logged in when they switch between these interfaces.

For this reason, the frontend client always requests the authentication state when starting a session. It should not persistently store the authentication state (e.g. using `localStorage`), as this can cause issues when the user logs out in the admin and then navigates to the frontend.

