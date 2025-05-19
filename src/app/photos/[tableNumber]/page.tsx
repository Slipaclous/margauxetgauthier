import PhotoUploadForm from './PhotoUploadForm';

export default function Page({
  params,
}: {
  params: { tableNumber: string };
}) {
  return <PhotoUploadForm tableNumber={params.tableNumber} />;
} 