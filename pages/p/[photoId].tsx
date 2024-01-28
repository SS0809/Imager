import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import Carousel from "../../components/Carousel";
import getResults from "../../utils/cachedImages";
import type { ImageProps } from "../../utils/types";
import path from 'path';
import fs from 'fs/promises';

const Home: NextPage = ({ currentPhoto, paths }: { currentPhoto: ImageProps, paths: any[] }) => {
  const router = useRouter();
  const { photoId } = router.query;
  let index = Number(photoId);

  const currentPhotoUrl = `${currentPhoto}`;

  return (
    <>
      <Head>
        <title>Photos</title>
        <meta property="og:image" content={currentPhotoUrl} />
      </Head>
      <main className="mx-auto max-w-[1960px] p-4">
        <Carousel currentPhoto={currentPhoto} index={index} images={paths} />
      </main>
    </>
  );
};


export default Home;

export const getStaticProps: GetStaticProps = async (context) => {
  const results = await getResults();

  let reducedResults: ImageProps[] = [];
  let i = 0;
  for (let result of results.props.images) {
    reducedResults.push({
      id: i,
      public_id: result.public_id,
    });
    i++;
  }
  
  const filePath = path.join(process.cwd(), 'public/'+ process.env.FOLDER_NAME +'/list.txt');

  const response = await fs.readFile(filePath, 'utf-8');
     const filenames = response.trim().split('\n');
     const transformedData = filenames.map((filename, index) => ({
      id: index,
      public_id: '/' + process.env.FOLDER_NAME + '/' + filename.trim(),
    }));
    
  const currentPhoto = reducedResults.find(
    (img) => img.id === Number(context.params.photoId),
  );
  return {
    props: {
      currentPhoto: currentPhoto,
      paths: transformedData,
    },
  };
};


export async function getStaticPaths() {
  try {

    const filePath = path.join(process.cwd(), 'public/'+ process.env.FOLDER_NAME +'/list.txt');

    const response = await fs.readFile(filePath, 'utf-8');
    const filenames = response.trim().split('\n');

    // Transform filenames into the desired format
    const transformedData = filenames.map((filename, index) => ({
      params: { photoId: index.toString()},
    }));

    return {
    paths: transformedData,
    fallback: false,
  };
  } catch (error) {
    console.error('Error fetching image list:', error);
    throw error;
  }
}

