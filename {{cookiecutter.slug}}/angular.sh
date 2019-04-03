ng new {{cookiecutter.slug}}
rm -rf frontend
mv {{cookiecutter.slug}} frontend
mv angular/proxy.conf.json fronted
mv angular/package.json .
rm -r angular
rm angular.sh backbone.sh
