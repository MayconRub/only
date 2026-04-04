import { execSync } from 'child_process';
try {
  const output = execSync('ffmpeg -codecs | grep aac').toString();
  console.log(output);
} catch (e) {
  console.error('aac not found');
}
