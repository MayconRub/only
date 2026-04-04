import { execSync } from 'child_process';
try {
  const output = execSync('ffmpeg -version').toString();
  console.log(output);
} catch (e) {
  console.error('ffmpeg not found');
}
