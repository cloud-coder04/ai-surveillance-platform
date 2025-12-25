import React, { useEffect, useRef } from 'react';
import { Video, AlertCircle } from 'lucide-react';

const CameraFeed = ({ camera, onFrame }) => {
  const videoRef = useRef(null);
  const [error, setError] = React.useState(null);

  useEffect(() => {
    if (camera.source_type === 'webcam') {
      startWebcam();
    }

    return () => {
      stopWebcam();
    };
  }, [camera]);

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: camera.resolution_width,
          height: camera.resolution_height
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      setError('Failed to access webcam');
      console.error(err);
    }
  };

  const stopWebcam = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-2" />
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-auto rounded-lg"
      />
      <div className="absolute top-2 right-2 px-3 py-1 bg-red-600 text-white text-xs rounded-full animate-pulse">
        ● LIVE
      </div>
    </div>
  );
};

export default CameraFeed;