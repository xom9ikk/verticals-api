sudo certbot certonly --standalone -d $1 --staple-ocsp -m xom9ik.code@gmail.com --agree-tos
echo "server {
        server_name $1;
        client_max_body_size 10M;
        gzip_static on;
        gunzip on;
        location / {
            proxy_pass http://$2;
            proxy_http_version 1.1;
            proxy_set_header Upgrade \$http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host \$host;
            proxy_cache_bypass \$http_upgrade;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Real-IP \$remote_addr;
        }
        listen 443 ssl http2; # managed by Certbot
        ssl_certificate /etc/letsencrypt/live/$1/fullchain.pem; # managed by Certbot
        ssl_certificate_key /etc/letsencrypt/live/$1/privkey.pem; # managed by Certbot
        include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
        ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
}
server {
  server_name $1;
  listen 80;
  listen [::]:80;
  return 301 https://\$host\$request_uri;
}" >> /etc/nginx/sites-enabled/$1.conf
