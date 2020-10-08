import React, { useState } from 'react';
import cx from 'classnames';
import { toast } from 'react-toastify';
import styles from './DropZone.module.css';

function DropZone({ onLoad, parseFunction }) {
  const onInputFileHandler = event => {
    parseFunction(event.target.files).then(data => {
      // toast.success('Файл прочитан успешно', { autoClose: 3000 });
      onLoad(data);
    }).catch(error => {
      // onFileLoadError(error);
      console.error(error);
      toast.error(error, { autoClose: 3000 });
    });
  }

  const onDragOverHandler = event => {
    event.stopPropagation();
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy'; 
    setDragOver(true);
  }

  const onDragLeaveHandler = () => {
    setDragOver(false);
  }

  const onDropHandler = event => {
    event.stopPropagation();
    event.preventDefault();
    setDragOver(false);
    parseFunction(event.dataTransfer.files).then(data => {
      // console.log('parsed:', data);
      // toast.success('Файл прочитан успешно', { autoClose: 3000 });
      onLoad(data);
    }).catch(error => {
      console.error(error);
      toast.error(error, { autoClose: 3000 });
    });
  }

  const [isDragOver, setDragOver] = useState(false);

  return (
    <div className={styles.dropZoneContainer}>
      <div 
        className={cx(styles.dropZone, {[styles.dragOver]: isDragOver})} 
        onDragOver={onDragOverHandler} 
        onDragLeave={onDragLeaveHandler} 
        onDrop={onDropHandler}
      >
        <div className={styles.text}>Перетащите файл с таблицей сюда</div>
        <input className={styles.fileInput} type="file" onChange={onInputFileHandler} />
      </div>
    </div>
  );
}

export default DropZone;
