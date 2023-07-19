import fs from 'fs';

export class FileGeneratorUtil {
    static async createFile(filePath, content) {
        try {
            await fs.promises.writeFile(filePath, content);
            console.log(`File "${filePath}" created successfully.`);
        } catch (error) {
            console.error(`Error creating file "${filePath}":`, error);
        }
    }
}