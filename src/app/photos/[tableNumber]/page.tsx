import PhotoUploadForm from './PhotoUploadForm';
import { Metadata } from 'next';

interface PageProps {
  params: {
    tableNumber: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}

export const metadata: Metadata = {
  title: 'Photos',
};

export default function Page({ params }: PageProps) {
  return <PhotoUploadForm tableNumber={params.tableNumber} />;
} 