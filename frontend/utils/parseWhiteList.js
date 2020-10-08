import fileReadPromise from './fileReadPromise';

export default function parseFile(files) {
  return new Promise((resolve, reject) => {
    fileReadPromise(files[0]).then(workbook => {
      try {
        const firstSheetName = workbook.SheetNames[0];

        const worksheet = workbook.Sheets[firstSheetName];
        // console.log(worksheet);

        const allKeysMap = Object.keys(worksheet).filter(key => key.substr(0, 1) === 'A');
        const allValues = allKeysMap.map(key => worksheet[key].v);
        resolve(allValues);
      } catch (error) {
        reject(`ошибка парсинга: ${error}`);
        return;
      }
    });
  });
}