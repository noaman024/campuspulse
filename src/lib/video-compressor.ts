/**
 * Client-Side Smart Video Compressor
 * Compresses videos (MP4, MOV, WEBM) directly in the browser using HTML5 Video + MediaRecorder API.
 * Preserves high visual quality while dramatically reducing file size.
 */

export interface CompressionProgress {
  percent: number;
  originalSizeMb: number;
  compressedSizeMb?: number;
  status: "loading" | "compressing" | "finishing" | "done" | "error";
  error?: string;
}

export async function compressVideoClient(
  file: File,
  onProgress?: (progress: CompressionProgress) => void
): Promise<{ compressedFile: Blob; dataUri: string; compressedSizeMb: number }> {
  const originalSizeMb = Number((file.size / (1024 * 1024)).toFixed(1));

  onProgress?.({
    percent: 5,
    originalSizeMb,
    status: "loading",
  });

  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.preload = "auto";
    video.muted = true;
    video.playsInline = true;

    const sourceUrl = URL.createObjectURL(file);
    video.src = sourceUrl;

    video.onerror = () => {
      URL.revokeObjectURL(sourceUrl);
      reject(new Error("Could not load video for compression. Please check file format."));
    };

    video.onloadedmetadata = async () => {
      try {
        const duration = video.duration || 10;
        // Keep crisp HD resolution: max 1280x720 or native if smaller
        let width = video.videoWidth || 1280;
        let height = video.videoHeight || 720;

        const maxDimension = 1280;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        // Ensure even dimensions for video codecs
        width = width % 2 === 0 ? width : width - 1;
        height = height % 2 === 0 ? height : height - 1;

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d", { alpha: false });

        if (!ctx) {
          throw new Error("Canvas 2D context not available");
        }

        // Target high-quality stream at 30 FPS
        const stream = canvas.captureStream(30);

        // Capture audio track if video has audio
        try {
          const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
          const sourceNode = audioCtx.createMediaElementSource(video);
          const destNode = audioCtx.createMediaStreamDestination();
          sourceNode.connect(destNode);
          const audioTracks = destNode.stream.getAudioTracks();
          if (audioTracks.length > 0) {
            stream.addTrack(audioTracks[0]);
          }
        } catch {
          // Silent fallback if audio context cannot capture
        }

        // Choose best supported codec
        let mimeType = "video/webm;codecs=vp9,opus";
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = "video/webm;codecs=vp8,opus";
        }
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = "video/webm";
        }
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = "video/mp4";
        }

        // Optimized bitrate: 2.2 Mbps gives crystal-clear 720p/1080p HD while reducing size significantly
        const videoBitsPerSecond = 2200000;
        const recorder = new MediaRecorder(stream, {
          mimeType: MediaRecorder.isTypeSupported(mimeType) ? mimeType : undefined,
          videoBitsPerSecond,
        });

        const chunks: Blob[] = [];
        recorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) {
            chunks.push(e.data);
          }
        };

        recorder.onstop = async () => {
          URL.revokeObjectURL(sourceUrl);
          const compressedBlob = new Blob(chunks, { type: recorder.mimeType || "video/webm" });
          const compressedSizeMb = Number((compressedBlob.size / (1024 * 1024)).toFixed(1));

          onProgress?.({
            percent: 95,
            originalSizeMb,
            compressedSizeMb,
            status: "finishing",
          });

          // Convert to Data URI for storage
          const reader = new FileReader();
          reader.onload = () => {
            const dataUri = reader.result as string;
            onProgress?.({
              percent: 100,
              originalSizeMb,
              compressedSizeMb,
              status: "done",
            });
            resolve({
              compressedFile: compressedBlob,
              dataUri,
              compressedSizeMb,
            });
          };
          reader.onerror = () => {
            // Fallback to object URL if base64 reader fails
            const objUrl = URL.createObjectURL(compressedBlob);
            resolve({
              compressedFile: compressedBlob,
              dataUri: objUrl,
              compressedSizeMb,
            });
          };
          reader.readAsDataURL(compressedBlob);
        };

        recorder.start(100);
        video.currentTime = 0;
        await video.play();

        let animationFrameId: number;
        const drawFrame = () => {
          if (video.paused || video.ended) return;
          ctx.drawImage(video, 0, 0, width, height);

          // Update progress
          const currentProgress = Math.min(90, Math.round((video.currentTime / duration) * 85) + 10);
          onProgress?.({
            percent: currentProgress,
            originalSizeMb,
            status: "compressing",
          });

          animationFrameId = requestAnimationFrame(drawFrame);
        };

        animationFrameId = requestAnimationFrame(drawFrame);

        video.onended = () => {
          cancelAnimationFrame(animationFrameId);
          ctx.drawImage(video, 0, 0, width, height);
          setTimeout(() => {
            if (recorder.state === "recording") {
              recorder.stop();
            }
          }, 300);
        };
      } catch (err) {
        URL.revokeObjectURL(sourceUrl);
        reject(err);
      }
    };
  });
}
