import {
  toTypedRxJsonSchema,
  ExtractDocumentTypeFromTypedRxJsonSchema,
  RxJsonSchema,
} from 'rxdb';

const TodoSchemaLiteral = {
  version: 0,
  title: 'todo',
  description: 'A simple todo schema',
  primaryKey: 'id', // <= the primary key is must
  type: 'object',
  properties: {
    id: {
      type: 'string',
      maxLength: 100, // <- the primary key must have set maxLength
    },
    title: {
      type: 'string',
    },
    description: {
      type: 'string',
    },
    done: {
      type: 'boolean',
    },
  },
  required: ['title', 'description'],
} as const;

const schemaTyped = toTypedRxJsonSchema(TodoSchemaLiteral);

// aggregate the document type from the schema
export type TodoDocType = ExtractDocumentTypeFromTypedRxJsonSchema<
  typeof schemaTyped
>;

// create the typed RxJsonSchema from the literal typed object.
export const TodoSchema: RxJsonSchema<TodoDocType> = TodoSchemaLiteral;
