# Makefile for managing AWS Lambda layers and CloudFormation stack

STACK_NAME := DynamoNextGen
LAYER_DIRS := $(wildcard lambda-layers/*)

# What is .PHONY?
# .PHONY is a special directive in make that marks a target as not corresponding to an actual file. This prevents make from confusing it with a file of the same name.

.PHONY: build-layers
build-layers:
	@for dir in ./lambda-layers/*; do \
		if [ -d "$$dir" ]; then \
			if [ -f "$$dir/requirements.txt" ]; then \
				echo "Processing $$dir"; \
				pip3 install \
					--platform manylinux2014_aarch64 \
					-r "$$dir/requirements.txt" \
					-t "$$dir/python/lib/python3.9/site-packages" \
					--python-version 3.9 \
					--only-binary=:all:; \
			else \
				echo "Skipping $$dir (no requirements.txt found)"; \
			fi \
		fi; \
	done
	@echo "✅ Built all layers successfully."


.PHONY: clear-layers
clear-layers:
	@for dir in $(LAYER_DIRS); do \
		rm -rf $$dir/python; \
	done
	@echo "Cleared all Python dependencies from layers."


.PHONY: re-build-layers
re-build-layers: clear-layers build-layers


.PHONY: delete-stack
	@read -p "Are you sure you want to delete $(STACK_NAME)? [Y/n]: " confirm; \
	if [ "$$confirm" = "Y" ] || [ "$$confirm" = "y" ] || [ -z "$$confirm" ]; then \
		echo "Deleting CloudFormation stack $(STACK_NAME)..."; \
		aws cloudformation delete-stack --stack-name $(STACK_NAME); \
	else \
		echo "Aborted."; \
	fi


.PHONY: deploy-apis
deploy-apis:
	sam build --template-file templates/functions_template.yaml
	sam deploy --template-file templates/functions_template.yaml


.PHONY: deploy-opensearch
deploy-opensearch:
	aws cloudformation deploy \
		--stack-name $(STACK_NAME)-opensearch \
		--template-file templates/opensearch_template.yaml \
		--capabilities CAPABILITY_NAMED_IAM


.PHONY: stream-function-logs
stream-function-logs:
	aws logs tail /aws/lambda/dng--$(FN) --follow


.PHONY: clear-opensearch
clear-opensearch:
	curl -X DELETE "https://search-dynamo-next-gen-opensearch-6ac5oloug2ysx4lqt72mbdvv5e.eu-central-1.es.amazonaws.com/resume-jobs-data-index" \
		-u user:StrongPassword123!

