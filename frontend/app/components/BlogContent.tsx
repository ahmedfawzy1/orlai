import Image from 'next/image';
import { PortableText } from 'next-sanity';
import { urlFor } from '../lib/sanity';

const components = {
  types: {
    image: ({ value }: any) => {
      return (
        <div className='my-8'>
          <Image
            src={urlFor(value).url()}
            alt={value.alt || ''}
            width={750}
            height={750}
            className='rounded-lg'
          />
          {value.caption && (
            <p className='text-center text-gray-600 mt-2'>{value.caption}</p>
          )}
        </div>
      );
    },
    table: ({ value }: any) => {
      return (
        <div className='my-8 overflow-x-auto'>
          <table className='min-w-full border-collapse border border-gray-300'>
            <tbody>
              {value.rows.map((row: any, rowIndex: number) => (
                <tr key={rowIndex}>
                  {row.cells.map((cell: any, cellIndex: number) => (
                    <td key={cellIndex} className='border border-gray-300 p-4'>
                      <PortableText value={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    },
    dynamicTable: ({ value }: any) => {
      const { rows, columns, cells } = value;
      const tableData = Array(rows)
        .fill(null)
        .map(() => Array(columns).fill(null));

      cells.forEach((cell: any) => {
        const { row, column, content } = cell;
        if (tableData[row] && tableData[row][column] !== undefined) {
          tableData[row][column] = content;
        }
      });

      return (
        <div className='my-8 overflow-x-auto'>
          <table className='min-w-full border-collapse border border-gray-300'>
            <tbody>
              {tableData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className='border border-gray-300 p-4'>
                      {cell ? <PortableText value={cell} /> : ''}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    },
  },
};

export default function BlogContent({ content }: { content: any }) {
  return <PortableText value={content} components={components} />;
}
