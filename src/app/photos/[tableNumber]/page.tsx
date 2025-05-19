import PhotoUploadForm from './PhotoUploadForm';

type Props = {
  params: {
    tableNumber: string;
  };
};

export default function Page({ params }: Props) {
  return <PhotoUploadForm tableNumber={params.tableNumber} />;
} 