import Papa from 'papaparse';

const loadCSV = async (path) => {
    const response = await fetch(path);
    const reader = response.body.getReader();
    const result = await reader.read(); // read all the content
    const decoder = new TextDecoder('utf-8');
    const csv = decoder.decode(result.value); // decode the Uint8Array to a string
    return Papa.parse(csv, { header: true }).data; // parse CSV data
}


export default loadCSV;