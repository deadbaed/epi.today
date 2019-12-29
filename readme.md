# epi.today

what's on the calendar today at epitech?

## maintenance

A maintenance page can be found on the repo (`maintenance.html`) which is a file to be rendered when the application is not available.

## nginx

A nginx configuration file example can be found on the repo (`nginx.conf`), with a reverse proxy to the application and a maintenance page to `$document_root/epi.today.maintenance.html`. `$document_root` is a link to nginx's default root, which on most systems (i think) is located at `/usr/share/nginx/html/`.
