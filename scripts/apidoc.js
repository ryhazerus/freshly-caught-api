const path = require('path');
const apidoc = require('apidoc');

const doc = apidoc.createDoc({
  src: path.resolve('./routes'),
  dest: path.resolve('./apidocs'),
});

if (typeof doc !== 'boolean') {
  console.log(doc.data); // `api_data.json` file content
  console.log(doc.project); // `api_project.json` file content
}
