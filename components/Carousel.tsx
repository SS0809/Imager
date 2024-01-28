import Image from "next/image";
import { useRouter } from "next/router";
import useKeypress from "react-use-keypress";
import type { ImageProps } from "../utils/types";
import { useLastViewedPhoto } from "../utils/useLastViewedPhoto";
import SharedModal from "./SharedModal";

export default function Carousel({
  index,
  currentPhoto,
  images
}: {
  index: number;
  currentPhoto: ImageProps;
  images: any;
}) {
  const router = useRouter();
  const [, setLastViewedPhoto] = useLastViewedPhoto();


  function closeModal() {
    setLastViewedPhoto(currentPhoto.id);
    //router.push("/", undefined, { shallow: true });
        window.location.href = '/';
  }



  function changePhotoId(newVal: number) {
      window.location.href = `${newVal}`;
   // return newVal;
  }

  useKeypress("Escape", () => {
    closeModal();
  });
  useKeypress("ArrowLeft", () => {
    if(index > 0)
    changePhotoId(index - 1);
  });
  useKeypress("ArrowRight", () => {
    if(index + 1 < images.length)
    changePhotoId(index + 1);
  });

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <button
        className="absolute inset-0 z-30 cursor-default bg-black backdrop-blur-2xl"
        onClick={closeModal}
      >
        <Image
          src={currentPhoto.public_id}
          className="pointer-events-none h-full w-full blur"
          alt="blurred background"
          fill
          priority={true}
        />
      </button>
      <SharedModal
        index={index}
        images={images}//suggested
        changePhotoId={changePhotoId}
        currentPhoto={currentPhoto}
        closeModal={closeModal}
        navigation={true}
      />
    </div>
  );
}
