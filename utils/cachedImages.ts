import path from 'path';
import fs from 'fs/promises';

let cachedResults;

export default async function getResults() {
  if (!cachedResults) {
    try {
      
  
  const filePath = path.join(process.cwd(), 'public/'+ process.env.FOLDER_NAME +'/list.txt');
  const response = await fs.readFile(filePath, 'utf-8');
      const filenames = response.trim().split('\n');
      const transformedData = filenames.map((filename, index) => ({
        id: index,
        public_id: '/'+ process.env.FOLDER_NAME +'/'+filename.trim(),
      }));

      cachedResults = {
        props: {
          images: transformedData,
        },
      };
    } catch (error) {
      console.error('Error fetching image list:', error);
      throw error;
    }
  }

  return cachedResults;
}
