const PARSER_VECTOR_INDEX_NAME = process.env.PARSER_VECTOR_INDEX_NAME;
const URL = process.env.URL;

if (!PARSER_VECTOR_INDEX_NAME || !URL) {
  console.error("Required environment variables are missing.");
  if (!PARSER_VECTOR_INDEX_NAME) {
    console.error(" - PARSER_VECTOR_INDEX_NAME is not set.");
  }
  if (!URL) {
    console.error(" - URL is not set.");
  }
  process.exit(1);
}
console.log("PARSER_VECTOR_INDEX_NAME:", PARSER_VECTOR_INDEX_NAME);
console.log("URL:", URL);
