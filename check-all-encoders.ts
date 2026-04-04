"import { execSync } from 'child_process';\ntry {\n  const output = execSync('ffmpeg -encoders').toString();\n  console.log(output);\n} catch (e) {\n  console.error('ffmpeg failed');\n}\n"
