# This file was generated by @liquid-labs/catalyst-builder-workflow-local-make-
# node. Refer to https://npmjs.com/package/@liquid-labs/catalyst-builder-workflow-
# local-make-node for further details

#####
# build dist/liq-orgs.js
#####

CATALYST_LIQ_ORGS_JS:=$(DIST)/liq-orgs.js
CATALYST_LIQ_ORGS_JS_ENTRY=$(SRC)/index.js
BUILD_TARGETS+=$(CATALYST_LIQ_ORGS_JS)

$(CATALYST_LIQ_ORGS_JS): package.json $(CATALYST_ALL_NON_TEST_JS_FILES_SRC)
	JS_BUILD_TARGET=$(CATALYST_LIQ_ORGS_JS_ENTRY) \
	  JS_OUT=$@ \
	  $(CATALYST_ROLLUP) --config $(CATALYST_ROLLUP_CONFIG)

#####
# end dist/liq-orgs.js
#####
