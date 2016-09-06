# Makefile for lpc-ldap-server/web-app

PACKAGE = lpc-ldap-server
LIBDIR = usr/lib/nodejs

SRCDIRS = lib models routes
EXTRAFILES = README.md

.DEFAULT: all
all:

DIR = ./
SRC = *.js $(SRCDIRS)
include node_modules/make-jshint/index.mk

.PHONY: check
check: lint

$(DESTDIR)/etc/lpc-ldap-server.conf: config/production.conf
	mkdir -p $(dir $@)
	install -m 0644 $< $@

$(DESTDIR)/srv/config/nginx.d/ldap-admin.conf: config/nginx.conf
	mkdir -p $(dir $@)
	install -m 0644 $< $@

.PHONY: $(DESTDIR)/etc/init
$(DESTDIR)/etc/init: $(wildcard initscripts/*.conf)
	mkdir -p $@
	install -m 0644 -t $@ $^

.PHONY: $(DESTDIR)/$(LIBDIR)/$(PACKAGE)
$(DESTDIR)/$(LIBDIR)/$(PACKAGE): $(wildcard *.js) $(wildcard *.json)
	mkdir -p $@
	install -m 0644 -t $@ $^

.PHONY: $(DESTDIR)/$(LIBDIR)/$(PACKAGE)/public
$(DESTDIR)/$(LIBDIR)/$(PACKAGE)/public:
	mkdir -p $@
	cp -a -t $(dir $@) $(notdir $@)

.PHONY: $(DESTDIR)/$(LIBDIR)/$(PACKAGE)/node_modules
$(DESTDIR)/$(LIBDIR)/$(PACKAGE)/node_modules: package.json
	mkdir -p $@
	cp -a -t $@ $(addprefix node_modules/,\
            $(shell jq '.dependencies?|keys|join(" ")' $< | tr -d [\"]))

define SRCDIR_template
.PHONY: $(DESTDIR)/$(LIBDIR)/$(PACKAGE)/$(1)
$(DESTDIR)/$(LIBDIR)/$(PACKAGE)/$(1): $(wildcard $(1)/*.js) $(wildcard $(1)/*.json)
	mkdir -p $$@
	install -m 0644 -t $$@ $$^
endef

define EXTRAFILE_template
$(DESTDIR)/$(LIBDIR)/$(PACKAGE)/$(1): $(1)
	install -m 0644 $$^ $$@
endef

$(foreach sd,$(SRCDIRS),$(eval $(call SRCDIR_template,$(sd))))
$(foreach ef,$(EXTRAFILES),$(eval $(call EXTRAFILE_template,$(ef))))

.PHONY: install
install: $(DESTDIR)/etc/lpc-ldap-server.conf \
    $(DESTDIR)/srv/config/nginx.d/ldap-admin.conf \
    $(DESTDIR)/etc/init \
    $(DESTDIR)/$(LIBDIR)/$(PACKAGE) \
    $(DESTDIR)/$(LIBDIR)/$(PACKAGE)/public \
    $(DESTDIR)/$(LIBDIR)/$(PACKAGE)/node_modules \
    $(addprefix $(DESTDIR)/$(LIBDIR)/$(PACKAGE)/,$(SRCDIRS)) \
    $(addprefix $(DESTDIR)/$(LIBDIR)/$(PACKAGE)/,$(EXTRAFILES))

.PHONY: clean
clean:

DISTRIBUTE_INST_DIR=.install
DISTRIBUTE_TARBALL=$(PACKAGE).tar.gz
DISTRIBUTE_LOGIN?=root
DISTRIBUTE_HOST?=myluminato-ip-address
.PHONY: distribute
distribute:
	mkdir -p $(DISTRIBUTE_INST_DIR)
	$(RM) -r $(DISTRIBUTE_INST_DIR)/*
	$(MAKE) install DESTDIR=$(shell pwd)/$(DISTRIBUTE_INST_DIR)
	tar -cvzf $(DISTRIBUTE_TARBALL) -C $(DISTRIBUTE_INST_DIR) .
	scp $(DISTRIBUTE_TARBALL) $(DISTRIBUTE_LOGIN)@$(DISTRIBUTE_HOST):/mnt/user/

.PHONY: distclean
distclean:
	$(RM) -r $(DISTRIBUTE_INST_DIR)
	$(RM) $(DISTRIBUTE_TARBALL)
