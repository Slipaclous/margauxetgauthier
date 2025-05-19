import PhotoUploadForm from './PhotoUploadForm';
import { Metadata } from 'next';
import { PageParams } from './types';

export const metadata: Metadata = {
  title: 'Photos',
};

export default function Page({ params }: { params: PageParams }) {
  return <PhotoUploadForm tableNumber={params.tableNumber} />;
} 