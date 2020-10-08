import countWorkerEntries from './countWorkerEntries';
import normalizeNameForSearch from './normalizeNameForSearch';

export default function countAllWorkerEntries(data, schedule) {
  return new Promise((resolve, reject) => {
    const promises = data.map(({ entries, workerName }) => {
      const scheduleSearchResult = schedule.filter(({ name }) => ( normalizeNameForSearch(name) === normalizeNameForSearch(workerName) ));
      const workerSchedule = scheduleSearchResult[0] || {};
      return countWorkerEntries(entries, workerSchedule, workerName);
    });
    Promise.all(promises).then(smenasByWorker => { 
      resolve({ smenasByWorker });
    });
  });
};
