import PhotoUploadForm from './PhotoUploadForm';

interface PageProps {
  params: {
    tableNumber: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function PhotoUploadPage({ params }: PageProps) {
  return <PhotoUploadForm tableNumber={params.tableNumber} />;
} 