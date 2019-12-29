# epi.today

what's on the calendar today at epitech?

## maintenance

A maintenance page can be found on the repo (`maintenance.html`) which is a file to be rendered when the application is not available.

## nginx

A nginx configuration file example can be found on the repo (`nginx.conf`), with a reverse proxy to the application and a maintenance page to `$document_root/epi.today.maintenance.html`. On most systems `$document_root` is located at `/usr/share/nginx/html/`.

To activate the maintenance mode, simply copy the maintenance file to `/usr/share/nginx/epi.today.maintenance.html`. Remove the file when you are done with the maintenance.

## deploy

It's recommended to use a daemon to keep the server alive. For epi.today, the daemon [pm2](https://pm2.keymetrics.io) is used.
After compiling the TypeScript code, run `pm2 start build/app.js --name=epi.today` to launch the application with pm2.

To start the application with pm2 at system startup, run `pm2 startup` to get more information.
