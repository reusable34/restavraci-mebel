import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './sanity/schemaTypes';

// Жестко заданные значения для Studio
const projectId = '143zykun';
const dataset = 'production';

export default defineConfig({
  name: 'default',
  title: 'Provintazh CMS',
  projectId,
  dataset,
  plugins: [structureTool(), visionTool()],
  schema: {
    types: schemaTypes
  }
});


