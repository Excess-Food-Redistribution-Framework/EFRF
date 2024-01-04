import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

async function importJsonFile(filePath: string) {
  axios.defaults.baseURL = getBaseURL();
  const apiUrl = 'api/Article/Import';

  try {
    const fileStream = fs.createReadStream(filePath);

    const formData = new FormData();
    formData.append('File', fileStream, { knownLength: fs.statSync(filePath).size, contentType: 'application/json' });

    const response = await axios.post(apiUrl, formData, {
      headers: {
        ...formData.getHeaders(),
        'accept': '*/*',
      },
    });

    console.log(response.data);
  } catch (error) {
    console.error('Error importing JSON file\n', error);
  }
}

function getBaseURL(): string {
  const envFilePath = '.env'; // Adjust the file path as needed

  try {
    const envFileContent = fs.readFileSync(envFilePath, 'utf-8');
    const apiUrl = envFileContent.match(/VITE_API_BASE_URL=(.+)/)?.[1];

    if (!apiUrl) {
      throw new Error('API base URL not found in the environment file.');
    }

    return apiUrl;
  } catch (error) {
    // @ts-ignore
    console.error('Error reading environment file:', error.message);
    process.exit(1);
  }
}

const filePath = process.argv[2];

if (!filePath) {
  console.error('Please provide the file path as a command line argument.');
} else {
  importJsonFile(filePath);
}
