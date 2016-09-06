phpLDAPadmin integration with LPC
=================================

This webapp for the application module integrates the phpLDAPadmin
(running on `localhost:6443`) user interface into the management
console (a.k.a. WebUI).

## Overview ##

Implements the alternative method enabling access to the stand-alone
[phpLDAPadmin][p] web user interface via a button that opens the interface
into another web browser window.

The webapp is built with [Node.js][n], serving the HTTP requests
made by the management console to load the static UI integration
(layout, model and JavaScript) files.

  [p]: https://hub.docker.com/r/osixia/phpldapadmin/
  [n]: https://nodejs.org

The webapp exposes TCP port 8079.

## Containerization ##

The webapp for integrating user interface should reside in its own
container, as should other parts of the application. To enable access
to application module resources, the containers may need to be run in
the _host_ network mode.

## Native Installation ##

The webapp can alternatively be installed and run "natively" on the
host; either by copying the source as-is to the host, or by installing
a sanitized copy, possibly into a staging area first.

To run the webapp, a Ubuntu host is assumed with `nodejs` and `nodejs-legacy`
packages installed. For installing a sanitized copy, `make` and `jq` packages
are additionally required.

Run the following command to install:

    # make install

`DESTDIR` may be specified for installing into a staging area:

    # make install DESTDIR=/path/to/staging

Upstart script is also installed to auto-start the application on system
boot.

## Nginx Proxy Configuration ##

The webapp simply navigates to '/phpldapadmin/'; additional Nginx proxy
directives are needed for it to work. Add the following content into file
`/srv/config/nginx.d/ldap-admin.conf`:

    # LDAP admin UI
    location /custom/phpldapadmin/ {
        proxy_pass https://127.0.0.1:6443/;
    }

## License ##

The webapp is Copyright (C) 2016 Teleste Corporation.

The webapp is provided as-is, solely for the purpose of being example
source code, not meant for production.

The example app uses Node.js built-in libraries and external node modules,
licensed under their own licenses. See the README.md files in their respective
directories.
