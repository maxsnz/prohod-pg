import XLSX from 'xlsx';

export default function fileReadPromise(file) {
  return new Promise((resolve, reject) => {
    if ((file.type !== 'application/vnd.ms-excel') && (file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
      reject(`Ошибка в ${file.name}: тип файла "${file.type}" не поддерживается`);
      return;
    }

    const reader = new FileReader();
    reader.onload = event => {
      try {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, {type: 'array'});
        resolve(workbook);
      } catch (error) {
        reject(`Ошибка чтения: ${error}`);
        return;
      }
    }
    reader.readAsArrayBuffer(file);
  });
}