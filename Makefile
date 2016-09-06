# Makefile for lpc-ldap-server

PACKAGE = lpc-ldap-server
SUBDIRS = web-app

.DEFAULT: all
all:

%:
	@for d in $(SUBDIRS); do \
            $(MAKE) -C $$d $@; \
        done
