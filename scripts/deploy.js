import AWS from 'aws-sdk';
import fs from 'fs';
import archiver from 'archiver';
import { createReadStream, createWriteStream } from 'fs';
import { pipeline } from 'stream';
import { promisify } from 'util';

// Promisify the pipeline function for use with async/await
const pipelineAsync = promisify(pipeline);

// Configure AWS
AWS.config.update({ region: 'us-east-1' });

// Create a Lambda client
const lambda = new AWS.Lambda();

import AdmZip from 'adm-zip';

const zipCurrentDirectory = async (sourceDir, outputFilePath) => {
    const zip = new AdmZip();
    zip.addLocalFolder(sourceDir);
    await zip.writeZipPromise(outputFilePath);
    console.log(`Zip file created: ${outputFilePath}`);
};

// Function to update Lambda function code
const updateLambdaFunction = async (zipFilePath) =>{
  const zipFileContents = await fs.promises.readFile(zipFilePath);

  const params = {
    FunctionName: 'libraryServer-dev-hello',
    ZipFile: zipFileContents
  };

  try {
    const data = await lambda.updateFunctionCode(params).promise();
    console.log('Success', data);
  } catch (err) {
    console.error('Error', err);
  }
}

const deleteFile = async(file) => {
  return fs.unlink(file, (err) => {
    if (err) {
      console.error(err)
      return
    }
    //file removed
  })
}

const zipFilePath = 'server.zip'; // The desired output ZIP file path

async function main() {
  try {
    await zipCurrentDirectory('.', zipFilePath);
    console.log('Project zipped successfully.');
    await updateLambdaFunction(zipFilePath);

    await deleteFile(zipFilePath);
  } catch (err) {
    console.error('Error:', err);
  }
}

main();