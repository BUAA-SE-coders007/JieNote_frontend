sudo mkdir -p /var/www/html/jienote
sudo cp -r /root/frontend/JieNote_frontend/dist/* /var/www/html/jienote/
sudo chown -R www-data:www-data /var/www/html/jienote
sudo chmod -R 755 /var/www/html/jienote