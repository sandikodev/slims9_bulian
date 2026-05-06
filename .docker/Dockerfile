FROM php:8.2-apache

RUN apt-get update && apt-get install -y --no-install-recommends \
    unzip curl libpng-dev libjpeg-dev libfreetype6-dev \
    libzip-dev libicu-dev libonig-dev mariadb-client gettext-base \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
        gd mysqli pdo pdo_mysql zip intl bcmath opcache gettext \
    && a2enmod rewrite headers remoteip \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# DocumentRoot ke /slims agar URL bersih
RUN sed -i 's|DocumentRoot /var/www/html|DocumentRoot /var/www/html/slims|' \
        /etc/apache2/sites-available/000-default.conf \
    && sed -i 's|<Directory /var/www/>|<Directory /var/www/html/slims/>|' \
        /etc/apache2/apache2.conf \
    && sed -i '/AllowOverride None/{s/None/All/}' /etc/apache2/apache2.conf

# Installer: disable open_basedir + no-cache headers
RUN echo '<Directory /var/www/html/slims/install>\n\
    php_admin_value open_basedir none\n\
    Header set Cache-Control "no-store, no-cache, must-revalidate"\n\
</Directory>' >> /etc/apache2/sites-available/000-default.conf

COPY .docker/php.ini /usr/local/etc/php/conf.d/slims-dev.ini

EXPOSE 80
