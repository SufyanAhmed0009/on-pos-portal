FROM nginx:1.17-alpine
COPY /dist/october-pos /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/
