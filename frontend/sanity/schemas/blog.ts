import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'blog',
  type: 'document',
  title: 'Blog',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'author',
      type: 'reference',
      title: 'Author',
      to: [{type: 'author'}],
    }),
    defineField({
      name: 'category',
      type: 'reference',
      title: 'Category',
      to: [{type: 'category'}],
    }),
    defineField({
      name: 'readTime',
      type: 'string',
      title: 'Read Time',
    }),
    defineField({
      name: 'image',
      type: 'image',
      title: 'Image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
        }),
        defineField({
          name: 'caption',
          type: 'string',
          title: 'Caption',
        }),
        defineField({
          name: 'imageLink',
          type: 'url',
          title: 'Image Link (Optional)',
        }),
      ],
    }),
    defineField({
      name: 'short_description',
      type: 'text',
      title: 'Short Description',
    }),
    defineField({
      name: 'content',
      type: 'array',
      title: 'Content',
      of: [
        defineField({
          type: 'block',
          name: 'block',
        }),
        defineField({
          name: 'mainImage',
          type: 'image',
          title: 'Image',
          options: {hotspot: true},
          fields: [
            defineField({
              name: 'alt',
              type: 'string',
              title: 'Alternative Text',
            }),
            defineField({
              name: 'caption',
              type: 'string',
              title: 'Caption',
            }),
            defineField({
              name: 'imageLink',
              type: 'url',
              title: 'Image Link (Optional)',
            }),
          ],
        }),
        defineField({
          name: 'table',
          type: 'table',
          title: 'Table',
          options: {
            layout: 'grid',
          },
        }),
        defineField({
          name: 'dynamicTable',
          type: 'object',
          title: 'Dynamic Table',
          description:
            'Create and configure a table with customizable rows, columns, and rich text content in each cell',
          fields: [
            defineField({
              name: 'rows',
              type: 'number',
              title: 'Number of Rows',
              description:
                'Set how many rows your table should have (e.g., 3 for a table with 3 rows)',
              initialValue: 3,
              validation: (Rule) => Rule.required().min(1).max(20),
            }),
            defineField({
              name: 'columns',
              type: 'number',
              title: 'Number of Columns',
              description:
                'Set how many columns your table should have (e.g., 3 for a table with 3 columns)',
              initialValue: 3,
              validation: (Rule) => Rule.required().min(1).max(10),
            }),
            defineField({
              name: 'cells',
              title: 'Cells',
              description:
                'Add and edit content for each cell in your table. Each cell can contain formatted text, links, and other rich content',
              type: 'array',
              of: [
                defineField({
                  name: 'cell',
                  type: 'object',
                  fields: [
                    defineField({
                      name: 'row',
                      type: 'number',
                      title: 'Row',
                      description: 'The row number for this cell (starts from 0)',
                      validation: (Rule) => Rule.required(),
                    }),
                    defineField({
                      name: 'column',
                      type: 'number',
                      title: 'Column',
                      description: 'The column number for this cell (starts from 0)',
                      validation: (Rule) => Rule.required(),
                    }),
                    defineField({
                      name: 'content',
                      title: 'Cell Content',
                      description:
                        'The content of this cell. You can add text, format it, add links, and more using the rich text editor',
                      type: 'array',
                      of: [
                        defineField({
                          type: 'block',
                          name: 'block',
                        }),
                      ],
                    }),
                  ],
                  preview: {
                    select: {
                      row: 'row',
                      column: 'column',
                      content: 'content',
                    },
                    prepare({row, column, content}) {
                      return {
                        title: `Cell (${row}, ${column})`,
                        subtitle:
                          content?.[0]?.children?.map((child: any) => child.text).join(' ') || '',
                      }
                    },
                  },
                }),
              ],
            }),
          ],
          preview: {
            select: {
              rows: 'rows',
              columns: 'columns',
            },
            prepare({rows, columns}) {
              return {
                title: `Table ${rows}×${columns}`,
              }
            },
          },
        }),
      ],
    }),
  ],
})
