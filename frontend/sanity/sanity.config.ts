import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {table} from '@sanity/table'
import {schema} from './schemaTypes/index'

export default defineConfig({
  name: 'default',
  title: 'lustria',

  projectId: 'd9mn4nio',
  dataset: 'production',

  plugins: [structureTool(), visionTool(), table()],

  schema: {
    types: schema,
  },
})
