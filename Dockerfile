FROM nginx
COPY . /usr/share/nginx/html/bio
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Fix permissions during build
RUN chmod -R 755 /usr/share/nginx/html/bio
RUN find /usr/share/nginx/html/bio -type f -exec chmod 644 {} \;
