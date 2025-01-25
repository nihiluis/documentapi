import openapiTS, { astToString } from "openapi-typescript"
import ts from "typescript"
import fs from "node:fs"

const BLOB = ts.factory.createTypeReferenceNode(
  ts.factory.createIdentifier("Blob")
) // `Blob`
const NULL = ts.factory.createLiteralTypeNode(ts.factory.createNull()) // `null`

const ast = await openapiTS(new URL("./filestore.yaml", import.meta.url), {
  transform(schemaObject, metadata) {
    if (schemaObject.format === "binary") {
      return schemaObject.nullable
        ? ts.factory.createUnionTypeNode([BLOB, NULL])
        : BLOB
    }
  },
})
const contents = astToString(ast)

fs.writeFileSync(new URL("./filestore.ts", import.meta.url), contents)
