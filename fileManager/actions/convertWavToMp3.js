import path from 'path';
import { spawn } from 'child_process';

export function convertWavToMp3 ({ filename, watchDir, processedDir }) {
  return new Promise((resolve, reject) => {
    const fileExtension = path.extname(filename).toLowerCase();
    const isWav = fileExtension === '.wav';
    if ( !isWav ) {
        reject(new Error('Not a wav file'));
        return;
    }

    const inputPath = path.join(watchDir, filename);
    const outputPath = path.join(processedDir, `${path.parse(filename).name}.mp3`);

    const ffmpeg = spawn('ffmpeg', [
      '-i', inputPath,
      '-acodec', 'libmp3lame',
      // TODO: how do we control bit rate? 
      // 'b:a', '256k',
      '-f', 'mp3',
      '-progress', 'pipe:1',
      outputPath
    ]);

    const croppedFilename = filename.length < 60 
      ? filename : `${filename.slice(0, 30)}...${filename.slice(-30)}`;

    const startProcessingTime = Date.now();
    let totalTime = 0;
    let lastLoginTime = 0;
    const logInterval = 1000;
    
    ffmpeg.stdout.on('data', data => {
      const now = Date.now();
      const enoughTimePassed = now - lastLoginTime > logInterval;
      if (enoughTimePassed) {
        const elapsedTime = (Date.now() - startProcessingTime) / 1000;
        const output = data.toString();
        const match = output.match(/out_time_ms=(\d+)/);

        if (match && totalTime) {
          const processedTimeInFile = parseInt(match[1]) / 1000;
          const percent = Math.floor(processedTimeInFile / totalTime * 100);
          process.stdout.write(`\nProcessing ${croppedFilename}: ${elapsedTime.toFixed(2)}s, ${percent}% complete`);
        }

        lastLoginTime = now;
      }
    });

    ffmpeg.stderr.on('data', data => {
      const output = data.toString();
      if (!totalTime) {
        const durationMatch = output.match(/Duration: (\d{2}):(\d{2}):(\d{2})\.(\d{2})/);
        if (durationMatch) {
          totalTime = getTotalMs(durationMatch);
        }
      }      
    });

    ffmpeg.on('close', code => {
      if (code === 0) {
        resolve('');
      } else {
        reject(new Error(`<<<<<<<< FFmpeg process exited with code ${code} >>>>>>>>`));
      }
    });

    ffmpeg.on('error', err => {
      reject(new Error(`<<<<<<< FFmpeg process error: ${err.message} >>>>>>>`));
    });
  });
}

function getTotalMs (durationMatch) {
  const [, hours, minutes, seconds, centiseconds] = durationMatch;
  const hourMs = parseInt(hours) * 3600 * 1000;
  const minuteMs = parseInt(minutes) * 60 * 1000;
  const secondMs = parseInt(seconds) * 1000;
  const centisecondsMs = parseInt(centiseconds) * 10;
  return hourMs + minuteMs + secondMs + centisecondsMs;
}
