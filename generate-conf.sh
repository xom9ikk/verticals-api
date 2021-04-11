sudo certbot certonly --standalone -d $1 --staple-ocsp -m xom9ik.code@gmail.com --agree-tos

# add this to http {} in /etc/nginx/nginx.conf
# limit_conn_zone $binary_remote_addr zone=conn_limit_per_ip:10m;
# limit_req_zone $binary_remote_addr zone=req_limit_per_ip:10m rate=50r/s;
# limit_conn_zone $binary_remote_addr zone=conn_limit_per_ip_verticals_backend:10m;
# limit_req_zone $binary_remote_addr zone=req_limit_per_ip_verticals_backend:10m rate=50r/s;

echo "server {
        server_name $1;
        client_max_body_size 10M;
        gzip_static on;
        gunzip on;
" > /etc/nginx/sites-enabled/$1.conf
if [ "$3" = true ] ; then
  echo "location / {
            root $2;
            limit_req zone=req_limit_per_ip burst=50 nodelay;
            limit_conn conn_limit_per_ip 30;
        }
" >> /etc/nginx/sites-enabled/$1.conf
else
  echo "location / {
            proxy_pass http://$2;
            proxy_http_version 1.1;
            proxy_set_header Upgrade \$http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host \$host;
            proxy_cache_bypass \$http_upgrade;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Real-IP \$remote_addr;
            limit_req zone=req_limit_per_ip_verticals_backend burst=50 nodelay;
            limit_conn conn_limit_per_ip_verticals_backend 30;
        }
" >> /etc/nginx/sites-enabled/$1.conf

fi
echo "
        listen 443 ssl http2; # managed by Certbot
        ssl_certificate /etc/letsencrypt/live/$1/fullchain.pem; # managed by Certbot
        ssl_certificate_key /etc/letsencrypt/live/$1/privkey.pem; # managed by Certbot
        include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
        ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
}" >> /etc/nginx/sites-enabled/$1.conf
echo "server {
  server_name $1;
  listen 80;
  listen [::]:80;
  return 301 https://\$host\$request_uri;
}" >> /etc/nginx/sites-enabled/$1.conf
