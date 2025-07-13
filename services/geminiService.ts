import readXlsxFile, { Row } from 'read-excel-file';
import type { RawPsqiData } from "../types";

// Helper function to map a row from the excel file to our data structure
const mapRowToPsqiData = (row: Row): RawPsqiData => {
  // Convert all cell values to string to be safe for the calculator functions
  const data = row.map(cell => (cell !== null && cell !== undefined ? String(cell) : ''));
  
  // The user's excel format has 23 columns.
  // Mapping based on the provided format:
  // 序号, 所用时间, 填写日期是, 姓名, 您的年龄, 1, 2, 3, 4, 5a, 5b, 5c, 5d, 5e, 5f, 5g, 5h, 5i, 5j, 6, 7, 8, 9
  return {
    id: data[0] || '',
    timeTaken: data[1] || '',
    date: data[2] || '',
    name: data[3] || '',
    age: data[4] || '',
    q1: data[5] || '',
    q2: data[6] || '',
    q3: data[7] || '',
    q4: data[8] || '',
    q5a: data[9] || '',
    q5b: data[10] || '',
    q5c: data[11] || '',
    q5d: data[12] || '',
    q5e: data[13] || '',
    q5f: data[14] || '',
    q5g: data[15] || '',
    q5h: data[16] || '',
    q5i: data[17] || '',
    q5j: data[18] || '',
    q6: data[19] || '',
    q7: data[20] || '',
    q8: data[21] || '',
    q9: data[22] || '',
  };
};

/**
 * Extracts data from an uploaded Excel file.
 * NOTE: The function name is kept as `extractDataFromImage` to minimize changes
 * in the calling component (`App.tsx`), but its functionality has been
 * completely replaced to handle Excel files instead of images.
 * @param file The Excel file uploaded by the user.
 * @returns A promise that resolves to an array of RawPsqiData.
 */
export const extractDataFromImage = async (file: File): Promise<RawPsqiData[]> => {
  try {
    const rows = await readXlsxFile(file);
    
    // Assume the first row is headers and skip it.
    const dataRows = rows.slice(1);
    
    if (dataRows.length === 0) {
      throw new Error("No data rows found in the Excel file.");
    }
    
    if (dataRows[0].length < 23) {
      throw new Error(`Expected at least 23 columns but found ${dataRows[0].length}. Please check the file format.`);
    }

    // Map each data row to the RawPsqiData structure.
    return dataRows.map(mapRowToPsqiData);

  } catch (error) {
    console.error("Error parsing Excel file:", error);
    const message = error instanceof Error ? error.message : "An unknown error occurred.";
    throw new Error(`Could not process the Excel file. Please check the format. Error: ${message}`);
  }
};