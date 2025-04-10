
/**
 * Utility functions for audio analysis (pitch and volume detection)
 */

/**
 * Estimate pitch from audio data using autocorrelation
 * @param analyser AnalyserNode to get audio data from
 * @param audioContext AudioContext to get sample rate
 * @returns Estimated pitch in Hz
 */
export const getPitch = (analyser: AnalyserNode, audioContext: AudioContext): number => {
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Float32Array(bufferLength);
  analyser.getFloatTimeDomainData(dataArray);

  // Simple autocorrelation to estimate pitch
  let maxCorrelation = 0;
  let bestOffset = -1;
  for (let offset = 20; offset < bufferLength / 2; offset++) {
    let correlation = 0;
    for (let i = 0; i < bufferLength - offset; i++) {
      correlation += Math.abs(dataArray[i] - dataArray[i + offset]);
    }
    if (correlation > maxCorrelation) {
      maxCorrelation = correlation;
      bestOffset = offset;
    }
  }

  if (bestOffset > 0) {
    const sampleRate = audioContext.sampleRate;
    const pitch = sampleRate / bestOffset; // Hz
    return pitch;
  }
  return 0;
};

/**
 * Get volume level from audio data
 * @param analyser AnalyserNode to get audio data from
 * @returns Volume level (approximate dB)
 */
export const getVolume = (analyser: AnalyserNode): number => {
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  analyser.getByteFrequencyData(dataArray);

  let sum = 0;
  for (let i = 0; i < bufferLength; i++) {
    sum += dataArray[i];
  }
  const average = sum / bufferLength;
  return average; // Approximate dB level
};

/**
 * Initialize audio analysis with Web Audio API
 * @returns Configuration for audio analysis
 */
export const setupAudioAnalysis = async () => {
  try {
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);
    
    return { audioContext, analyser, stream, success: true };
  } catch (error) {
    console.error("Error setting up audio analysis:", error);
    return { success: false };
  }
};

/**
 * Clean up audio resources
 */
export const cleanupAudio = (
  stream: MediaStream | null, 
  audioContext: AudioContext | null
) => {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }
  
  if (audioContext) {
    try {
      audioContext.close().catch(() => {
        // Silently handle any audio context closing errors
      });
    } catch (error) {
      console.error("Error closing audio context:", error);
    }
  }
};
