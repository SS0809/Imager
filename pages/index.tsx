import type { NextPage } from "next";
import Head from "next/head";
import Image, { getImageProps } from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import Bridge from "../components/Icons/Bridge";
import Logo from "../components/Icons/Logo";
import Modal from "../components/Modal";
import type { ImageProps } from "../utils/types";
import { useLastViewedPhoto } from "../utils/useLastViewedPhoto";
import path from 'path';
import fs from 'fs/promises';

const Home: NextPage = ({ images }: { images: ImageProps[] }) => {
  const router = useRouter();
  const { photoId } = router.query;
  const [lastViewedPhoto, setLastViewedPhoto] = useLastViewedPhoto();

  const lastViewedPhotoRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    // This effect keeps track of the last viewed photo in the modal to keep the index page in sync when the user navigates back
    if (lastViewedPhoto && !photoId) {
      lastViewedPhotoRef.current.scrollIntoView({ block: "center" });
      setLastViewedPhoto(null);
    }
  }, [photoId, lastViewedPhoto, setLastViewedPhoto]);

  return (
    <>
      <Head>
        <title>Photos</title>
        <meta
          property="og:image"
          content="https://ss0809.github.io/test/docs/0.jpg"
        />
      </Head>
      <main className="mx-auto max-w-[1960px] p-4">
        {photoId && (
          <Modal
            images={images}
            onClose={() => {
              setLastViewedPhoto(photoId);
            }}
          />
        )}
        <div className="columns-1 gap-4 sm:columns-2 xl:columns-3 2xl:columns-4">
          <div className="after:content relative mb-5 flex h-[629px] flex-col items-center justify-end gap-4 overflow-hidden rounded-lg bg-white/10 px-6 pb-16 pt-64 text-center text-white shadow-highlight after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight lg:pt-0">
            <div className="absolute inset-0 flex items-center justify-center opacity-20">
              <span className="flex max-h-full max-w-full items-center justify-center">
                <Bridge />
              </span>
              <span className="absolute left-0 right-0 bottom-0 h-[250px] bg-gradient-to-b from-black/0 via-black to-black"></span>
              <span className="absolute left-0 right-0 top-0 h-[150px] bg-gradient-to-b from-black via-black to-black/0"></span>
            </div>
            <Logo />
            <h3 className="mt-8 mb-8 text-base font-bold uppercase tracking-widest">
              2023 -- 2024 Photos
            </h3>
            <p className="max-w-[40ch] text-white/85 sm:max-w-[32ch]">
              Our incredible , In-person Storage!
            </p>
          </div>
          {images.map(({ id, public_id}) => (
            <Link
              key={id}
              href={`${public_id}`}
              as={`/p/${id}`}
              ref={id === Number(lastViewedPhoto) ? lastViewedPhotoRef : null}
              shallow
              className="after:content group relative mb-5 block w-full cursor-zoom-in after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight"
            >
              <Image
                alt="Next.js Conf photo"
                className="transform rounded-lg brightness-90 transition will-change-auto group-hover:brightness-110"
                style={{ transform: "translate3d(0, 0, 0)" }}
                src={`/`+ process.env.FOLDER_NAME +`/${public_id}`}
                width={720}
                height={480}
                sizes="(max-width: 640px) 100vw,
                  (max-width: 1280px) 50vw,
                  (max-width: 1536px) 33vw,
                  25vw"
              />
            </Link>
          ))}
        </div>
      </main>
      <footer className="p-6 text-center text-white/80 sm:p-12">
        Thank you to{" "}
        <a
          href="https://github.com/ss0809"
          target="_blank"
          className="font-semibold hover:text-white"
          rel="noreferrer"
        >
          Saurabh Saraswat
        </a>{" "}
        for the pictures.
      </footer>
    </>
  );
};

export default Home;

export async function getStaticProps() {
  try {
    
  const filePath = path.join(process.cwd(), 'public/'+ process.env.FOLDER_NAME +'/list.txt');

  const response = await fs.readFile(filePath, 'utf-8');
     const filenames = response.trim().split('\n');

    // Transform filenames into the desired format
    const transformedData = filenames.map((filename, index) => ({
      id: index,
      public_id: filename.trim(),
    }));

    return {
    props: {
      images: transformedData,
    },
  };
  } catch (error) {
    console.error('Error fetching image list:', error);
    throw error;
  }
}