import PhotoUploadForm from './PhotoUploadForm';

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function Page({ params }: any) {
  return <PhotoUploadForm tableNumber={params.tableNumber} />;
} 