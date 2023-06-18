#! /bin/bash
rm -rf /tmp/api.json /tmp/api-types ./src/types/api-types
curl http://localhost:3005/api-json > /tmp/api.json
npx @openapitools/openapi-generator-cli generate -i /tmp/api.json -g typescript-angular -o /tmp/api-types --skip-validate-spec --additional-properties=stringEnums=true --type-mappings=set=Array
mv /tmp/api-types/model ./src/types/api-types
mv ./src/types/api-types/models.ts ./src/types/api-types/index.ts
find ./src/types/api-types -type f -exec sed -i '' -e 's/interface/class/g' {} \;
find ./src/types/api-types -type f -exec sed -i '' -e 's/\/\*\*/\/\* eslint-disable \*\/ \'$'\n\/\*/' {}  \;
